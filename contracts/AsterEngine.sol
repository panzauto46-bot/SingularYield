// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IAsterDEX.sol";
import "./interfaces/IStackingRouter.sol";

/**
 * @title AsterEngine
 * @dev The strategy engine that auto-compounds yield from AsterDEX.
 * Acts as the 'anchor' for SingularityVault funds.
 */
contract AsterEngine is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable asset;
    IAsterDEX public immutable asterDex;
    address public vault;
    IStackingRouter public stackingRouter;

    event Deployed(uint256 amount);
    event Withdrawn(uint256 amount);
    event EmergencyUnwind(uint256 amount);
    event Harvested(uint256 amount);

    modifier onlyVault() {
        require(msg.sender == vault, "AsterEngine: caller is not the vault");
        _;
    }

    constructor(address _asset, address _asterDex, address _vault) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset");
        require(_asterDex != address(0), "Invalid AsterDEX");
        require(_vault != address(0), "Invalid Vault");
        
        asset = IERC20(_asset);
        asterDex = IAsterDEX(_asterDex);
        vault = _vault;
    }

    function setStackingRouter(address _stackingRouter) external onlyOwner {
        require(address(stackingRouter) == address(0), "StackingRouter already set");
        stackingRouter = IStackingRouter(_stackingRouter);
    }

    function deployCapital(uint256 amount) external onlyVault {
        uint256 balance = asset.balanceOf(address(this));
        require(balance >= amount, "AsterEngine: insufficient balance");

        asset.approve(address(asterDex), amount);
        asterDex.deposit(amount);
        
        emit Deployed(amount);
    }

    function withdrawCapital(uint256 amount) external onlyVault {
        asterDex.withdraw(amount);
        asset.safeTransfer(vault, amount);
        
        emit Withdrawn(amount);
    }

    function totalAssets() external view returns (uint256) {
        return asset.balanceOf(address(this)) + asterDex.balanceOf(address(this));
    }

    uint256 public constant MAX_BOUNTY = 500; // 5% max
    uint256 public bountyBps = 100; // 1% default (Basis Points)

    function setBountyBps(uint256 _bountyBps) external onlyOwner {
        require(_bountyBps <= MAX_BOUNTY, "Bounty too high");
        bountyBps = _bountyBps;
    }

    /**
     * @dev Harvest yield, pay keeper bounty, and compound remainder.
         * Callable by anyone (Keeper).
     */
    function harvest() external {
        require(address(stackingRouter) != address(0), "StackingRouter not set");
        
        address rewardToken = asterDex.rewardToken();
        uint256 startBal = IERC20(rewardToken).balanceOf(address(this));
        
        // 1. Claim from AsterDEX
        try asterDex.harvest() {
            // Success
        } catch {
            revert("AsterDEX harvest failed");
        }
        
        uint256 endBal = IERC20(rewardToken).balanceOf(address(this));
        
        if (endBal > startBal) {
            uint256 totalReward = endBal - startBal;
            
            // 2. Calculate Bounty
            uint256 bounty = (totalReward * bountyBps) / 10000;
            uint256 compoundAmount = totalReward - bounty;
            
            // 3. Pay Keeper
            if (bounty > 0) {
                IERC20(rewardToken).safeTransfer(msg.sender, bounty);
            }
            
            // 4. Send remainder to StackingRouter
            if (compoundAmount > 0) {
                IERC20(rewardToken).safeTransfer(address(stackingRouter), compoundAmount);
                stackingRouter.processYield(compoundAmount);
            }
            
            emit Harvested(totalReward);
        }
    }

    function emergencyUnwind() external onlyOwner {
        try asterDex.emergencyWithdraw() {
            // Success
        } catch {
            uint256 staked = asterDex.balanceOf(address(this));
            if (staked > 0) {
                asterDex.withdraw(staked);
            }
        }

        uint256 total = asset.balanceOf(address(this));
        if (total > 0) {
            asset.safeTransfer(vault, total);
        }

        emit EmergencyUnwind(total);
    }
}
