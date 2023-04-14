//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {IPlugin} from "./IPlugin.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct TX_Object{
    address smartContract;
    address in_token;
    uint in_am;
    address out_token;
    uint min_out_am;
    address receiver;
    bytes data;
}

contract Router {

    error ExecutionError(TX_Object, string);

    function executeTransactions(TX_Object[] calldata toExecute) external{
        require(toExecute.length != 0, "Cannot call with an empty array");
        for(uint i; i < toExecute.length; i++){
            TX_Object memory tx = toExecute[i];
            uint balBefore = IERC20(tx.smartContract).balanceOf(tx.receiver);
            IPlugin(tx.smartContract).executeTransaction(tx.in_token, tx.in_am, tx.out_token, tx.min_out_am, tx.receiver, tx.data);
            uint balAfter = IERC20(tx.smartContract).balanceOf(tx.receiver);

            if(balAfter - balBefore < tx.min_out_am){
                revert ExecutionError(tx, "Implementation failed to return a sufficient amount");
            }
        }
    }

}
