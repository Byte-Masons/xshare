import { ethers } from "ethers";
import { getContract } from "./common";
import { getBalance } from "./tshare";
const reaperVaultABI = require("../abi/ReaperVault.json");
let reaperVaultContract = null;
export const vaultAddress = "0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07";

export const getReaperVaultContract = () =>
  getContract(reaperVaultContract, vaultAddress, reaperVaultABI);

export const getVaultBalance = async () => {
  const vaultContract = getReaperVaultContract();
  return await getBalance(vaultContract);
};

export const depositTShare = async (amount) => {
  const contract = getReaperVaultContract();
  return await contract.deposit(amount);
};
