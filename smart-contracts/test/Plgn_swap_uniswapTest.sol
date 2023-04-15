// SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/plgn_swap_uniswap.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract Plgn_swap_uniswapTest is Test {
    uint256 polygonFork;

    address DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    address WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

    Plgn_swap_uniswap instance;

    function setUp() public {
        polygonFork = vm.createFork("https://polygon-mainnet.g.alchemy.com/v2/iQn6fZKGOVV0MFqU45Grq9KV6TaeblWr");
        vm.selectFork(polygonFork);
        vm.startPrank(0xF977814e90dA44bFA03b6295A0616a897441aceC);

        instance = new Plgn_swap_uniswap(ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564));
        IERC20(DAI).transfer(address(instance), 1e18);
    }

    function testSwap() public{
        console.log(IERC20(DAI).balanceOf(address(instance)));
        uint balBefore = IERC20(WETH).balanceOf(0xF977814e90dA44bFA03b6295A0616a897441aceC);
        instance.executeTransaction(DAI, 1e18, WETH, 0, 0xF977814e90dA44bFA03b6295A0616a897441aceC, "");
        uint balAfter = IERC20(WETH).balanceOf(0xF977814e90dA44bFA03b6295A0616a897441aceC);

        assertGt(balAfter, balBefore);
        vm.stopPrank();
    }
}
