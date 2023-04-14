// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import {Router,TX_Object} from "../contracts/core/Router.sol";

contract RouterTest is Test {
    function setUp() public {}

    function testFailEmptyArray() public {
        Router router = new Router();
        TX_Object[] memory txs;
        router.executeTransactions(txs);
    }
}
