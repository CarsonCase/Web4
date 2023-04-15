//SPDX-License-Identifier: None
pragma solidity ^0.8.19;

interface IPlugin {
    function executeTransaction(address, uint, address, uint, address, bytes memory) external;
}
