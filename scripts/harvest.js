const cron = require("node-cron");
const express = require("express");

const STRATEGY_ADDR = "0x8fF7C300ed517503B2d05F16b5a9DAF5129bCE97";
  // const DAY = ethers.BigNumber.from(24 * 60 * 60);
  // const EPOCH = ethers.BigNumber.from(6 * 60 * 60)

app = express();

//Start of a new epoch, run harvest
cron.schedule("* 31 1,7,13,19 * * *", async function() {
  console.log("Harvest running");

  const [harvester] = await ethers.getSigners();
  const stratFactory = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
  const stratContract = await stratFactory.attach(STRATEGY_ADDR);

  await stratContract.harvest();
  console.log("Harvest done")
});

cron.schedule("* 31 0,6,12,18 * * *", async function() {
  console.log("Deposit running");

  const [harvester] = await ethers.getSigners();
  const stratFactory = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
  const stratContract = await stratFactory.attach(STRATEGY_ADDR);

  await stratContract.harvest();
  console.log("Deposit done");
});

app.listen(3000);