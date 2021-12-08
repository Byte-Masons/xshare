import { ethers } from "ethers";
import { getTShareContract } from "./tokens";
const ReaperVaultABI = require("../abi/ReaperVault.json");
let reaperVaultContract = null;
const vaultAddress = "";

export const hasApprovedTShare = async () => {
  const tshare = getTShareContract();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  const allowance = await tshare.allowance(userAddress, vaultAddress);
  const hasApproved = Number(allowance) !== 0;
  return hasApproved;
};

export const getReaperVaultContract = () => {
  if (reaperVaultContract == null) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    reaperVaultContract = new ethers.Contract(
      vaultAddress,
      ReaperVaultABI,
      signer
    );
  }

  return reaperVaultContract;
};

export const deposit = async (amount) => {
  const contract = await getReaperVaultContract();
  return await contract.deposit(amount);
};
