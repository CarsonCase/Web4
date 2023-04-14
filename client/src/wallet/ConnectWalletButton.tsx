import { ConnectWallet } from "@thirdweb-dev/react";
import React, { useReducer } from "react";
import { initialState, reducer } from "../store/reducer";

export const ConnectWalletButton: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Fix later OMGGGGGGG UWUUUUU fuck this we better win
  return <ConnectWallet theme={state.isDarkMode ? "dark" : "light"} />;
};
