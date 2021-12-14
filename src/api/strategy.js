import { getContract } from "./common";
const strategyABI = require("../abi/ReaperAutoCompound-Masonry.json");
const strategyAddress = "0xAC557425Fbd38361196eE5B5641d551e07Bd88dc";
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
