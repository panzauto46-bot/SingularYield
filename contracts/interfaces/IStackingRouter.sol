// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IStackingRouter {
    function processYield(uint256 amount) external;
    function stakedBalance() external view returns (uint256);
}
