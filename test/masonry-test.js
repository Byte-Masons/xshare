const { expect } = require("chai");
const { waffle } = require("hardhat");
const pools = require("../pools.json");
const hre = require("hardhat");

const moveTimeForward = async (seconds) => {
  await network.provider.send("evm_increaseTime", [seconds]);
  await network.provider.send("evm_mine");
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
      console.log('lol');
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

const moveForwardNEpochsHarvestEveryHour = async (n, treasury, harvest, epochAction) => {
  const hour = 3600;
  const epoch = 1 * hour;
  console.log("moveForwardNEpochs");
  for (let index = 0; index < n*6; index++) {
    await moveTimeForward(epoch);
    const tombSupplyBefore = await treasury.getTombCirculatingSupply();
    console.log(`tombSupplyBefore: ${tombSupplyBefore}`);
    try {
      await treasury.allocateSeigniorage();
    } catch (error) {
      console.log('lol');
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
  let vault;
  let strategy;
  let treasury;
  let tombTreasury;
  let tshare;
  let masons;
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
    Vault = await ethers.getContractFactory("ReaperVaultv1_2");
    Treasury = await ethers.getContractFactory("ReaperTreasury");
    TombTreasury = await ethers.getContractFactory("Treasury");
    TShare = await ethers.getContractFactory("TShare");
    Mason = await ethers.getContractFactory("Mason");
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
      0
    );
    console.log("vault");

    strategy = await Strategy.deploy(vault.address, treasury.address);
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
    const masonsAddress = await deployMasons();

    await strategy.setMasons(masonsAddress);
    await vault.initialize(strategy.address);

    console.log(`Strategy deployed to ${strategy.address}`);
    console.log(`Vault deployed to ${vault.address}`);
    console.log(`Treasury deployed to ${treasury.address}`);
    console.log(`Masons deployed to: `);
    masonsAddress.forEach((mason) => {
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

      await moveToStakingWindow();

      const whaleDeposit = async () => {
        const whaleDepositAmount = ethers.utils.parseEther("1");
        try {
          await tombTreasury.allocateSeigniorage();
        } catch (error) {
          console.log('lol');
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
      
      let currentDate = await ethers.provider.getBlock().then(e => e.timestamp);
      let nextEpochPoint = ethers.BigNumber.from(await tombTreasury.nextEpochPoint()).toString();
      console.log("currentDate: ",currentDate);
      console.log("nextEpochPoint: ", nextEpochPoint);
      // await moveForwardNEpochs(1, tombTreasury, harvest);
      await moveTimeForward(2);
      console.log("First Harvest");
      await strategy.connect(self).harvest();
      await moveTimeForward(2);
      console.log("Second Harvest");
      await strategy.connect(self).harvest();
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
      expect(parseInt(userBalanceAfterWithdraw)).to.be.greaterThan(parseInt(userBalance - withdrawFee));
    });
  });
});
