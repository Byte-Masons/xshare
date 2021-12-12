import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { getBlockTimestamp } from "../api/blockchain";
import { harvest } from "../api/strategy";
import { allocateSeigniorage, getEpoch } from "../api/tomb";

export default function Admin({}) {
  const [state, setState] = useState({
    currentEpoch: null,
    currentTimestamp: null,
  });

  useEffect(() => {
    if (state.currentEpoch == null && state.currentTimestamp == null) {
      async function startFetchingEpoch() {
        const currentEpoch = Number(await getEpoch());
        const timestamp = await getBlockTimestamp();
        setState({ ...state, currentEpoch, timestamp });
      }
      startFetchingEpoch();
    }
  });

  const updateTimestamp = async () => {
    const timestamp = await getBlockTimestamp();
    setState({ ...state, timestamp });
  };

  const updateEpoch = async () => {
    const currentEpoch = Number(await getEpoch());
    setState({ ...state, currentEpoch });
  };

  return (
    <div>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Current epoch: {state.currentEpoch}
        </div>
      </Stack>
      <Button variant="outlined" onClick={updateEpoch}>
        Update epoch
      </Button>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>
          Current timestamp: {state.timestamp}
        </div>
        <Button variant="outlined" onClick={updateTimestamp}>
          Update timestamp
        </Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={allocateSeigniorage}>
          Allocate seigniorage
        </Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={harvest}>
          Harvest
        </Button>
      </Stack>
    </div>
  );
}
