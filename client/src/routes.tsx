import React from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { Home } from "./pages/Home";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
];
