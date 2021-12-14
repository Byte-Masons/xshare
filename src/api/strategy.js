import { getContract } from "./common";
const strategyABI = require("../abi/ReaperAutoCompound-Masonry.json");
const strategyAddress = "0x1744BD10eD44E5c5C4EceE8080f720009AceB8eb";
let strategyContract = null;

const getStrategyContract = () => {
  return getContract(strategyContract, strategyAddress, strategyABI);
};

export const harvest = async () => await getStrategyContract().harvest();

export const getMasons = async () => {
  const contract = getStrategyContract();
  const masonsLength = 6;
  const masons = [];
  for (let index = 0; index < masonsLength; index++) {
    const mason = await contract.masons(index);
    masons.push(mason);
  }
  return masons;
};
