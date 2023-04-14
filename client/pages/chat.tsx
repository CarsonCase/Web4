import SendIcon from "@mui/icons-material/Send";
import { OutlinedInput, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import React, { ChangeEvent } from "react";
import { ChatLayout } from "../src/layout/ChatLayout";
import { ConnectWalletButton } from "../src/wallet/ConnectWalletButton";

export default function Chat() {
  const [text, setText] = React.useState("");

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <ChatLayout>
      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography>{text}</Typography>
          <ConnectWalletButton setIsLoading={() => false} />
        </Box>

        {/* Input */}
        <Box>
          <OutlinedInput
            id="standard-adornment-password"
            type="text"
            value={text}
            onChange={handleOnChange}
            fullWidth
            placeholder='Ask me "how much USD worth in my wallet?"'
            endAdornment={
              <InputAdornment position="end">
                <IconButton disabled={!text} onClick={() => null}>
                  <SendIcon color={!text ? "inherit" : "primary"} />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
      </Box>
    </ChatLayout>
  );
}
