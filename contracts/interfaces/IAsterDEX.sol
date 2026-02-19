// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAsterDEX {
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function emergencyWithdraw() external;
    function balanceOf(address account) external view returns (uint256);
    function totalStaked() external view returns (uint256);
}
