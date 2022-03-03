const schedule = require("node-schedule");
const express = require("express");

const STRATEGY_ADDR = "0x8fF7C300ed517503B2d05F16b5a9DAF5129bCE97";
  // const DAY = ethers.BigNumber.from(24 * 60 * 60);
  // const EPOCH = ethers.BigNumber.from(6 * 60 * 60)

app = express();

//Start of a new epoch, run harvest
schedule.scheduleJob("0 31 1,7,13,19 * * *", async () => {
  console.log("Harvest running");

  const [harvester] = await ethers.getSigners();
  const stratFactory = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
  const stratContract = await stratFactory.attach(STRATEGY_ADDR);
  
  try {
    await stratContract.harvest();
  } catch(err) {
    console.log("did not");
  }
  
  console.log("Harvest done")
});


schedule.scheduleJob("0 31 0,6,12,18 * * *", async () => {
  console.log("Deposit running");
  const [harvester] = await ethers.getSigners();
  const stratFactory = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
  const stratContract = await stratFactory.attach(STRATEGY_ADDR);

  try {
    await stratContract.deposit();
  } catch(err) {
    console.log("did not");
  }

  console.log("Deposit done");
});

app.listen(3000);