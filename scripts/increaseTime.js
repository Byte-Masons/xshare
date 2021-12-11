function speedUpBlockTime() {
  const second = 1000;
  const secondsToIncrease = 360;
  setInterval(async () => {
    console.log("send(evm_increaseTime, ...");
    await network.provider.send("evm_increaseTime", [secondsToIncrease]);
  }, second);
}

async function main() {
  speedUpBlockTime();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
