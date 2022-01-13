import { ethers } from "ethers";
import { getContract } from "./common";
import { getBalance } from "./tshare";
const reaperVaultABI = require("../abi/ReaperVault.json");
let reaperVaultContract = null;
export const vaultAddress = "0x3f074AADd7a661a41943E126F20ECd271a5b217B";

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
