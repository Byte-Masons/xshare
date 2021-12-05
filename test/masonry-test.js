const { expect } = require("chai");
const { waffle } = require("hardhat");
const pools = require("../pools.json");
const hre = require("hardhat");

describe("Vaults", function () {
  const i = 0;
  let Vault;
  let Strategy;
  let Treasury;
  let TShare;
  let Mason;
  let vault;
  let strategy;
  let treasury;
  let tshare;
  let masons;
  let stakedToken = ethers.utils.getAddress(pools.tomb.stake[i].token);

  let self;
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
    const tshareWhale = "0x2ff023bb5bb52b43ba62b36c03ccdd82d90ae7c2";
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [tshareWhale],
    });
    self = await ethers.provider.getSigner(tshareWhale);
    selfAddress = await self.getAddress();
    ownerAddress = await owner.getAddress();
    console.log("addresses");

    //get artifacts
    Strategy = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
    Vault = await ethers.getContractFactory("ReaperVaultv1_2");
    Treasury = await ethers.getContractFactory("ReaperTreasury");
    TShare = await ethers.getContractFactory("TShare");
    Mason = await ethers.getContractFactory("Mason");
    console.log("artifacts");

    //deploy contracts
    treasury = await Treasury.deploy();
    tshare = await TShare.attach(stakedToken);
    console.log("treasury");

    vault = await Vault.deploy(
      pools.tomb.stake[i].token,
      pools.tomb.stake[i].name,
      pools.tomb.stake[i].symbol,
      432000,
      0
    );
    console.log("vault");

    console.log("deploying Masons");

    const deployMasons = async () => {
      const nrOfMasons = 6;
      const masonsAddress = [];
      for (let i = 0; i < nrOfMasons; i++) {
        const mason = await Mason.deploy();
        masonsAddress.push(mason.address);
      }
      return masonsAddress;
    };
    const masonsAddress = await deployMasons();
    strategy = await Strategy.deploy(
      vault.address,
      treasury.address,
      masonsAddress
    );
    //  strategy = await Strategy.attach("0x94f93741814589E4Ad6a5669e6C8cF961992cf64");
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
      const depositAmount = ethers.utils.parseEther(".1");
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
      expect(newVaultBalance).to.equal(depositAmount);

      expect(isDeductingDeposit).to.equal(true);
    });
    // it("should mint user their pool share", async function () {
    //   const userBalance = await uniToken.balanceOf(selfAddress);
    //   console.log(userBalance.toString());
    //   const depositAmount = ethers.utils.parseEther("0.0000005");
    //   await vault.connect(self).deposit(depositAmount);
    //   console.log((await vault.balance()).toString());
    //   console.log((await uniToken.balanceOf(selfAddress)).toString());
    //   const selfShareBalance = await vault.balanceOf(selfAddress);
    //   console.log(selfShareBalance.toString());
    //   await uniToken.connect(self).transfer(ownerAddress, depositAmount);
    //   const ownerBalance = await uniToken.balanceOf(ownerAddress);
    //   console.log(ownerBalance.toString());
    //   await vault.deposit(depositAmount);
    //   const ownerShareBalance = await vault.balanceOf(ownerAddress);
    //   console.log(ownerShareBalance.toString());
    //   // expect(ownerShareBalance).to.equal(depositAmount);
    //   // expect(selfShareBalance).to.equal(depositAmount);
    // });
    // it("should allow withdrawals", async function () {
    //   const userBalance = await uniToken.balanceOf(selfAddress);
    //   console.log(userBalance);
    //   let vaultBalance = await vault.balance();
    //   const depositAmount = ethers.utils.parseEther("1");
    //   await vault.connect(self).deposit(depositAmount);
    //   console.log(await uniToken.balanceOf(selfAddress));
    //   expect(await uniToken.balanceOf(selfAddress)).to.equal(0);
    //   await vault.connect(self).withdraw(depositAmount);
    //   console.log(await uniToken.balanceOf(selfAddress));
    //   //expect(await uniToken.balanceOf(selfAddress)).to.equal(ethers.utils.parseEther("1"))
    // });
    // it("should be able to harvest", async function () {
    //   const userBalance = await uniToken.balanceOf(selfAddress);
    //   console.log(`before depositing balance is ${userBalance.toString()}`);
    //   let vaultBalance = await vault.balance();
    //   const depositAmount = ethers.utils.parseEther("1");
    //   await vault.connect(self).deposit(depositAmount);
    //   for (let i = 0; i < 10000; i++) {
    //     await ethers.provider.send("evm_mine");
    //   }
    //   await strategy.connect(self).harvest();
    //   await vault.connect(self).withdraw(depositAmount);
    //   let nb = await uniToken.balanceOf(selfAddress);
    //   console.log(`new balance is ${nb.toString()}`);

    //   //await strategy.connect(self).harvest();
    // });
  });
});
