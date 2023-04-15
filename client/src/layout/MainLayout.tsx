import { styled } from "@mui/material/styles";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayoutRoot = styled("div")(({ theme }) => ({
  // backgroundColor: theme.palette.background.paper,
  // display: "flex",
  // height: "100%",
  // overflow: 'hidden',
  // width: "100%",
}));

export const MainLayout = () => (
  <MainLayoutRoot>
    <Outlet />
  </MainLayoutRoot>
);
