const pools = require("../pools.json");

function speedUpBlockTime() {
  console.log("speedUpBlockTime");
  const second = 1000;
  const secondsToIncrease = 360;
  setInterval(async () => {
    console.log("send(evm_increaseTime, ...");
    await network.provider.send("evm_increaseTime", [secondsToIncrease]);
  }, second);
}

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
  console.log(`Vault ${vaultName} deployed to ${vault.address}`);
  return vault;
}

async function deployStrategy(vaultAddress, treasury) {
  const Strategy = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
  console.log(vaultAddress);
  console.log(treasury);
  const strategy = await Strategy.deploy(vaultAddress, treasury);
  console.log(`Strategy deployed to ${strategy.address}`);
  return strategy;
}

async function deployMasons(strategy) {
  Mason = await ethers.getContractFactory("Mason");
  const nrOfMasons = 6;
  const masonsAddress = [];
  for (let i = 0; i < nrOfMasons; i++) {
    const mason = await Mason.deploy(strategy);
    masonsAddress.push(mason.address);
    console.log(`mason deployed at ${mason.address}`);
  }
  return masonsAddress;
}

async function initializeVault(vaultAddress, strategyAddress) {
  const Vault = await ethers.getContractFactory("ReaperVaultv1_2");
  const vault = Vault.attach(vaultAddress);
  const tx = await vault.initialize(strategyAddress);
  const receipt = await tx.wait();
  console.log(`vault initialized at ${tx.hash}, status: ${receipt.status}`);
  return receipt;
}

module.exports = {
  deployVault,
  deployStrategy,
  deployMasons,
  initializeVault,
  speedUpBlockTime,
};

async function main() {
  const vault = await deployVault(432000, 0);
  const vaultAddress = vault.address;
  const treasury = "0x0e7c5313E9BB80b654734d9b7aB1FB01468deE3b";
  const strategy = await deployStrategy(vaultAddress, treasury);
  const strategyAddress = strategy.address;
  const masonsAddress = await deployMasons(strategyAddress);
  await strategy.setMasons(masonsAddress);
  console.log("set masons");
  await initializeVault(vaultAddress, strategyAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
