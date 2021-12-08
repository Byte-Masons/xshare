const pools = require("../pools.json");

async function deployVault(timelock, depositFee) {
  console.log("deploying vault");
  const i = 0;
  const Vault = ethers.getContractFactory("ReaperVaultv1_2");
  const tokenName = pools.tomb.stake[i].name;
  const vault = await Vault.deploy(
    pools.tomb.stake[i].token,
    tokenName,
    pools.tomb.stake[i].symbol,
    timelock,
    depositFee
  );
  console.log(`Vault for ${tokenName} deployed to ${vault.address}`);
  return vault.address;
}

async function deployStrategy(vaultAddress, treasury) {
  const Strategy = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
  const strategy = await Strategy.deploy(vaultAddress, treasury);
  console.log(`Strategy deployed to ${strategy.address}`);
  return strategy.address;
}

async function deployMasons(strategy) {
  const nrOfMasons = 6;
  const masonsAddress = [];
  for (let i = 0; i < nrOfMasons; i++) {
    const mason = await Mason.deploy(strategy);
    masonsAddress.push(mason.address);
  }
  return masonsAddress;
}

await strategy.setMasons(masonsAddress);

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
  initializeVault,
};

async function main() {
  const vault = await deployVault(432000, 0);
  const treasury = "0x0e7c5313E9BB80b654734d9b7aB1FB01468deE3b";
  const strategy = await deployStrategy(vault, treasury);
  const masonsAddress = await deployMasons(strategy);
  await strategy.setMasons(masonsAddress);
  initializeVault(vault, strategy);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
