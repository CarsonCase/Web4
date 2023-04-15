import SendIcon from "@mui/icons-material/Send";
import { OutlinedInput } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useAddress } from "@thirdweb-dev/react";
import axios from "axios";
import { ethers } from "ethers";
import React, { ChangeEvent, useReducer } from "react";
import RouterAbi from "../assets/builds/router.abi.json";
import { initialState, reducer } from "../store/reducer";
import { Messages } from "./Messages";
import { ConnectWalletButton } from "./wallet/ConnectWalletButton";

export const Chat = () => {
  const [text, setText] = React.useState("");
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<any>("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const address = useAddress();

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleKeyDown = (event: any) => {
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
    console.log("text", text);
    try {
      setIsSending(true);
      const url =
        "https://pxjraiea3miarma4uhfqncorle0ajmhl.lambda-url.ap-southeast-2.on.aws";
      response = await axios.post(
        url,
        {
          payload: text,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(response);
      console.log(response);
    } catch (ex) {
      console.log("Error with sending to lambda", ex);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <ConnectWalletButton />
          <Button variant="contained" onClick={handleDoTransaction}>
            Do Transaction
          </Button>
          <Messages data={response?.data?.content} />
        </Box>

        {/* Input */}
        <Box>
          <OutlinedInput
            id="standard-adornment-password"
            type="text"
            value={text}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            fullWidth
            placeholder='Ask me "how much USD worth in my wallet?"'
            endAdornment={
              <InputAdornment position="end">
                {isSending ? (
                  <CircularProgress />
                ) : (
                  <IconButton disabled={!text} onClick={handleOnSubmit}>
                    <SendIcon color={!text ? "inherit" : "primary"} />
                  </IconButton>
                )}
              </InputAdornment>
            }
          />
        </Box>
      </Box>
    </>
  );
};
