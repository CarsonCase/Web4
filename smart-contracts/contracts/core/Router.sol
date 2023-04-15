//SPDX-License-Identifier: None
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

            TX_Object memory _tx = toExecute[i];
            uint balBefore = IERC20(_tx.out_token).balanceOf(_tx.receiver);
            if(_tx.in_am > 0){
                IERC20(_tx.in_token).transferFrom(msg.sender, _tx.smartContract, _tx.in_am);
            }
            IPlugin(_tx.smartContract).executeTransaction(_tx.in_token, _tx.in_am, _tx.out_token, _tx.min_out_am, _tx.receiver, _tx.data);
            uint balAfter = IERC20(_tx.out_token).balanceOf(_tx.receiver);

            if(balAfter - balBefore < _tx.min_out_am){
                revert ExecutionError(_tx, "Implementation failed to return a sufficient amount");
            }
        }
    }

}
