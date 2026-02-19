// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IAsterDEX.sol";

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

    event Deployed(uint256 amount);
    event Withdrawn(uint256 amount);
    event EmergencyUnwind(uint256 amount);

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

    /**
     * @dev Deploys capital to AsterDEX.
     * Can only be called by the Vault.
     */
    function deployCapital(uint256 amount) external onlyVault {
        uint256 balance = asset.balanceOf(address(this));
        require(balance >= amount, "AsterEngine: insufficient balance");

        asset.approve(address(asterDex), amount);
        asterDex.deposit(amount);
        
        emit Deployed(amount);
    }

    /**
     * @dev Withdraws capital from AsterDEX and sends back to Vault.
     * Can only be called by the Vault.
     */
    function withdrawCapital(uint256 amount) external onlyVault {
        asterDex.withdraw(amount);
        asset.safeTransfer(vault, amount);
        
        emit Withdrawn(amount);
    }

    /**
     * @dev Returns total assets managed by this strategy (Engine balance + AsterDEX balance).
     */
    function totalAssets() external view returns (uint256) {
        return asset.balanceOf(address(this)) + asterDex.balanceOf(address(this));
    }

    /**
     * @dev Emergency function to withdraw all funds from AsterDEX to this contract,
     * then send everything to the Vault.
     */
    function emergencyUnwind() external onlyOwner {
        // 1. Withdraw everything from AsterDEX
        try asterDex.emergencyWithdraw() {
            // Success
        } catch {
            // Fallback if emergencyWithdraw fails or doesn't exist, try normal withdraw loop
            uint256 staked = asterDex.balanceOf(address(this));
            if (staked > 0) {
                asterDex.withdraw(staked);
            }
        }

        // 2. Send all held assets back to Vault
        uint256 total = asset.balanceOf(address(this));
        if (total > 0) {
            asset.safeTransfer(vault, total);
        }

        emit EmergencyUnwind(total);
    }

    /**
     * @dev Harvest yield (auto-compound). 
     * In a real implementation, this would claim rewards and reinvest.
     * For now, it's a placeholder or pass-through if AsterDEX auto-compounds.
     */
    function harvest() external {
        // Implementation depends on AsterDEX yield mechanism
    }
}
