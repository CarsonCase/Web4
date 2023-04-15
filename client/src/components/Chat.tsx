import SendIcon from "@mui/icons-material/Send";
import { OutlinedInput } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAddress } from "@thirdweb-dev/react";
import axios from "axios";
import { ethers } from "ethers";
import React, { ChangeEvent, useReducer } from "react";
import RouterAbi from "../assets/builds/router.abi.json";
import { initialState, reducer } from "../store/reducer";

import { Messages } from "./Messages";

const drawerWidth = 240;

export const Chat = () => {
  const details = "ETH: 1.24";

  const plugins = [
    {
      Name: "Uniswap",
      Tags: "DEX, Decentralized Exchange, Swap",
      Desc: "DEX used to swap between two ERC20 tokens",
      Format: {
        inToken: "Input variable here (must be in balance). Ex: 'ETH'",
        inAmount:
          "Input inToken amount variable willing to trade. (Multiply the user input amount by 10 to the eighteenth power. (if its not in WEI)",
        outToken: "Input token to trade for here. Ex: 'USDC'",
        outAmount: "0",
        receiver:
          "Input address here. Ex: 0x7Fde98e05855A500497A093FFEd98569D66709e9",
      },
    },
    {
      Name: "Superfluid",
      Tags: "Payments, Streaming",
      Desc: "Streams payments in real time between addresses",
      Format: {
        smartContract: "ALWAYS leave as 'None'",
        in_token:
          "Input inToken amount variable willing to trade. (Multiply the user input amount by 10 to the eighteenth power. (if its not in WEI)",
        in_am: "Amount specified by user",
        out_token:
          "This variable is only used when cancelling a stream. It'll be the same thing as in_token",
        min_out_am: "0",
        data: "This portion is the stream rate (ALWAYS IN WEI TOKENS PER SECOND). If the user doesn't input seconds or WEI, convert their response into seconds and WEI for them.",
      },
    },
  ];

  const sample_output = `[
      {
          "Name": "Uniswap",
          "Tags": "DEX, Decentralized Exchange, Swap",
          "Desc": "DEX used to swap between two ERC20 tokens",
          "Format": {
              smartContract: "None",
              in_token: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              in_am: "240000000000000000",
              out_token: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              min_out_am: "0",
              receiver: "0x7Fde98e05855A500497A093FFEd98569D66709e9",
              data: "0x",
          }
      }`;

  const initial_messages = [
    {
      role: "system",
      content: `
  You are Web4, a helpful digital financial assistant and advisor who exists to help users build and manage crypto portfolios who always RECOMMENDS THE USER BACK TO YOUR MAIN FUNCTIONS VIA Metamask AND PREDEFINED PROTOCOLS!
  If a user asks for investment advice, always give specific investment advice that tailors to the needs of the user.
  If a user wants to trade a cryptocurrency, they can ONLY do so via their connected Metamask account which is ALREADY connected and Uniswap (no need to confirm).
  Do not ask users if their accounts are connected, assume they already are. Do not refer them to go on uniswap. You can do all of these functions internally.
  DO NOT MENTION ANYTHING BESIDES METAMASK, UNISWAP, and SUPERFLUID (WHICH YOU HAVE INTERNAL ACCESS TO)
  Through Metamask, YOU HAVE THE POWER to transact (assume you don't know the market price), view account balances, and engage in investment-related strategies (and activities that you deem similar).
  Assume the user's Metamask account is already connected (do not ask them if it's connected etc.)
  If a user wishes to buy a currency, infer what logical currencies they can trade on what exchange and for what pair.
  The user's account balance is as follows, transactions can only be made using existing currencies in the balance: ${details}
  
  If the user wishes to engage in a transaction, ask the user which network they'd like to use (Polygon or Celo)
  You do not have access to real-time market data.
  If a user wishes to sell their currency, do not ask their desired sell price amount, only state market price (you don't current know the market price).
  You cannot sell currencies for FIAT.
  To confirm if a user wishes to trade a currency, Mention the following details using natural language. Do not EVER directly mention the schema when requesting fill-in details: ${plugins}. Do not initially describe the schema to the user. Make it very legible and friendly.
  ALWAYS input the variables into the input schema in the EXACT SAME FORMAT.
  ALWAYS SEPARATE THE SCHEMA WITH AN <> AT THE BEGINNING AND A </> AT THE ENDING OF THE SCHEMA DETAILS!!! (applies to Uniswap and Superfluid transactions) AND NEVER EVER FORGET TO RETURN THE SCHEMA DETAILS: ${plugins}
  
  An example output response is as follows (Mention SEPARATE transactions details using easy to understand natural language prior to mentioning the following output. THIS IS DIFFERENT THAN THE OUTPUT FORMAT SCHEMA) Also, only send the output schema if the user has confirmed the transaction:
  
  ${sample_output}
  
  outAmount is ALWAYS the integer 0
  
  When a user enters a currency, such as 'ETH' into inToken or in_Token, ALWAYS fetch the token address for ETH (IT IS NEVER THE ADDRESS THE USER ENTERS) from the specified network that they chose (Polygon or Celo, and input the address for that network into inToken or in_Token rather than the token symbol)
  Also, fetch the token address for the outToken as well (just like inToken and in_Token, it is also NEVER THE ADDRESS THE USER ENTERS)
  Any stream requests MUST be initiated through Superfluid. Not Uniswap.
  If a user is cancelling a stream, set data to 0 in the format portion of the Superfluid schema. (do not mention this to the user, this is something for the backend)
  
  All you're doing is initiating a transaction. You do not know if the transaction was successful. (do not mention this)
  You do not recommend interaction with any UIs. You can directly enter transactions etc here in this chat.
  You are even able to help users interact with several protocols, you are not required to mention these protocols, but do so if they seem relevant to their needs.
  Reiterate what you're programmed to do if irrelevant questions are asked. They are as follows: ${plugins}
  `,
    },
  ];

  const [text, setText] = React.useState("");
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [messageList, setMessageList] = React.useState<any>(initial_messages);
  const [state, dispatch] = useReducer(reducer, initialState);
  const address = useAddress();
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (isSending) return;
    if (event.key === "Enter") {
      handleOnSubmit();
    }
  };

  const handleDoTransaction = async () => {
    if (!address) return;
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0xAd2E22902Db4eD78E49F180A572C81a36D105075",
      RouterAbi,
      signer
    );
    const tx = await contract.executeTransactions([
      {
        smartContract: "0x72c9fD47758D1b3a56b94c198aD6b040ECfDdB24",
        in_token: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        in_am: "0",
        out_token: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        min_out_am: "0",
        receiver: address,
        data: "0x3860256825",
      },
    ]);
    await tx.wait();
    console.log(tx);
    // await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    // const provider = new ethers.providers.Web3Provider(
    //   (window as any).ethereum
    // );

    // const blah = provider.getSigner();

    // const contract = new ethers.Contract(
    //   "0xAd2E22902Db4eD78E49F180A572C81a36D105075",
    //   RouterAbi,
    //   blah
    // );
    // await contract.functions.executeTransactions([
    //   {
    //     smartContract: "0x72c9fD47758D1b3a56b94c198aD6b040ECfDdB24",
    //     in_token: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    //     in_am: "0",
    //     out_token: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    //     min_out_am: "0",
    //     receiver: "0x12345",
    //     data: "3860256825",
    //   },
    // ]);
  };

  const handleOnSubmit = async () => {
    let response: any;
    try {
      setText("");
      setIsSending(true);

      const _copyMessageList = JSON.parse(JSON.stringify(messageList));
      _copyMessageList.push({ role: "user", content: text });
      setMessageList(_copyMessageList);
      const url =
        "https://pxjraiea3miarma4uhfqncorle0ajmhl.lambda-url.ap-southeast-2.on.aws";
      response = await axios.post(
        url,
        {
          payload: _copyMessageList,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const _newCopyMessageList = JSON.parse(JSON.stringify(_copyMessageList));
      _newCopyMessageList.push(response.data);
      setMessageList(_newCopyMessageList);
      console.log("response", response);
    } catch (ex) {
      console.log("Error with sending to lambda", ex);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Content */}
        <Box sx={{ flexGrow: 1, pb: 50 }}>
          <Messages messageList={messageList} />
        </Box>

        {/* Input */}
        <AppBar
          position="fixed"
          elevation={0}
          color="transparent"
          sx={{
            top: "auto",
            bottom: 0,
            paddingLeft: `${drawerWidth}px`,
            WebkitBackdropFilter: "blur(8px)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Toolbar>
            <OutlinedInput
              id="standard-adornment-password"
              type="text"
              value={text}
              sx={{ mb: 2 }}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
              fullWidth
              disabled={isSending}
              placeholder='Ask me "how much USD worth in my wallet?"'
              endAdornment={
                <InputAdornment position="end">
                  <IconButton disabled={!text} onClick={handleOnSubmit}>
                    <SendIcon color={!text ? "inherit" : "primary"} />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};
