import React from "react";
import Stack from "@mui/material/Stack";

export default function Mason({
  masonNr,
  balance,
  earned,
  canClaimReward,
  canWithdraw,
}) {
  const getBoolText = (b) => (b ? "Yes" : "No");
  return (
    <Stack spacing={2} direction="row">
      <div style={{ lineHeight: 3.2 }}>{masonNr}</div>
      <div style={{ lineHeight: 3.2 }}>Balance: {balance}</div>
      <div style={{ lineHeight: 3.2 }}>Earned: {earned}</div>
      <div style={{ lineHeight: 3.2 }}>
        Claim: {getBoolText(canClaimReward)}
      </div>
      <div style={{ lineHeight: 3.2 }}>
        Withdraw: {getBoolText(canWithdraw)}
      </div>
    </Stack>
  );
}
