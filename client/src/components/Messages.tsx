import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

interface IProps {
  messageList: any;
}
interface IMessage {
  content: string;
  role: string;
}

export const Messages: React.FC<IProps> = ({ messageList }) => {
  if (messageList.length === 1 && messageList[0].role === "system")
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          backgroundColor: "#999999",

          borderRadius: "24px",
          p: 5,
        }}
      >
        <Box
          component="img"
          src="https://res.cloudinary.com/dpaucaa0u/image/upload/v1681586704/Web4Chat/web4_logo.png"
          alt="Web4 Logo"
          sx={{ width: "50%" }}
        />
        <Typography variant="h2" component="h2" align="center" sx={{ mb: 3 }}>
          Welcome to Web4 Chat!
        </Typography>
        <Typography variant="body2" component="p" sx={{ mb: 3 }}>
          Web4 aims to simplify crypto portfolios by interfacing with GPT-4s
          natural language processing instead of confusing webapp GUIs. Our
          framework offers an intuitive alternative that is network-agnostic and
          easy for developers to build their own modules.
        </Typography>
        <Typography variant="h4" component="h4">
          Try it out below!👇
        </Typography>
      </Box>
    );

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
            <Box
              component="img"
              sx={{ width: "100%" }}
              src="https://res.cloudinary.com/dpaucaa0u/image/upload/v1681586704/Web4Chat/web4_logo.png"
            ></Box>
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
