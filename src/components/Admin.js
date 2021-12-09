import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {
  increaseTimeInSeconds,
  increaseTimeInEpochs,
  mineBlock,
  harvest,
} from "../api/admin";

export default function Admin({}) {
  const [state, setState] = useState({
    secondsToAdd: 1,
  });

  const handleSecondsToAddChange = (event) => {
    const newAmount = event.target.value;
    if (newAmount !== state.secondsToAdd && newAmount >= 1) {
      setState({ ...state, secondsToAdd: newAmount });
    }
  };

  const addSeconds = async () => {
    try {
      await increaseTimeInSeconds(state.secondsToAdd);
    } catch (error) {}
  };

  return (
    <div>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>Admin</div>
      </Stack>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>Seconds to move forward:</div>
        <TextField
          id="outlined-basic"
          label="Seconds"
          variant="outlined"
          type="number"
          value={state.secondsToAdd}
          onChange={handleSecondsToAddChange}
        />
        <Button variant="outlined" onClick={addSeconds}>
          Add seconds
        </Button>
      </Stack>
    </div>
  );
}
