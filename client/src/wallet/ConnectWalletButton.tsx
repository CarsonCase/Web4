import Button from "@mui/material/Button";
import { useAddress, useMetamask, useWallet } from "@thirdweb-dev/react";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import WalletConnectedDialog from "./WalletConnectedDialog";

interface IProps {
  setIsLoading: (value: boolean) => void;
}

export const ConnectWalletButton: React.FC<IProps> = ({ setIsLoading }) => {
  const connectWithMetamask = useMetamask();
  const { enqueueSnackbar } = useSnackbar();
  const address = useAddress();
  const wallet = useWallet();

  const [walletConnedDialogOpen, setWalletConnedDialogOpen] =
    useState<boolean>(false);

  // useEffect(() => {
  //   if (wallet?.getAddress) {
  //     enqueueSnackbar(wallet.error.message, { variant: "error" });
  //     console.log(wallet.error.message);
  //   }
  // }, [wallet.error]);

  useEffect(() => {
    if (address) {
      enqueueSnackbar("Wallet Connected!", { variant: "success" });

      // Using ref would be better but that is much further in the dom tree
      document.getElementById("mint-container")?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    }
  }, [address]);

  const handleWalletConnect = async () => {
    setIsLoading(true);
    try {
      await connectWithMetamask();
    } catch (ex) {
      // Error will get caught in the useEffect function
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletDisconnect = () => {
    wallet?.disconnect();
    enqueueSnackbar("Wallet Disconnected!", { variant: "success" });
  };

  const handleOpenWalletConnectedDialog = () => {
    setWalletConnedDialogOpen(true);
  };

  const handleCloseWalletConnectedDialog = () => {
    setWalletConnedDialogOpen(false);
  };

  const handleConnectWalletButtonClick = () => {
    // If wallet is connected, then open the connected wallet dialog, else connect wallet
    address ? handleOpenWalletConnectedDialog() : handleWalletConnect();
  };

  return (
    <>
      <Button
        onClick={handleConnectWalletButtonClick}
        variant="contained"
        size="large"
      >
        {address ? address : "Connect Wallet"}
      </Button>
      <WalletConnectedDialog
        walletConnedDialogOpen={walletConnedDialogOpen}
        handleCloseWalletConnectedDialog={handleCloseWalletConnectedDialog}
        handleWalletDisconnect={handleWalletDisconnect}
      />
    </>
  );
};
