async function main() {
  console.log("setMason script running");
  const Strategy = await ethers.getContractFactory("ReaperAutoCompoundMasonry");
  console.log("getContractFactory complete");
  const strategyAddress = "0xAC557425Fbd38361196eE5B5641d551e07Bd88dc";
  const strategy = Strategy.attach(strategyAddress);
  console.log("strategy attached");
  const tx = await strategy.setMasons([
    "0x8ad2f87EDD0260d68036634Da697fB248FbD0818",
    "0xe0D89392ecb1e26e48E9D91738Bf0Bf31192B5f1",
    "0x0C13a59a95da229562eF8Fa47C9B117b2F3C51Bb",
    "0xBe889866475055E2D216716da80D976Bfc8D4c1F",
    "0x327BB5bC0ECf3Ca06Ae7e1d620489B12DecFFE6c",
    "0xb4c3c70C0A0001923fbADEe5AB20086D671eE225",
  ]);
  const receipt = await tx.wait();
  console.log("setMason call complete");
  console.log(receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
