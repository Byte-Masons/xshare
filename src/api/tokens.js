import { ethers } from "ethers";
const ERC20ABI = require("../abi/ERC20.json");

let tshareContract = null;

export const getTShareBalance = async () => {
  const tshareContract = getTShareContract();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  const tshareBalance = await tshareContract.balanceOf(userAddress);
  return tshareBalance;
};

export const getTShareContract = () => {
  if (tshareContract == null) {
    const tokenAddress = "0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    tshareContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);
  }

  return tshareContract;
};
