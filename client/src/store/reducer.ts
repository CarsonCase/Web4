export interface IState {
  isDarkMode: boolean;
  isWalletConnected: boolean;
  rugInstance: any | null;
  lotteryInstance: any | null;
  masterRugInstance: any | null;
  userAddress: string | null;
  showConnectWalletDialog: boolean;
}

export const initialState: IState = {
  isDarkMode: true,
  isWalletConnected: false,
  rugInstance: null,
  lotteryInstance: null,
  masterRugInstance: null,
  userAddress: null,
  showConnectWalletDialog: false,
};

export enum ActionTypes {
  SET_IS_DARK_MODE = "SET_IS_DARK_MODE",
  SET_IS_WALLET_CONNECTED = "SET_IS_WALLET_CONNECTED",
  SET_USER_ADDRESS = "SET_USER_ADDRESS",
  SET_RUG_INSTANCE = "SET_RUG_INSTANCE",
  SET_LOTTERY_INSTANCE = "SET_LOTTERY_INSTANCE",
  SET_MASTER_RUG_INSTANCE = "SET_MASTER_RUG_INSTANCE",
  SET_SHOW_CONNECT_WALLET_DIALOG = "SET_SHOW_CONNECT_WALLET_DIALOG",
}

interface ISetIsDarkMode {
  type: ActionTypes.SET_IS_DARK_MODE;
  payload: boolean;
}

interface ISetIsWalletConnected {
  type: ActionTypes.SET_IS_WALLET_CONNECTED;
  payload: boolean;
}

interface ISetUserAddress {
  type: ActionTypes.SET_USER_ADDRESS;
  payload: string | null;
}

interface ISetRugInstance {
  type: ActionTypes.SET_RUG_INSTANCE;
  payload: any;
}

interface ISetLotteryInstance {
  type: ActionTypes.SET_LOTTERY_INSTANCE;
  payload: any;
}

interface ISetMasterRugInstance {
  type: ActionTypes.SET_MASTER_RUG_INSTANCE;
  payload: any;
}

interface ISetShowConnectWalletDialog {
  type: ActionTypes.SET_SHOW_CONNECT_WALLET_DIALOG;
  payload: boolean;
}

export type ComponentActions =
  | ISetIsDarkMode
  | ISetIsWalletConnected
  | ISetUserAddress
  | ISetLotteryInstance
  | ISetRugInstance
  | ISetShowConnectWalletDialog
  | ISetMasterRugInstance;

export const reducer: React.Reducer<IState, ComponentActions> = (
  state,
  action
) => {
  switch (action.type) {
    case ActionTypes.SET_IS_DARK_MODE:
      return {
        ...state,
        isDarkMode: action.payload,
      };
    case ActionTypes.SET_IS_WALLET_CONNECTED:
      return { ...state, isWalletConnected: action.payload };
    case ActionTypes.SET_RUG_INSTANCE:
      return { ...state, rugInstance: action.payload };
    case ActionTypes.SET_LOTTERY_INSTANCE:
      return { ...state, lotteryInstance: action.payload };
    case ActionTypes.SET_MASTER_RUG_INSTANCE:
      return { ...state, masterRugInstance: action.payload };
    case ActionTypes.SET_USER_ADDRESS:
      return { ...state, userAddress: action.payload };
    case ActionTypes.SET_SHOW_CONNECT_WALLET_DIALOG:
      return { ...state, showConnectWalletDialog: action.payload };

    default:
      return state;
  }
};
