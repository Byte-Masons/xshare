import { ethers } from "ethers";
import { getContract } from "./common";
const strategyABI = require("../abi/ReaperAutoCompound-Masonry.json");
const strategyAddress = "0x15A7b695f4670962abd000B33502734f9a899679";
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

export const getCanWithdraw = async () => {
  const contract = getStrategyContract();
  return await contract.canWithdraw();
};

export const getBalanceOfStakedToken = async () => {
  const contract = getStrategyContract();
  const balanceOfStakedToken = parseInt(ethers.BigNumber.from(await contract.balanceOfStakedToken())._hex,16);
  return balanceOfStakedToken;
}

export const getBalanceOf = async () => {
  const contract = getStrategyContract();
  const balanceOf = parseInt(ethers.BigNumber.from(await contract.balanceOf())._hex,16);
  return balanceOf;
}