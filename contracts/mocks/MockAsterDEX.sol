// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MockAsterDEX
 * @dev Simulates the AsterDEX Earn platform for testing.
 * Tracks deposits per user and can simulate reward distribution.
 */
contract MockAsterDEX {
    using SafeERC20 for IERC20;

    IERC20 public asset;
    IERC20 public _rewardToken;
    mapping(address => uint256) public balances;
    uint256 public _totalStaked;

    constructor(address _asset) {
        asset = IERC20(_asset);
    }

    function setRewardToken(address token) external {
        _rewardToken = IERC20(token);
    }

    function deposit(uint256 amount) external {
        asset.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        _totalStaked += amount;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "MockAsterDEX: insufficient balance");
        balances[msg.sender] -= amount;
        _totalStaked -= amount;
        asset.safeTransfer(msg.sender, amount);
    }

    function emergencyWithdraw() external {
        uint256 bal = balances[msg.sender];
        balances[msg.sender] = 0;
        _totalStaked -= bal;
        asset.safeTransfer(msg.sender, bal);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function totalStaked() external view returns (uint256) {
        return _totalStaked;
    }

    function harvest() external {
        // In tests, we can pre-fund the engine with reward tokens
        // to simulate harvest behavior.
        // This mock just does nothing — tests use balance-before/after pattern.
    }

    function rewardToken() external view returns (address) {
        return address(_rewardToken);
    }
}
