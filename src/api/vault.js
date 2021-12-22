import { ethers } from "ethers";
import { getContract } from "./common";
import { getBalance } from "./tshare";
const reaperVaultABI = require("../abi/ReaperVault.json");
let reaperVaultContract = null;
export const vaultAddress = "0x6020F4Dc7A7A3DabdF4b3b784543EF01f9Eb61Ab";

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
