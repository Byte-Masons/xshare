import { getContract } from "./common";
const masonABI = require("../abi/Mason.json");
let masonContract = null;

const getMasonContract = (masonAddress) => {
  return getContract(masonContract, masonAddress, masonABI);
};

export const getMasonData = async (masonAddress) => {
  const contract = getMasonContract(masonAddress);
  const balance = Number(await contract.balanceOf());
  const earned = Number(await contract.earned());
  const canClaimReward = await contract.canClaimReward();
  const canWithdraw = await contract.canWithdraw();
  return {
    balance,
    earned,
    canClaimReward,
    canWithdraw,
    address: masonAddress,
  };
};
