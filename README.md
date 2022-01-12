# Reaper Masonry Autocompounder

How to deploy a mainnet fork:

npx hardhat node <- to start a node that forks mainnet

npx hardhat run --network localhost scripts/deploy.js <- deploys contracts on the forked blockchain

yarn start <- start front-end

Change const vaultAddress = "0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07"; to your deployed vault address

# Run deploy scripts

npx hardhat run --network opera scripts/deploy.js

npx hardhat run --network opera scripts/setMasons.js <--- If the setMason call fails in deploy script

npx hardhat run --network opera scripts/initializeVault.js <--- If the initializeVault call fails in deploy script

# linting and formatting
yarn run prettier:solidity <--- formatting

yarn run lint:sol <--- linting

# Deployed address

Vault deployed to 0x3f074AADd7a661a41943E126F20ECd271a5b217B

Strategy deployed to 0x8fF7C300ed517503B2d05F16b5a9DAF5129bCE97

<!-- mason1 deployed at 0xcD9A7e21cdF7E4857388348EA05b2896E16484cA

mason2 deployed at 0xFeAC8fa2d2ECe6C6f9f411f45D8600fC7585aF50

mason3 deployed at 0x02dA029E04bDE49228ab2207a7D524A38bDd2E3f

mason4 deployed at 0x5c2C11EEf57c837bd04e5b61B209d59c96502616

mason5 deployed at 0x8a4BEB3829A39bb130332CAD85Fa6CFbdc848A5A

mason6 deployed at 0xEcB901bd3c6C81f471414BA35330CB6cbFFA6232 -->

paymentRouter at 0x603e60d22af05ff77fdcf05c063f582c40e55aae

paymentSplitter at 0x1D46D3bf7082087C55DBcB38F342096Bc6283F19