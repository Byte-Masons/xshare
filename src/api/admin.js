import { ethers } from "ethers";
const strategyABI = require("../abi/ReaperAutoCompound-Masonry.json");
const strategyAddress = "0x162A433068F51e18b7d13932F27e66a3f99E6890";
let strategyContract = null;

export const increaseTimeInSeconds = async (secondsToAdd) => {
  // await network.provider.send("evm_increaseTime", [secondsToAdd]);
};

export const increaseTimeInEpochs = async (epochsToAdd) => {
  // await network.provider.send("evm_increaseTime", [epochsToAdd]);
};

export const mineBlock = async () => {}; //await network.provider.send("evm_mine");

export const harvest = async () => await getStrategyContract().harvest();

const getStrategyContract = () => {
  if (strategyContract == null) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    strategyContract = new ethers.Contract(
      strategyAddress,
      strategyABI,
      signer
    );
  }

  return strategyContract;
};
