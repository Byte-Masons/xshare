import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { getBlockTimestamp } from "../api/blockchain";
import { harvest } from "../api/strategy";
import { allocateSeigniorage, getEpoch, getNextEpochPoint } from "../api/tomb";
import { getVaultBalance, getAvailableVaultBalance } from "../api/vault";
import useToastContext from "../hooks/UseToastContext";

export default function Admin({}) {
  const [state, setState] = useState({
    currentEpoch: null,
    currentTimestamp: null,
    nextEpochPoint: null,
    vaultBalance: null,
    availableVaultBalance: null,
  });

  const { onSuccess, onError } = useToastContext();

  useEffect(() => {
    if (state.currentEpoch == null && state.currentTimestamp == null) {
      update();
    }
  }, []);

  const update = async () => {
    try {
      const currentEpoch = Number(await getEpoch());
      const currentTimestamp = Number(await getBlockTimestamp());
      const nextEpochPoint = Number(await getNextEpochPoint());
      const vaultBalance = Number(await getVaultBalance());
      const availableVaultBalance = Number(await getAvailableVaultBalance());
      setState({
        ...state,
        currentEpoch,
        currentTimestamp,
        nextEpochPoint,
        vaultBalance,
        availableVaultBalance,
      });
    } catch (error) {
      onError(error.data.message);
    }
  };

  const handleHarvest = async () => {
    try {
      const tx = await harvest();
      const receipt = await tx.wait();
      if (receipt.status) {
        onSuccess("Harvest succeeded");
      }
    } catch (error) {
      onError(error.data.message);
    }
  };

  const handleAllocateSeigniorage = async () => {
    try {
      const tx = await allocateSeigniorage();
      const receipt = await tx.wait();
      if (receipt.status) {
        onSuccess("allocateSeigniorage succeeded");
      }
    } catch (error) {
      onError(error.data.message);
    }
  };

  return (
    <div>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Current epoch: {state.currentEpoch}
        </div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Current timestamp: {state.currentTimestamp}
        </div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Time to next epoch: {state.nextEpochPoint - state.currentTimestamp}
        </div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>Vault TVL: {state.vaultBalance}</div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Vault available TVL: {state.availableVaultBalance}
        </div>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={handleAllocateSeigniorage}>
          Allocate seigniorage
        </Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={handleHarvest}>
          Harvest
        </Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={update}>
          Update data
        </Button>
      </Stack>
    </div>
  );
}
