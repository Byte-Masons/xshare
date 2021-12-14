import { getProvider } from "./common";

const getBlockNumber = async () => await getProvider().getBlockNumber();

const getCurrentBlock = async () =>
  await getProvider().getBlock(await getBlockNumber());

export const getBlockTimestamp = async () =>
  (await getCurrentBlock()).timestamp;
