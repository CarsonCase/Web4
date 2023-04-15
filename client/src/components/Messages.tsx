import { Typography } from "@mui/material";
import React from "react";

interface IProps {
  data: string;
}

export const Messages: React.FC<IProps> = ({ data }) => {
  return <Typography>{data}</Typography>;
};
