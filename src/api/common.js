import { ethers } from "ethers";

export const getProvider = () =>
  new ethers.providers.Web3Provider(window.ethereum);

export const getContract = (contract, address, abi) => {
  if (contract == null) {
    const signer = getProvider().getSigner();
    contract = new ethers.Contract(address, abi, signer);
  }

  return contract;
};
