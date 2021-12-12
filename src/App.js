import "./App.css";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MetamaskInfo } from "./components/MetamaskInfo";
import FarmWrapper from "./components/FarmWrapper";
import Grid from "@mui/material/Grid";
import { ToastContextProvider } from "./components/ToastContext";

function App() {
  const [state, setState] = useState({
    isMetaMaskDetected: false,
  });

  useEffect(() => {
    checkMetamask();
  });

  const checkMetamask = async () => {
    if (!state.isMetaMaskDetected) {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();
        if (signer && network) {
          setState({ ...state, isMetaMaskDetected: true });
        }
      } catch (error) {}
    }
  };

  return (
    <ToastContextProvider>
      <div className="App">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            {!state.isMetaMaskDetected ? <MetamaskInfo /> : <FarmWrapper />}
          </Grid>
        </Grid>
      </div>
    </ToastContextProvider>
  );
}

export default App;
