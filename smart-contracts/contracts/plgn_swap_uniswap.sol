//SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import {IPlugin} from "./core/IPlugin.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract Plgn_swap_uniswap is IPlugin{
    ISwapRouter public immutable swapRouter;

    uint24 public constant poolFee = 3000;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function executeTransaction(address inToken, uint inAmount, address outToken, uint minOutAmount, address receiver, bytes memory data) external{
        TransferHelper.safeApprove(inToken, address(swapRouter), inAmount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: inToken,
                tokenOut: outToken,
                fee: poolFee,
                recipient: receiver,
                deadline: block.timestamp,
                amountIn: inAmount,
                amountOutMinimum: minOutAmount,
                sqrtPriceLimitX96: 0
            });

        swapRouter.exactInputSingle(params);
    }
}