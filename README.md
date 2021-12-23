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

Vault deployed to 0x6020F4Dc7A7A3DabdF4b3b784543EF01f9Eb61Ab

Strategy deployed to 0x15A7b695f4670962abd000B33502734f9a899679

mason1 deployed at 0x842C5474CA8270f62CbD768193ad8D4192001F62

mason2 deployed at 0x09d49f1102fEAf84106650E8eD444823d98eE190

mason3 deployed at 0xa8DDCdA82fCDd0167B3D863c32805eB3E11B1cd8

mason4 deployed at 0x736b9162D38D2227609f37b9DA7566F564492aB4

mason5 deployed at 0xC38bb8C1D9970570ad10B72445D2e5885801BD5A

mason6 deployed at 0x66ad5C932F794Ea994f3e16Ac5f2046EF7579383

masonDeployer deployed at 0xaf6B77C54eF804D630F25D9862842D2E2b0E3731