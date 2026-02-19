// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AsterEngine.sol";

/**
 * @title SingularityVault
 * @dev The Core Vault: "The Self-Driving Yield Engine".
 * Accepts USDT/BNB deposits, mints shares (svTokens), and deploys capital via AsterEngine.
 * 100% Non-custodial: Users control their funds via shares.
 */
contract SingularityVault is ERC20, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable asset;
    AsterEngine public engine;

    event Deposit(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);
    event EmergencyUnwind(uint256 totalRecovered);

    error ZeroAssets();
    error ZeroShares();
    error ExceedsBalance();
    error EngineNotSet();

    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(address(_asset) != address(0), "Invalid asset");
        asset = _asset;
    }

    /**
     * @dev Sets the AsterEngine address. Can only be set once.
     */
    function setEngine(AsterEngine _engine) external onlyOwner {
        require(address(engine) == address(0), "Engine already set");
        require(address(_engine) != address(0), "Invalid engine");
        engine = _engine;
    }

    /**
     * @dev Returns the total amount of underlying assets managed by the Vault.
     * Includes idle assets in Vault + assets deployed in Engine.
     */
    function totalAssets() public view returns (uint256) {
        if (address(engine) == address(0)) return asset.balanceOf(address(this));
        
        // Total managed = Vault Balance + Engine Total Assets (which includes AsterDEX stake)
        return asset.balanceOf(address(this)) + engine.totalAssets();
    }

    /**
     * @dev Deposit underlying assets (e.g., USDT) into the Vault.
     * Mints shares (svTokens) to the receiver.
     * Automatically deploys capital to AsterEngine for yield generation.
     */
    function deposit(uint256 assets, address receiver) external nonReentrant returns (uint256 shares) {
        if (address(engine) == address(0)) revert EngineNotSet();
        if (assets == 0) revert ZeroAssets();

        // 1. Calculate shares to mint
        // Share Price = TotalAssets / TotalSupply
        // If TotalSupply = 0, initial price is 1:1
        uint256 supply = totalSupply();
        uint256 totalManaged = totalAssets();
        
        if (supply == 0) {
            shares = assets;
        } else {
            shares = (assets * supply) / totalManaged;
        }

        if (shares == 0) revert ZeroShares();

        // 2. Transfer assets from user to Vault
        asset.safeTransferFrom(msg.sender, address(this), assets);

        // 3. Mint shares to receiver
        _mint(receiver, shares);

        // 4. Deploy capital to Engine (Auto-Invest)
        // Transfer to Engine first, then call deploy
        asset.safeTransfer(address(engine), assets);
        engine.deployCapital(assets);

        emit Deposit(msg.sender, receiver, assets, shares);
    }

    /**
     * @dev Withdraw underlying assets by burning shares.
     * Redeems proportional share of total assets.
     */
    function withdraw(uint256 shares, address receiver, address owner) external nonReentrant returns (uint256 assets) {
        if (address(engine) == address(0)) revert EngineNotSet();
        if (shares == 0) revert ZeroShares();
        if (balanceOf(owner) < shares) revert ExceedsBalance();
        if (msg.sender != owner && allowance(owner, msg.sender) < shares) revert ExceedsBalance();

        // 1. Calculate assets to withdraw
        // Assets = (Shares * TotalAssets) / TotalSupply
        uint256 supply = totalSupply();
        assets = (shares * totalAssets()) / supply;

        if (assets == 0) revert ZeroAssets();

        // 2. Check if Vault has enough idle liquidity
        uint256 idle = asset.balanceOf(address(this));
        if (idle < assets) {
            // Not enough idle, withdraw from Engine
            uint256 needed = assets - idle;
            engine.withdrawCapital(needed); 
            // Engine transfers back to Vault
        }

        // 3. Burn shares
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }
        _burn(owner, shares);

        // 4. Transfer assets to receiver
        asset.safeTransfer(receiver, assets);

        emit Withdraw(msg.sender, receiver, assets, shares);
    }

    /**
     * @dev Emergency Unwind: Withdraws ALL capital from AsterEngine back to Vault.
     * Critical for safety in case of strategy issues.
     * Only owner can call. Does NOT block withdrawals (Non-custodial).
     */
    function emergencyUnwind() external onlyOwner {
        if (address(engine) == address(0)) revert EngineNotSet();

        uint256 beforeBal = asset.balanceOf(address(this));
        
        // Trigger Engine unwind
        engine.emergencyUnwind();
        
        uint256 afterBal = asset.balanceOf(address(this));
        
        emit EmergencyUnwind(afterBal - beforeBal);
    }
}
