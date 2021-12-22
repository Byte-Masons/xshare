const pools = require("../pools.json");

async function deployVault(timelock, depositFee) {
  console.log("deploying vault");
  const i = 0;
  const Vault = await ethers.getContractFactory("ReaperVaultv1_2");
  const vaultName = pools.tomb.stake[i].name;
  const vault = await Vault.deploy(
    pools.tomb.stake[i].token,
    vaultName,
    pools.tomb.stake[i].symbol,
    timelock,
    depositFee
  );
  await vault.deployed();
  console.log(`Vault ${vaultName} deployed to ${vault.address}`);
  return vault;
}

const deployMasonDeployer = async () => {
  const MasonDeployer = await ethers.getContractFactory("MasonDeployer");
  const masonDeployer = await MasonDeployer.deploy();
  await masonDeployer.deployed();
  console.log(`Mason Deployer deployed to ${masonDeployer.address}`);
  return masonDeployer;
}

async function deployStrategy(vaultAddress, treasuryAddress, masonDeployerAddress) {
  const Strategy = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
  console.log("vaultAddress: ",vaultAddress);
  console.log("treasuryAddress address: ",treasuryAddress);
  console.log("masonDeployerAddress: ",masonDeployerAddress);
  const strategy = await Strategy.deploy(vaultAddress, treasuryAddress, masonDeployerAddress);
  await strategy.deployed();
  console.log(`Strategy deployed to ${strategy.address}`);
  const strategySetMasonsTx = await strategy.setMasons();
  sleep(30000);
  console.log(`Masons set`);
  return strategy;
}

const getMasonsAddress = async (strategy) => {
  const masonsAdress = [];
  let masonAddress;
  for (let i = 0; i < 6; i++) {
    masonAddress = await strategy.masons(i);
    console.log(`masons[${i}]: ${masonAddress}`);
    masonsAdress.push(masonAddress);
  }
  return masonsAdress;
}
// async function deployMasons(strategy) {
//   Mason = await ethers.getContractFactory("Mason");
//   const nrOfMasons = 6;
//   const masonsAddress = [];
//   for (let i = 0; i < nrOfMasons; i++) {
//     const mason = await Mason.deploy(strategy);
//     await mason.deployed();
//     masonsAddress.push(mason.address);
//     console.log(`mason deployed at ${mason.address}`);
//   }
//   return masonsAddress;
// }

async function initializeVault(vaultAddress, strategyAddress) {
  const Vault = await ethers.getContractFactory("ReaperVaultv1_2");
  const vault = Vault.attach(vaultAddress);
  const tx = await vault.initialize(strategyAddress);
  const receipt = await tx.wait();
  console.log(`vault initialized at ${tx.hash}, status: ${receipt.status}`);
  return receipt;
}

function sleep(milliseconds) {
  console.log("Calling sleep");
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
  console.log("Sleep finished");
}

module.exports = {
  deployVault,
  deployStrategy,
  deployMasonDeployer,
  initializeVault,
  sleep,
};

async function main() {
  const vault = await deployVault(432000, 0);
  const vaultAddress = vault.address;
  const treasury = "0x0e7c5313E9BB80b654734d9b7aB1FB01468deE3b";
  const masonDeployer = await deployMasonDeployer();
  const strategy = await deployStrategy(vaultAddress, treasury, masonDeployer.address);
  const strategyAddress = strategy.address;
  const masonsAddress = await getMasonsAddress(strategy);
  // await strategy.setMasons(masonsAddress);
  // console.log("set masons");
  await initializeVault(vaultAddress, strategyAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
