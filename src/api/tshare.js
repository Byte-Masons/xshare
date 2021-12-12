import { ethers } from "ethers";
import { getContract } from "./common";
import { vaultAddress } from "./vault";
const erc20ABI = require("../abi/ERC20.json");
const tshareAddress = "0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37";
let tshareContract = null;

export const getTShareContract = () =>
  getContract(tshareContract, tshareAddress, erc20ABI);

export const getTShareBalance = async () => {
  const tshareContract = getTShareContract();
  return await getBalance(tshareContract);
};

export const getBalance = async (contract) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  const balance = await contract.balanceOf(userAddress);
  return balance;
};

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
