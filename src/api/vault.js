import { ethers } from "ethers";
import { getTShareContract } from "./tokens";
const ReaperVaultABI = require("../abi/ReaperVault.json");
let reaperVaultContract = null;
const vaultAddress = "0x0e7c5313E9BB80b654734d9b7aB1FB01468deE3b";

export const hasApprovedTShare = async () => {
  const tshare = getTShareContract();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  const allowance = await tshare.allowance(userAddress, vaultAddress);
  const hasApproved = Number(allowance) !== 0;
  console.log(`hasApproved: ${hasApproved}`);
  return hasApproved;
};

export const approveTShare = async (setHasApproved) => {
  try {
    const tshare = getTShareContract();
    const tx = await tshare.approve(vaultAddress, ethers.constants.MaxInt256);
    const receipt = await tx.wait();
    if (receipt.status) {
      setHasApproved(true);
    }
  } catch (error) {
    setHasApproved(false);
  }
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

export const depositTShare = async (amount) => {
  const contract = await getReaperVaultContract();
  return await contract.deposit(amount);
};
