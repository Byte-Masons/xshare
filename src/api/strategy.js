import { getContract } from "./common";
const strategyABI = require("../abi/ReaperAutoCompound-Masonry.json");
const strategyAddress = "0x162A433068F51e18b7d13932F27e66a3f99E6890";
let strategyContract = null;

const getStrategyContract = () => {
  return getContract(strategyContract, strategyAddress, strategyABI);
};

export const harvest = async () => await getStrategyContract().harvest();
