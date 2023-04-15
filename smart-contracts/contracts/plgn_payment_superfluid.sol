//SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import {IPlugin} from "./core/IPlugin.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { 
    ISuperfluid 
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import { 
    ISuperToken 
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

import {
    SuperTokenV1Library
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

import { ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
/** 
* @title Plugin for payment using Superfluid
* @author Carson Case (carsonpcase@gmail.com)
* @dev Functions include options to:
    - begin a stream with token, wrap to supertoken while working
    - end a stream and swap supertokens back to base
*/
contract Plgn_payment_superfluid is IPlugin{
    using SuperTokenV1Library for ISuperToken;
    uint public test = 4;
    mapping(address => address) public superTokensByBase;
    
    error TEST(address);

    constructor(){
        uint256 id;
            assembly {
                id := chainid()
            }
        // Ethereum
        if(id == 1){
            //USDC
            superTokensByBase[0x7EA2be2df7BA6E54B1A9C70676f668455E329d29] = 0x1BA8603DA702602A8657980e825A6DAa03Dee93a;
            //DAI
            superTokensByBase[0x6B175474E89094C44Da98b954EedeAC495271d0F] = 0x4F228bf911ed67730e4B51B1F82AC291B49053ee;
            //ETH
            superTokensByBase[0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2] = 0xC22BeA0Be9872d8B7B3933CEc70Ece4D53A900da;
        }else if(id == 137){
            //USDC
            superTokensByBase[0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174] = 0xCAa7349CEA390F89641fe306D93591f87595dc1F;
            //DAI
            superTokensByBase[0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063] = 0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2;
            //ETH
            superTokensByBase[0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619] = 0x27e1e4E6BC79D93032abef01025811B7E4727e85;
        }else if(id == 42220){
            //CELO
            superTokensByBase[address(0)] = 0x671425Ae1f272Bc6F79beC3ed5C4b00e9c628240;
        }
    }
    function executeTransaction(address inToken, uint inAmount, address outToken, uint minOutAmount, address receiver, bytes memory data) external{
        uint256 word;
        assembly{
            word := mload(add(data, 32))
        }
        int96 flowRate = int96(uint96(word));

        // if data is a value start a stream
        if(flowRate > 0){
            ISuperToken sToken = ISuperToken(superTokensByBase[inToken]);
            require(address(sToken) != address(0));

            IERC20(inToken).approve(address(sToken), inAmount);
            sToken.upgradeTo(msg.sender,inAmount,"");
            sToken.createFlowFrom(msg.sender, receiver, flowRate);
        }
        // else end a stream
        else{
            ISuperToken sToken = ISuperToken(superTokensByBase[outToken]);
            require(address(sToken) != address(0));
            sToken.deleteFlowFrom(msg.sender, receiver);

            uint allowance = sToken.allowance(msg.sender, address(this));
            if(allowance >= minOutAmount && minOutAmount != 0){
                sToken.transferFrom(msg.sender, address(this), minOutAmount);
                sToken.downgrade(minOutAmount);
                IERC20(outToken).transfer(msg.sender,minOutAmount);
            }

        }
    }
}