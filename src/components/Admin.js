import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { getBlockTimestamp } from "../api/blockchain";
import { harvest } from "../api/strategy";
import { allocateSeigniorage, getEpoch } from "../api/tomb";
import useToastContext from "../hooks/UseToastContext";

export default function Admin({}) {
  const [state, setState] = useState({
    currentEpoch: null,
    currentTimestamp: null,
  });

  const { onSuccess, onError } = useToastContext();

  useEffect(() => {
    if (state.currentEpoch == null && state.currentTimestamp == null) {
      async function startFetchingEpoch() {
        try {
          const currentEpoch = Number(await getEpoch());
          const timestamp = await getBlockTimestamp();
          setState({ ...state, currentEpoch, timestamp });
        } catch (error) {
          onError(error.data.message);
        }
      }
      startFetchingEpoch();
    }
  });

  const updateTimestamp = async () => {
    try {
      const timestamp = await getBlockTimestamp();
      setState({ ...state, timestamp });
    } catch (error) {
      onError(error.data.message);
    }
  };

  const updateEpoch = async () => {
    try {
      const currentEpoch = Number(await getEpoch());
      setState({ ...state, currentEpoch });
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
        <Button variant="outlined" onClick={updateEpoch}>
          Update epoch
        </Button>
      </Stack>

      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Current timestamp: {state.timestamp}
        </div>
        <Button variant="outlined" onClick={updateTimestamp}>
          Update timestamp
        </Button>
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
    </div>
  );
}
