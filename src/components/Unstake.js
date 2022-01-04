import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { withdrawTShare } from "../api/vault";
import useToastContext from "../hooks/UseToastContext";
import { displayError } from "../helpers/error";

export default function Unstake({ tshareBalance, vaultBalance }) {
  const [state, setState] = useState({
    unstakeTShareAmount: 0,
  });

  const { onSuccess, onError } = useToastContext();

  const amountChanged = (event) => {
    const newAmount = event.target.value;
    if (
      newAmount !== state.unstakeTShareAmount &&
      newAmount >= 0 &&
      newAmount <= vaultBalance
    ) {
      setState({ ...state, unstakeTShareAmount: newAmount });
    }
  };

  const unstakeTShare = async () => {
    try {
      const tx = await withdrawTShare(state.unstakeTShareAmount);
      const receipt = await tx.wait();
      if (receipt.status) {
        onSuccess("Unstaking succeeded");
      }
    } catch (error) {
      displayError(error, onError);
    }
  };

  return (
    <div>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>TShare in wallet: {tshareBalance}</div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>Vault shares: {vaultBalance}</div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>TShare amount to unstake:</div>
        <TextField
          id="outlined-basic"
          label="TShare"
          variant="outlined"
          type="number"
          value={state.unstakeTShareAmount}
          onChange={amountChanged}
        />
        <Button variant="outlined" onClick={unstakeTShare}>
          Unstake
        </Button>
      </Stack>
    </div>
  );
}
