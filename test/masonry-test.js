// const { expect } = require("chai");
// const { waffle } = require("hardhat");
// const pools = require("../pools.json");
// const hre = require("hardhat");

const pools = require("../pools.json");
const hre = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect } = chai;

const getBlockNumber = async () => await ethers.provider.getBlockNumber();

const getCurrentBlock = async () =>
  await ethers.provider.getBlock(await getBlockNumber());

const getBlockTimestamp = async () => (await getCurrentBlock()).timestamp;

const moveTimeForward = async (seconds) => {
  await network.provider.send("evm_increaseTime", [seconds]);
  await network.provider.send("evm_mine");
};

const getMason = async (masonAddress, Mason) =>
  await Mason.attach(masonAddress);

const moveToStartOfEpoch = async (mason, treasury) => {
  const nextEpoch = await mason.nextEpochPoint();
  console.log(`nextEpoch: ${nextEpoch}`);

  const currentBlockTimestamp = await getBlockTimestamp();
  const timeToNextEpoch = nextEpoch - currentBlockTimestamp;
  console.log(currentBlockTimestamp);
  console.log(nextEpoch - currentBlockTimestamp);
  await moveTimeForward(timeToNextEpoch + 1);
  const nextEpochAfter = await mason.nextEpochPoint();
  console.log(`nextEpochAfter: ${nextEpochAfter}`);
  await treasury.allocateSeigniorage();

  const currentBlockTimestampAfter = await getBlockTimestamp();
  console.log(currentBlockTimestampAfter);
  console.log(nextEpochAfter - currentBlockTimestampAfter);
};

const moveToEndOfEpoch = async (mason) => {
  const nextEpoch = await mason.nextEpochPoint();
  console.log(`nextEpoch: ${nextEpoch}`);

  const currentBlockTimestamp = await getBlockTimestamp();
  const timeToNextEpoch = nextEpoch - currentBlockTimestamp;
  console.log(currentBlockTimestamp);
  console.log(nextEpoch - currentBlockTimestamp);
  const tenMinutes = 10 * 60;
  await moveTimeForward(timeToNextEpoch - tenMinutes);
  const nextEpochAfter = await mason.nextEpochPoint();
  console.log(`nextEpochAfter: ${nextEpochAfter}`);

  const currentBlockTimestampAfter = await getBlockTimestamp();
  console.log(currentBlockTimestampAfter);
  console.log(nextEpochAfter - currentBlockTimestampAfter);
};

const moveForwardNEpochs = async (n, treasury, harvest, epochAction) => {
  const hour = 3600;
  const epoch = 6 * hour;
  console.log("moveForwardNEpochs");
  for (let index = 0; index < n; index++) {
    await moveTimeForward(epoch);
    const tombSupplyBefore = await treasury.getTombCirculatingSupply();
    console.log(`tombSupplyBefore: ${tombSupplyBefore}`);
    try {
      await treasury.allocateSeigniorage();
    } catch (error) {
      console.log("lol");
    }
    const tombSupplyAfter = await treasury.getTombCirculatingSupply();
    console.log(`tombSupplyAfter: ${tombSupplyAfter}`);
    await moveTimeForward(2);
    await harvest();
    if (epochAction) {
      await epochAction();
    }

    console.log("finished allocateSeigniorage");
  }
};

const moveForwardNEpochsHarvestEveryHour = async (
  n,
  treasury,
  harvest,
  epochAction
) => {
  const hour = 3600;
  const epoch = 1 * hour;
  console.log("moveForwardNEpochs");
  for (let index = 0; index < n * 6; index++) {
    await moveTimeForward(epoch);
    const tombSupplyBefore = await treasury.getTombCirculatingSupply();
    console.log(`tombSupplyBefore: ${tombSupplyBefore}`);
    try {
      await treasury.allocateSeigniorage();
    } catch (error) {
      console.log("lol");
    }
    const tombSupplyAfter = await treasury.getTombCirculatingSupply();
    console.log(`tombSupplyAfter: ${tombSupplyAfter}`);
    await moveTimeForward(2);
    await harvest();
    if (epochAction) {
      await epochAction();
    }

    console.log("finished allocateSeigniorage");
  }
};

const moveToStakingWindow = async () => {
  const hour = 3600;
  const epoch = 6 * hour;
  console.log("moveToStakingWindow");
  await moveTimeForward(epoch - hour + 5);
};

describe("Vaults", function () {
  const i = 0;
  let Vault;
  let Strategy;
  let Treasury;
  let TombTreasury;
  let TShare;
  let Mason;
  let MasonDeployer;
  let vault;
  let strategy;
  let treasury;
  let tombTreasury;
  let tshare;
  let masons;
  let masonDeployer;
  let stakedToken = ethers.utils.getAddress(pools.tomb.stake[i].token);
  const tombTreasuryAddress = ethers.utils.getAddress(
    pools.tomb.stake[i].treasury
  );

  let self;
  let tshareWhale;
  let selfAddress;
  let owner;
  let addr1;
  let addr2;
  let addri;
  let addr4;
  let addrs;

  beforeEach(async function () {
    //reset network
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: "https://rpc.ftm.tools/",
          },
        },
      ],
    });
    console.log("providers");
    //get signers
    [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
    const tshareHolder = "0xe739b43f46e3efee99ff698123110b4da4657b2b";
    const tshareWhaleAddress = "0x2ff023bb5bb52b43ba62b36c03ccdd82d90ae7c2";
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [tshareHolder],
    });
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [tshareWhaleAddress],
    });
    self = await ethers.provider.getSigner(tshareHolder);
    tshareWhale = await ethers.provider.getSigner(tshareWhaleAddress);
    selfAddress = await self.getAddress();
    ownerAddress = await owner.getAddress();
    console.log("addresses");

    //get artifacts
    Strategy = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
    Vault = await ethers.getContractFactory("ReaperVaultv1_3");
    Treasury = await ethers.getContractFactory("ReaperTreasury");
    TombTreasury = await ethers.getContractFactory("Treasury");
    TShare = await ethers.getContractFactory("TShare");
    Mason = await ethers.getContractFactory("Mason");
    MasonDeployer = await ethers.getContractFactory("MasonDeployer");
    console.log("artifacts");

    //deploy contracts
    treasury = await Treasury.deploy();
    tshare = await TShare.attach(stakedToken);
    tombTreasury = await TombTreasury.attach(tombTreasuryAddress);
    console.log("treasury");

    vault = await Vault.deploy(
      pools.tomb.stake[i].token,
      pools.tomb.stake[i].name,
      pools.tomb.stake[i].symbol,
      432000,
      0,
      ethers.utils.parseEther("100000000000")
    );
    console.log("vault");

    masonDeployer = await MasonDeployer.deploy();
    console.log("masonDeployer");
    strategy = await Strategy.deploy(vault.address, treasury.address, treasury.address, masonDeployer.address); //change last address to the strategy payment address
    await strategy.deployed();
    await strategy.setMasons();
    console.log("strategy");
    console.log("deploying Masons");

    const deployMasons = async () => {
      const nrOfMasons = 6;
      const masonsAddress = [];
      for (let i = 0; i < nrOfMasons; i++) {
        const mason = await Mason.deploy(strategy.address);
        masonsAddress.push(mason.address);
      }
      return masonsAddress;
    };

    const getMasonsAddresses = async () => {
      const nrOfMasons = 6;
      const masonsAddress = [];
      for (let i = 0; i < nrOfMasons; i++) {
        masonsAddress[i] = await strategy.masons(i);
        console.log(await strategy.masons(i));
      }
      return masonsAddress;
    }
    masons = await getMasonsAddresses();
    await vault.initialize(strategy.address);

    console.log(`MasonDeployer deployed to ${masonDeployer.address}`);
    console.log(`Strategy deployed to ${strategy.address}`);
    console.log(`Vault deployed to ${vault.address}`);
    console.log(`Treasury deployed to ${treasury.address}`);
    console.log(`Masons deployed to: `);
    masons.forEach((mason) => {
      console.log(mason);
    });

    //approving LP token and vault share spend
    await tshare.approve(vault.address, ethers.utils.parseEther("1000000000"));
    console.log("approvals1");
    await vault.approve(vault.address, ethers.utils.parseEther("1000000000"));
    console.log("approvals2");
    await tshare
      .connect(self)
      .approve(vault.address, ethers.utils.parseEther("1000000000"));
    console.log("approvalsi");
    await vault
      .connect(self)
      .approve(vault.address, ethers.utils.parseEther("1000000000"));
    console.log("approvals4");
    await tshare
      .connect(tshareWhale)
      .approve(vault.address, ethers.utils.parseEther("1000000000"));
    console.log("approvals5");
    await vault
      .connect(tshareWhale)
      .approve(vault.address, ethers.utils.parseEther("1000000000"));
    console.log("approvals6");
  });

  describe("Deploying the vault and strategy", function () {
    it("should initiate vault with a 0 balance", async function () {
      console.log(1);
      const totalBalance = await vault.balance();
      console.log(2);
      const availableBalance = await vault.available();
      console.log(i);
      const pricePerFullShare = await vault.getPricePerFullShare();
      console.log(4);
      expect(totalBalance).to.equal(0);
      console.log(5);
      expect(availableBalance).to.equal(0);
      console.log(6);
      expect(pricePerFullShare).to.equal(ethers.utils.parseEther("1"));
    });
  });
  describe("Vault Tests", function () {
    it("should allow deposits and account for them correctly", async function () {
      const userBalance = await tshare.balanceOf(selfAddress);
      console.log(1);
      console.log(`userBalance: ${userBalance}`);
      const vaultBalance = await vault.balance();
      console.log(2);
      const depositAmount = ethers.utils.parseEther(".0001");
      console.log(i);
      await vault.connect(self).deposit(depositAmount);
      console.log(4);
      const newVaultBalance = await vault.balance();
      console.log(`newVaultBalance: ${newVaultBalance}`);
      const newUserBalance = await tshare.balanceOf(selfAddress);
      console.log(`newUserBalance: ${newUserBalance}`);
      console.log(
        `userBalance - depositAmount: ${userBalance - depositAmount}`
      );
      const isDeductingDeposit =
        newUserBalance.toString() === (userBalance - depositAmount).toString();
      console.log(
        `userBalance - newUserBalance: ${userBalance - newUserBalance}`
      );
      const deductedAmount = userBalance - newUserBalance;
      expect(vaultBalance).to.equal(0);
      expect(newVaultBalance).to.equal(depositAmount);
      expect(deductedAmount.toString()).to.equal(depositAmount.toString());
    });
    it("should mint user their pool share", async function () {
      const userBalance = await tshare.balanceOf(selfAddress);
      console.log(userBalance.toString());
      const depositAmount = ethers.utils.parseEther("0.0000005");
      await vault.connect(self).deposit(depositAmount);
      console.log((await vault.balance()).toString());
      console.log((await tshare.balanceOf(selfAddress)).toString());
      const selfShareBalance = await vault.balanceOf(selfAddress);
      console.log(selfShareBalance.toString());
      await tshare.connect(self).transfer(ownerAddress, depositAmount);
      const ownerBalance = await tshare.balanceOf(ownerAddress);
      console.log(ownerBalance.toString());
      await vault.deposit(depositAmount);
      const ownerShareBalance = await vault.balanceOf(ownerAddress);
      console.log(ownerShareBalance.toString());
      expect(ownerShareBalance).to.equal(depositAmount);
      expect(selfShareBalance).to.equal(depositAmount);
    });
    it("should allow withdrawals", async function () {
      const userBalance = await tshare.balanceOf(selfAddress);
      console.log(`userBalance: ${userBalance}`);
      const depositAmount = ethers.utils.parseEther("0.0001");
      await vault.connect(self).deposit(depositAmount);
      console.log(
        `await tshare.balanceOf(selfAddress): ${await tshare.balanceOf(
          selfAddress
        )}`
      );
      const newUserBalance = userBalance - depositAmount;
      const tokenBalance = await tshare.balanceOf(selfAddress);
      expect(tokenBalance).to.equal(newUserBalance);
      await vault.connect(self).withdraw(depositAmount);
      console.log(
        `await tshare.balanceOf(selfAddress): ${await tshare.balanceOf(
          selfAddress
        )}`
      );
      const userBalanceAfterWithdraw = await tshare.balanceOf(selfAddress);
      const securityFee = 10;
      const percentDivisor = 10000;
      const withdrawFee = (depositAmount * securityFee) / percentDivisor;
      expect(userBalanceAfterWithdraw).to.equal(userBalance - withdrawFee);
    });
    it("should be able to harvest", async function () {
      this.timeout(120000);
      const userBalance = await tshare.balanceOf(selfAddress);
      console.log(`userBalance: ${userBalance}`);
      const depositAmount = ethers.utils.parseEther("0.0001");
      await vault.connect(self).deposit(depositAmount);
      console.log(
        `await tshare.balanceOf(selfAddress): ${await tshare.balanceOf(
          selfAddress
        )}`
      );
      const newUserBalance = userBalance - depositAmount;
      const tokenBalance = await tshare.balanceOf(selfAddress);
      expect(tokenBalance).to.equal(newUserBalance);
      const harvest = async () => {
        await strategy.connect(self).harvest();
        await moveTimeForward(2);
      };
      const fullEpochCycle = 6;
      await moveForwardNEpochs(fullEpochCycle, tombTreasury, harvest);
      await strategy.connect(self).harvest();
      await vault.connect(self).withdraw(depositAmount);
      console.log(
        `await tshare.balanceOf(selfAddress): ${await tshare.balanceOf(
          selfAddress
        )}`
      );
      const userBalanceAfterWithdraw = await tshare.balanceOf(selfAddress);
      const securityFee = 10;
      const percentDivisor = 10000;
      const withdrawFee = (depositAmount * securityFee) / percentDivisor;
      expect(userBalanceAfterWithdraw).to.equal(userBalance - withdrawFee);
    });
    it("should provide yield", async function () {
      this.timeout(120000);
      const userBalance = await tshare.balanceOf(selfAddress);
      console.log(`userBalance: ${userBalance}`);
      const depositAmount = ethers.utils.parseEther("0.0001");
      await vault.connect(self).deposit(depositAmount);
      console.log(
        `await tshare.balanceOf(selfAddress): ${await tshare.balanceOf(
          selfAddress
        )}`
      );

      const moveTimeForward1Hour = async () => {
        console.log("moveTimeForward1Hour");
        await moveTimeForward(3600);
      }
      
      const moveForwardAndStake = async () => {
        let canStake = false;
        let res;
        while (!canStake) {
          await moveTimeForward1Hour();
          res = await strategy.connect(self).canWithdrawFromMason();
          console.log("------------!res: ",!res);
          canStake = !res;
        }
      }

      await moveForwardAndStake();
      // await moveToStakingWindow();

      const whaleDeposit = async () => {
        const whaleDepositAmount = ethers.utils.parseEther("1");
        try {
          await tombTreasury.allocateSeigniorage();
        } catch (error) {
          console.log("lol");
        }
        await vault.connect(tshareWhale).deposit(whaleDepositAmount);
        await moveTimeForward(2);
      };
      await whaleDeposit();
      const newUserBalance = userBalance - depositAmount;
      const tokenBalance = await tshare.balanceOf(selfAddress);
      expect(tokenBalance).to.equal(newUserBalance);
      const fullEpochCycle = 6;
      const harvest = async () => {
        await strategy.connect(self).harvest();
        await moveTimeForward(2);
      };
      await moveForwardNEpochsHarvestEveryHour(
        fullEpochCycle,
        tombTreasury,
        harvest,
        whaleDeposit
      );

      let currentDate = await ethers.provider
        .getBlock()
        .then((e) => e.timestamp);
      let nextEpochPoint = ethers.BigNumber.from(
        await tombTreasury.nextEpochPoint()
      ).toString();
      console.log("currentDate: ", currentDate);
      console.log("nextEpochPoint: ", nextEpochPoint);
      // await moveForwardNEpochs(1, tombTreasury, harvest);
      await moveTimeForward(2);
      console.log("First Harvest");
      await strategy.connect(self).harvest();
      await moveTimeForward(2);
      console.log("Second Harvest");
      await strategy.connect(self).harvest();
      console.log(`Trying to withdraw: ${depositAmount} against available: ${await strategy.balanceDuringCurrentEpoch()} while withdraw authorized: ${await strategy.canWithdrawFromMason()}`);
      await vault.connect(self).withdraw(depositAmount);
      console.log(
        `await tshare.balanceOf(selfAddress): ${await tshare.balanceOf(
          selfAddress
        )}`
      );
      const userBalanceAfterWithdraw = await tshare.balanceOf(selfAddress);
      console.log(`userBalanceAfterWithdraw: ${userBalanceAfterWithdraw}`);
      const securityFee = 10;
      const percentDivisor = 10000;
      const withdrawFee = (depositAmount * securityFee) / percentDivisor;
      const startingBalanceMinusWithdrawFee = userBalance - withdrawFee;
      console.log(
        `startingBalanceMinusWithdrawFee: ${startingBalanceMinusWithdrawFee}`
      );
      expect(parseInt(userBalanceAfterWithdraw)).to.be.greaterThan(
        parseInt(userBalance - withdrawFee)
      );
    });
    // it("should block deposits and withdrawals when whitelist is enabled", async function () {
    //   await vault.setIsWhiteListEnabled(true);
    //   const depositAmount = ethers.utils.parseEther(".0001");
    //   await expect(vault.connect(self).deposit(depositAmount)).to.be.reverted;
    // });
    // it("should allow whitelisted address when whitelisting is enabled", async function () {
    //   await vault.setIsWhiteListEnabled(true);
    //   await vault.connect(owner).setAddressInWhitelist(selfAddress, true);
    //   const depositAmount = ethers.utils.parseEther(".0001");
    //   await expect(vault.connect(self).deposit(depositAmount)).to.not.be
    //     .reverted;
    // });
    // it("onlyOwner should be able to set if whitelist is enabled", async function () {
    //   await expect(vault.connect(self).setIsWhiteListEnabled(true)).to.be
    //     .reverted;

    //   await expect(vault.connect(owner).setIsWhiteListEnabled(true)).to.not.be
    //     .reverted;
    // });
    // it("onlyOwner should be able to set whitelist", async function () {
    //   await expect(vault.connect(self).setAddressInWhitelist(selfAddress, true))
    //     .to.be.reverted;

    //   await expect(
    //     vault.connect(owner).setAddressInWhitelist(selfAddress, true)
    //   ).to.be.not.reverted;
    // });
    it("Deposits outside of the staking window are kept liquid", async function () {
      await network.provider.send("evm_mine");
      const mason = await getMason(masons[0], Mason);
      const epochBefore = await mason.epoch();
      console.log(`epochBefore: ${epochBefore}`);
      await moveToStartOfEpoch(mason, tombTreasury);
      const depositAmount = 1000;
      await vault.connect(self).deposit(depositAmount);
      const balanceOfStakedToken = await strategy.balanceOfStakedToken();
      const balanceOfPool = await strategy.balanceOfPool();
      expect(balanceOfStakedToken).to.equal(depositAmount);
      expect(balanceOfPool).to.equal(0);
    });
    it("Deposits inside of the staking window are staked", async function () {
      await network.provider.send("evm_mine");
      const mason = await getMason(masons[0], Mason);
      const epochBefore = await mason.epoch();
      console.log(`epochBefore: ${epochBefore}`);
      await moveToEndOfEpoch(mason);
      const depositAmount = 1000;
      await vault.connect(self).deposit(depositAmount);
      const balanceOfStakedToken = await strategy.balanceOfStakedToken();
      const balanceOfPool = await strategy.balanceOfPool();
      expect(balanceOfStakedToken).to.equal(0);
      expect(balanceOfPool).to.equal(depositAmount);
    });
    it("Should be able to handle a large number of deposits through the whole cycle", async function () {
      this.timeout(120000);
      await network.provider.send("evm_mine");
      const mason = await getMason(masons[0], Mason);
      const epochBefore = await mason.epoch();
      console.log(`epochBefore: ${epochBefore}`);
      await moveToStartOfEpoch(mason, tombTreasury);
      const depositAmount = 10000000;
      const nrOfDeposits = 50;
      const secondsToIncrease = 60 * 15;
      for (let index = 0; index < nrOfDeposits; index++) {
        await vault.connect(tshareWhale).deposit(depositAmount);
        await moveTimeForward(secondsToIncrease);
        console.log(`whale deposit loop ${index}`);
      }
      const balanceOfStakedToken = await strategy.balanceOfStakedToken();
      const balanceOfPool = await strategy.balanceOfPool();
      expect(balanceOfStakedToken).to.equal(0);
      expect(balanceOfPool).to.equal(depositAmount * nrOfDeposits);
    });
    it("Should be able to withdraw in another epoch", async function () {
      this.timeout(120000);
      await network.provider.send("evm_mine");
      const mason = await getMason(masons[0], Mason);
      const epochBefore = await mason.epoch();
      console.log(`epochBefore: ${epochBefore}`);
      await moveToStartOfEpoch(mason, tombTreasury);
      const depositAmount = 10000;
      await vault.connect(self).deposit(depositAmount);
      await moveToStartOfEpoch(mason, tombTreasury);
      const whaleDepositAmount = 20000;
      await vault.connect(tshareWhale).deposit(whaleDepositAmount);
      const userBalance = await tshare.balanceOf(selfAddress);
      await vault.connect(self).withdraw(depositAmount);
      const userBalanceAfterWithdraw = await tshare.balanceOf(selfAddress);
      const securityFee = 10;
      const percentDivisor = 10000;
      const withdrawFee = (depositAmount * securityFee) / percentDivisor;
      expect(userBalanceAfterWithdraw).to.equal(userBalance - withdrawFee);
      // const depositAmount = 10000000;
      // const nrOfDeposits = 50;
      // const secondsToIncrease = 60 * 15;
      // for (let index = 0; index < nrOfDeposits; index++) {
      //   await vault.connect(tshareWhale).deposit(depositAmount);
      //   await moveTimeForward(secondsToIncrease);
      //   console.log(`whale deposit loop ${index}`);
      // }
      // const balanceOfStakedToken = await strategy.balanceOfStakedToken();
      // const balanceOfPool = await strategy.balanceOfPool();
      // expect(balanceOfStakedToken).to.equal(0);
      // expect(balanceOfPool).to.equal(depositAmount * nrOfDeposits);
    });
  });
});
