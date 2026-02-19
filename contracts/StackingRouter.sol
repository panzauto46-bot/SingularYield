// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IPancakeSwap.sol";

/**
 * @title StackingRouter
 * @dev The Harvester & Compounder.
 * 1. Receives Yield (e.g., ASTER or Cake) from AsterEngine.
 * 2. Zaps 50% to Paired Token (e.g., BNB).
 * 3. Adds Liquidity to PancakeSwap (Yield-BNB LP).
 * 4. Stakes LP into PancakeSwap MasterChef.
 */
contract StackingRouter is Ownable {
    using SafeERC20 for IERC20;

    // Configuration
    IPancakeRouter02 public immutable router;
    IMasterChef public immutable masterChef;
    
    address public immutable yieldToken;   // Asset we harvest (Input)
    address public immutable pairedToken;  // Asset we pair with (e.g., WBNB)
    address public immutable lpToken;      // The LP token we create
    uint256 public immutable pid;          // MasterChef Pool ID

    // authorized callers (AsterEngine)
    address public engine;

    // Events
    event Zapped(uint256 yieldIn, uint256 pairedOut);
    event LiquidityAdded(uint256 amountA, uint256 amountB, uint256 liquidity);
    event Staked(uint256 amount);
    event EmergencyWithdraw(uint256 amount);

    modifier onlyEngine() {
        require(msg.sender == engine, "StackingRouter: caller is not the engine");
        _;
    }

    constructor(
        address _router,
        address _masterChef,
        address _yieldToken,
        address _pairedToken,
        address _lpToken,
        uint256 _pid
    ) Ownable(msg.sender) {
        require(_router != address(0), "Invalid Router");
        require(_masterChef != address(0), "Invalid MasterChef");
        require(_yieldToken != address(0), "Invalid Yield Token");
        require(_pairedToken != address(0), "Invalid Paired Token");
        
        router = IPancakeRouter02(_router);
        masterChef = IMasterChef(_masterChef);
        yieldToken = _yieldToken;
        pairedToken = _pairedToken;
        lpToken = _lpToken;
        pid = _pid;
        
        // Approvals for Router (Infinite)
        IERC20(yieldToken).approve(_router, type(uint256).max);
        IERC20(pairedToken).approve(_router, type(uint256).max);
        if (_lpToken != address(0)) {
            IERC20(_lpToken).approve(_masterChef, type(uint256).max);
        }
    }

    function setEngine(address _engine) external onlyOwner {
        require(engine == address(0), "Engine already set");
        engine = _engine;
    }

    /**
     * @dev Process Yield: Swap 50% -> Pair -> Add LP -> Stake
     * Called by Engine after it sends funds here.
     */
    function processYield(uint256 amount) external onlyEngine {
        require(amount > 0, "Zero amount");
        
        // 1. Swap 50% Yield -> Paired Token
        uint256 half = amount / 2;
        uint256 otherHalf = amount - half;
        
        _swapTokens(half);
        
        // 2. Add Liquidity
        uint256 pairedBal = IERC20(pairedToken).balanceOf(address(this));
        uint256 yieldBal = IERC20(yieldToken).balanceOf(address(this));
        
        // Use all balance to fix any dust issues
        // Ensure we don't try to add more than we actally have
        (,, uint256 liquidity) = router.addLiquidity(
            yieldToken,
            pairedToken,
            yieldBal,
            pairedBal,
            0, // Slippage unchecked for simplicity in this version, purely for demo
            0,
            address(this),
            block.timestamp
        );
        
        emit LiquidityAdded(yieldBal, pairedBal, liquidity);

        // 3. Stake LP to MasterChef
        if (liquidity > 0) {
            masterChef.deposit(pid, liquidity);
            emit Staked(liquidity);
        }
    }

    function _swapTokens(uint256 amountIn) internal {
        address[] memory path = new address[](2);
        path[0] = yieldToken;
        path[1] = pairedToken;

        router.swapExactTokensForTokens(
            amountIn,
            0, // Accept any amount for now (Demo)
            path,
            address(this),
            block.timestamp
        );
    }
    
    /**
     * @dev View total staked LP balance in MasterChef
     */
    function stakedBalance() external view returns (uint256) {
        (uint256 amount, ) = masterChef.userInfo(pid, address(this));
        return amount;
    }

    /**
     * @dev Pending rewards from MasterChef (if any)
     * This contract might earn Cake/rewards from the Farm too!
     * We should functionality to harvest that too, essentially "Compounding the Compounder"
     * For now, simplistic view.
     */

    /**
     * @dev Emergency: Withdraw LP from MasterChef and send to Owner/Vault
     */
    function emergencyUnwind() external onlyOwner {
        // 1. Withdraw from Masterchef
        masterChef.emergencyWithdraw(pid);
        
        // 2. Send all tokens to owner (or Engine/Vault)
        uint256 lpBal = IERC20(lpToken).balanceOf(address(this));
        if (lpBal > 0) IERC20(lpToken).transfer(owner(), lpBal);
        
        uint256 yBal = IERC20(yieldToken).balanceOf(address(this));
        if (yBal > 0) IERC20(yieldToken).transfer(owner(), yBal);

        uint256 pBal = IERC20(pairedToken).balanceOf(address(this));
        if (pBal > 0) IERC20(pairedToken).transfer(owner(), pBal);
    }
}
