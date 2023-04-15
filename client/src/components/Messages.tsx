import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import Web4Logo from "../assets/images/web4_logo.png";

interface IProps {
  messageList: any;
}
interface IMessage {
  content: string;
  role: string;
}

export const Messages: React.FC<IProps> = ({ messageList }) => {
  if (messageList.length === 0) return <></>;

  console.log("messageList", messageList);

  const renderMessage = (message: IMessage) => {
    if (message.role === "system") return;
    return (
      <Box
        sx={{
          display: "flex",
          gap: 3,
          backgroundColor: message.role === "user" ? "#d4d4d4" : "#999999",
          mt: 3,
          borderRadius: "24px",
          p: 3,
        }}
      >
        <Avatar sx={{ width: 56, height: 56 }}>
          {message.role === "user" ? (
            <PersonIcon />
          ) : (
            <Box component="img" sx={{ width: "100%" }} src={Web4Logo}></Box>
          )}
        </Avatar>
        <Typography>{message.content}</Typography>
      </Box>
    );
  };

  return (
    <>
      {messageList.map((message: IMessage, idx: number) => (
        <React.Fragment key={idx}>{renderMessage(message)}</React.Fragment>
      ))}
    </>
  );
};
