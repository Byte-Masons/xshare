// import { ethers } from "ethers";
const { ethers } = require("hardhat");
const strategyABI = require("../abi/ReaperAutoCompound-Masonry.json");
const masonryABI = require("../abi/Masonry.json");
const treasuryABI = require("../abi/TombTreasury.json");
const strategyAddress = "0x162A433068F51e18b7d13932F27e66a3f99E6890";
const masonryAddress = "0x8764DE60236C5843D9faEB1B638fbCE962773B67";
const treasuryAddress = "0xF50c6dAAAEC271B56FCddFBC38F0b56cA45E6f0d";
let strategyContract = null;
let masonryContract = null;
let treasuryContract = null;

export const harvest = async () => await getStrategyContract().harvest();

const getProvider = () => new ethers.providers.Web3Provider(window.ethereum);

const getContract = (contract, address, abi) => {
  if (contract == null) {
    const signer = getProvider().getSigner();
    contract = new ethers.Contract(address, abi, signer);
  }

  return contract;
};

const getStrategyContract = () => {
  return getContract(strategyContract, strategyAddress, strategyABI);
};

const getMasonryContract = () => {
  return getContract(masonryContract, masonryAddress, masonryABI);
};

const getTreasuryContract = () => {
  return getContract(treasuryContract, treasuryAddress, treasuryABI);
};

export const getEpoch = async () => {
  const contract = getMasonryContract();
  return await contract.epoch();
};

export const getNextEpochPoint = async () => {
  const contract = getMasonryContract();
  return await contract.nextEpochPoint();
};

export const allocateSeigniorage = async () => {
  const contract = getTreasuryContract();
  return await contract.allocateSeigniorage();
};

const getBlockNumber = async () => await getProvider().getBlockNumber();

const getCurrentBlock = async () =>
  await getProvider().getBlock(await getBlockNumber());

export const getBlockTimestamp = async () =>
  (await getCurrentBlock()).timestamp;

export const addSeconds = async (secondsToAdd) => {
  const newTimeStamp = (await getBlockTimestamp()) + secondsToAdd;
  ethers.provider.send("evm_mine", [newTimeStamp]);
};
