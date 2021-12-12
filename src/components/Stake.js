import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { hasApprovedTShare, approveTShare } from "../api/tshare";
import { depositTShare } from "../api/vault";
import useToastContext from "../hooks/UseToastContext";

export default function Stake({ tshareBalance, vaultBalance }) {
  const [state, setState] = useState({
    stakeTShareAmount: 0,
    hasApprovedTShare: null,
  });

  const { onSuccess, onError } = useToastContext();

  useEffect(() => {
    if (state.hasApprovedTShare == null) {
      async function fetchHasApproved() {
        try {
          const hasApproved = await hasApprovedTShare();
          setState({ ...state, hasApprovedTShare: hasApproved });
        } catch (error) {
          onError(error.data.message);
        }
      }
      fetchHasApproved();
    }
  }, []);

  const amountChanged = (event) => {
    const newAmount = event.target.value;
    if (
      newAmount !== state.stakeTShareAmount &&
      newAmount >= 0 &&
      newAmount <= tshareBalance
    ) {
      setState({ ...state, stakeTShareAmount: newAmount });
    }
  };

  const stakeTShare = async () => {
    try {
      const tx = await depositTShare(state.stakeTShareAmount);
      const receipt = await tx.wait();
      if (receipt.status) {
        onSuccess("Staking succeeded");
      }
    } catch (error) {
      onError(error.data.message);
    }
  };

  const handleApprove = async () => {
    const setHasApproved = (hasApproved) =>
      setState({ ...state, hasApprovedTShare: hasApproved });
    try {
      const tx = await approveTShare(setHasApproved);
      const receipt = await tx.wait();
      if (receipt.status) {
        onSuccess("Approval succeeded");
      }
    } catch (error) {
      onError(error.data.message);
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
        <div style={{ lineHeight: 3.2 }}>TShare amount to stake:</div>
        <TextField
          id="outlined-basic"
          label="TShare"
          variant="outlined"
          type="number"
          value={state.stakeTShareAmount}
          onChange={amountChanged}
        />
        <Button
          variant="outlined"
          onClick={handleApprove}
          disabled={state.hasApprovedTShare}
        >
          Approve
        </Button>
        <Button
          variant="outlined"
          onClick={stakeTShare}
          disabled={!state.hasApprovedTShare}
        >
          Stake
        </Button>
      </Stack>
    </div>
  );
}
