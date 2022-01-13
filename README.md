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

<!-- mason1 deployed at 0x5991BF6Ad7593c9BDcdd26E7fdCdE09b495B04Cf

mason2 deployed at 0x5D48F5C91A347A6B460FfeBE486D4399d40E5ccD

mason3 deployed at 0xb9837c8C688b7B1F9d7b28B8A8b3e1b3D4cc1D24

mason4 deployed at 0xD2483B7d0A681764347B80dCa02232397D51C2FB

mason5 deployed at 0x13C68E991fb483976B7dD067971FC0F7eFFc08a0

mason6 deployed at 0x30657A4b19188B786C7e44d2A33F1490868bb367 -->

paymentRouter at 0x603e60d22af05ff77fdcf05c063f582c40e55aae

paymentSplitter at 0x1D46D3bf7082087C55DBcB38F342096Bc6283F19