import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Stake from "./Stake";
import { getTShareBalance } from "../api/tokens";

export default function FarmWrapper() {
  const [state, setState] = useState({
    tab: "1",
    tshareBalance: null,
    rfTokenBalance: null,
  });

  const handleTabChange = (event, newValue) => {
    setState({ ...state, tab: newValue });
  };

  useEffect(() => {
    if (state.tshareBalance == null) {
      async function fetchTShareBalance() {
        const balance = await getTShareBalance();
        setState({ ...state, tshareBalance: Number(balance) });
      }
      fetchTShareBalance();
    }
  });

  return (
    <Box
      sx={{
        typography: "body1",
        bgcolor: "#80d8ff",
      }}
    >
      <TabContext value={state.tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange} centered>
            <Tab label="Stake" value="1" />
            <Tab label="Unstake" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Stake tshareBalance={state.tshareBalance} />
        </TabPanel>
        <TabPanel value="2">Unstake</TabPanel>
      </TabContext>
    </Box>
  );
}
