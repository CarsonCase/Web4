import React, { Dispatch } from "react";
import { ComponentActions, IState } from "./reducer";

export const GlobalAppContext = React.createContext<{
  state: IState;
  dispatch: Dispatch<ComponentActions>;
}>({} as any);
