import Box from "@mui/material/Box";
import { ConnectWallet } from "@thirdweb-dev/react";
import React, { useReducer } from "react";
import { initialState, reducer } from "../../store/reducer";

export const ConnectWalletButton: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Box>
      <ConnectWallet theme={state.isDarkMode ? "dark" : "light"} />
    </Box>
  );
};
