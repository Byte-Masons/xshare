import { getContract } from "./common";
const masonryABI = require("../abi/Masonry.json");
const treasuryABI = require("../abi/TombTreasury.json");

const masonryAddress = "0x8764DE60236C5843D9faEB1B638fbCE962773B67";
const treasuryAddress = "0xF50c6dAAAEC271B56FCddFBC38F0b56cA45E6f0d";

let masonryContract = null;
let treasuryContract = null;

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
