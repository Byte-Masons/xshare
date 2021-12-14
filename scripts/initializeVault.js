async function main() {
  console.log("initialize vault script running");
  const strategyAddress = "0xAC557425Fbd38361196eE5B5641d551e07Bd88dc";
  const vaultAddress = "0x596cDF5D33486b035e8482688c638E7dcAf25a7b";
  const Vault = await ethers.getContractFactory("ReaperVaultv1_2");
  const vault = Vault.attach(vaultAddress);
  const tx = await vault.initialize(strategyAddress);
  const receipt = await tx.wait();
  console.log(`vault initialized at ${tx.hash}, status: ${receipt.status}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
