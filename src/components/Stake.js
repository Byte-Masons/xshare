import React from "react";
import Stack from "@mui/material/Stack";

export default function Stake({ tshareBalance }) {
  return (
    <div>
      <Stack spacing={2} direction="row">
        <div style={{ lineHeight: 3.2 }}>TShare in wallet: {tshareBalance}</div>
      </Stack>
    </div>
  );
}
