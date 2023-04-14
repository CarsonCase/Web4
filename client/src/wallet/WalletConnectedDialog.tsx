import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useAddress } from "@thirdweb-dev/react";
import { useSnackbar } from "notistack";
import React, { memo } from "react";

interface IProps {
  walletConnedDialogOpen: boolean;
  handleCloseWalletConnectedDialog: () => void;
  handleWalletDisconnect: () => void;
}

const WalletConnectedDialog: React.FC<IProps> = ({
  walletConnedDialogOpen,
  handleCloseWalletConnectedDialog,
  handleWalletDisconnect,
}) => {
  const theme = useTheme();
  const address = useAddress();

  const { enqueueSnackbar } = useSnackbar();

  const copyAddress = () => {
    const copyText = document.getElementById("wallet-address") as any;

    if (copyText) {
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */

      /* Copy the text inside the text field */
      document.execCommand("copy");

      /* Alert the copied text */
      enqueueSnackbar("Copied!", { variant: "success" });
    }
  };

  const handleLogout = () => {
    handleWalletDisconnect();
    handleCloseWalletConnectedDialog();
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={walletConnedDialogOpen}
      onClose={handleCloseWalletConnectedDialog}
      aria-labelledby="wallet-connected"
      sx={{ margin: 0, width: "100%" }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: theme.typography.h3.fontSize,
        }}
      >
        <Typography variant="h4" color="textPrimary" component="p">
          Your wallet
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleCloseWalletConnectedDialog}
          color="primary"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {address && (
        <>
          <DialogContent dividers>
            <input
              value={address}
              style={{
                all: "unset",
                width: "100%",
                color: theme.palette.text.primary,
                ...theme.typography.body1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              readOnly
              id="wallet-address"
            />
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: theme.spacing(2),
              }}
            >
              <Button
                color="primary"
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<LaunchIcon />}
                variant="outlined"
              >
                View on Etherscan
              </Button>
              <Button
                onClick={copyAddress}
                color="primary"
                variant="outlined"
                endIcon={<FileCopyIcon />}
                style={{ marginLeft: theme.spacing(3) }}
              >
                Copy Address
              </Button>
            </Box>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              onClick={handleLogout}
              color="primary"
              variant="outlined"
              endIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default memo(WalletConnectedDialog);
