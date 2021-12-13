import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Stake from "./Stake";
import Unstake from "./Unstake";
import Admin from "./Admin";
import Masons from "./Masons";
import { getTShareBalance } from "../api/tshare";
import { getUserVaultBalance } from "../api/vault";
import useToastContext from "../hooks/UseToastContext";
import { displayError } from "../helpers/error";

export default function FarmWrapper() {
  const [state, setState] = useState({
    tab: "1",
    tshareBalance: null,
    vaultBalance: null,
    rfTokenBalance: null,
  });

  const { onSuccess, onError } = useToastContext();

  const handleTabChange = (event, newValue) => {
    setState({ ...state, tab: newValue });
  };

  useEffect(() => {
    if (state.tshareBalance == null) {
      async function fetchTShareBalance() {
        try {
          const balance = await getTShareBalance();
          setState({ ...state, tshareBalance: Number(balance) });
        } catch (error) {
          displayError(error, onError);
        }
      }
      fetchTShareBalance();
    }
    if (state.vaultBalance == null) {
      async function fetchVaultBalance() {
        try {
          const balance = await getUserVaultBalance();
          setState({ ...state, vaultBalance: Number(balance) });
        } catch (error) {
          displayError(error, onError);
        }
      }
      fetchVaultBalance();
    }
  }, []);

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
            <Tab label="Admin" value="3" />
            <Tab label="Masons" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Stake
            tshareBalance={state.tshareBalance}
            vaultBalance={state.vaultBalance}
          />
        </TabPanel>
        <TabPanel value="2">
          <Unstake
            tshareBalance={state.tshareBalance}
            vaultBalance={state.vaultBalance}
          />
        </TabPanel>
        <TabPanel value="3">
          <Admin />
        </TabPanel>
        <TabPanel value="4">
          <Masons />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
