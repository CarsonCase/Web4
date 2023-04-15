// SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/plgn_payment_superfluid.sol";
import { ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import {
    SuperTokenV1Library
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

contract Plgn_swap_uniswapTest is Test {
    using SuperTokenV1Library for ISuperToken;

    uint256 polygonFork;
    address DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    address WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
    int96 flowRate = 1000;
    address superToken;

    Plgn_payment_superfluid instance;
    function setUp() public {
        polygonFork = vm.createFork("https://polygon-mainnet.g.alchemy.com/v2/iQn6fZKGOVV0MFqU45Grq9KV6TaeblWr");
        vm.selectFork(polygonFork);
        instance = new Plgn_payment_superfluid();
        vm.startPrank(0xF977814e90dA44bFA03b6295A0616a897441aceC);

        superToken = instance.superTokensByBase(DAI);
        ISuperToken(superToken).setFlowPermissions(address(instance), true, true, true, flowRate);

        IERC20(DAI).transfer(address(instance), 1e18);
    }

    function testNetworkCorrect() external{
        assertEq(superToken, 0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2);
    }

    function testStartAndStopSteam() external{
        console.log(msg.sender);
        uint balBefore = ISuperToken(superToken).balanceOf(0xAEB478F060B582d3E8d752bcb3430B59FAe4cAF3);
        
        bytes memory data;
        data = abi.encode(flowRate);
        
        instance.executeTransaction(DAI, 1e18, address(0), 0, 0xAEB478F060B582d3E8d752bcb3430B59FAe4cAF3, data);
        vm.warp(block.timestamp+24*60*60);
        instance.executeTransaction(address(0), 1e18, DAI, 0, 0xAEB478F060B582d3E8d752bcb3430B59FAe4cAF3, "");
        console.log(balBefore);
        console.log(ISuperToken(superToken).balanceOf(0xAEB478F060B582d3E8d752bcb3430B59FAe4cAF3));
        assertEq(ISuperToken(superToken).balanceOf(0xAEB478F060B582d3E8d752bcb3430B59FAe4cAF3), balBefore + (uint96(flowRate) * 24*60*60));

        // todo test superfluid tokens were really received
    }

}
