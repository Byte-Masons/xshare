import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { getBlockTimestamp } from "../api/blockchain";
import { harvest, getCanWithdraw, getBalanceOfStakedToken, getBalanceOf } from "../api/strategy";
import { allocateSeigniorage, getEpoch, getNextEpochPoint } from "../api/tomb";
import {
  getVaultBalance,
  getAvailableVaultBalance,
  addToWhitelist,
} from "../api/vault";
import useToastContext from "../hooks/UseToastContext";
import { displayError } from "../helpers/error";

export default function Admin({}) {
  const [state, setState] = useState({
    currentEpoch: null,
    currentTimestamp: null,
    nextEpochPoint: null,
    vaultBalance: null,
    availableVaultBalance: null,
    addressToWhitelist: "",
    canWithdraw: null,
    balanceDuringCurrentEpoch: null,
    balanceOf: null
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
      const canWithdraw = await getCanWithdraw();
      const balanceOfStakedToken = await getBalanceOfStakedToken();
      const balanceOf = await getBalanceOf();
      setState({
        ...state,
        currentEpoch,
        currentTimestamp,
        nextEpochPoint,
        vaultBalance,
        availableVaultBalance,
        canWithdraw,
        balanceOfStakedToken,
        balanceOf,
      });
    } catch (error) {
      displayError(error, onError);
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
      displayError(error, onError);
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
      displayError(error, onError);
    }
  };

  const handleAddressToWhitelistChange = (event) => {
    const newValue = event.target.value;
    console.log(newValue);
    setState({ ...state, addressToWhitelist: newValue });
  };

  const handleAddToWhitelist = async () => {
    await addToWhitelist(state.addressToWhitelist);
  };

  return (
    <div>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Current epoch: {state.currentEpoch}, current mason index : {state.currentEpoch%6}
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
        <div style={{ lineHeight: 3.2 }}>
          Withdrawable amount (in TShare): {state.balanceOfStakedToken}
        </div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Balance of Pool (in TShare): {state.balanceOf}
        </div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Can withdraw: {state.canWithdraw ? "Yes" : "No"}
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
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>Address to whitelist:</div>
        <TextField
          id="outlined-basic"
          label="Address"
          variant="outlined"
          type="string"
          value={state.addressToWhitelist}
          onChange={handleAddressToWhitelistChange}
        />
        <Button variant="outlined" onClick={handleAddToWhitelist}>
          Add to whitelist
        </Button>
      </Stack>
    </div>
  );
}
