import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {
  harvest,
  getEpoch,
  allocateSeigniorage,
  getBlockTimestamp,
  addSeconds,
} from "../api/admin";

export default function Admin({}) {
  const [state, setState] = useState({
    currentEpoch: null,
    currentTimestamp: null,
    secondsToAdd: 1,
  });

  useEffect(() => {
    if (state.currentEpoch == null && state.currentTimestamp == null) {
      async function startFetchingEpoch() {
        const epoch = Number(await getEpoch());
        const timestamp = await getBlockTimestamp();
        setState({ ...state, currentEpoch: epoch, timestamp });
      }
      startFetchingEpoch();
    }
  });

  const handleSecondsToAddChange = (e) => {
    const newValue = Number(e.target.value);
    console.log(newValue);
    if (newValue > 0) {
      setState({ ...state, secondsToAdd: newValue });
    }
  };

  const updateTimestamp = async () => {
    const timestamp = await getBlockTimestamp();
    setState({ ...state, timestamp });
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
        <div style={{ lineHeight: 3.2 }}>Seconds to add:</div>
        <TextField
          id="outlined-basic"
          label="Seconds"
          variant="outlined"
          type="number"
          value={state.secondsToAdd}
          onChange={handleSecondsToAddChange}
        />
        <Button
          variant="outlined"
          onClick={() => addSeconds(state.secondsToAdd)}
        >
          Add seconds
        </Button>
      </Stack>
    </div>
  );
}
