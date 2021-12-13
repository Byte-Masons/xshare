import { ethers } from "ethers";
import { getContract } from "./common";
import { getBalance } from "./tshare";
const reaperVaultABI = require("../abi/ReaperVault.json");
let reaperVaultContract = null;
export const vaultAddress = "0x0e7c5313E9BB80b654734d9b7aB1FB01468deE3b";

export const getReaperVaultContract = () =>
  getContract(reaperVaultContract, vaultAddress, reaperVaultABI);

export const getUserVaultBalance = async () => {
  const vaultContract = getReaperVaultContract();
  return await getBalance(vaultContract);
};

export const getVaultBalance = async () => {
  const vaultContract = getReaperVaultContract();
  return await vaultContract.balance();
};

export const getAvailableVaultBalance = async () => {
  const vaultContract = getReaperVaultContract();
  return await vaultContract.available();
};

export const depositTShare = async (amount) => {
  const contract = getReaperVaultContract();
  return await contract.deposit(amount);
};

export const withdrawTShare = async (amount) => {
  const contract = getReaperVaultContract();
  return await contract.withdraw(amount);
};

export const addToWhitelist = async (address) => {
  const contract = getReaperVaultContract();
  return await contract.setAddressInWhitelist(address, true);
};
