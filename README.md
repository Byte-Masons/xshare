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

# Deployed address

Vault deployed to 0x6A4146C7E6eFF0eAf2e3c0bCC2bd991707De4264

Strategy deployed to 0x1744BD10eD44E5c5C4EceE8080f720009AceB8eb

mason1 deployed at 0x8ad2f87EDD0260d68036634Da697fB248FbD0818

mason2 deployed at 0xe0D89392ecb1e26e48E9D91738Bf0Bf31192B5f1

mason3 deployed at 0x0C13a59a95da229562eF8Fa47C9B117b2F3C51Bb

mason4 deployed at 0xBe889866475055E2D216716da80D976Bfc8D4c1F

mason5 deployed at 0x327BB5bC0ECf3Ca06Ae7e1d620489B12DecFFE6c

mason6 deployed at 0xb4c3c70C0A0001923fbADEe5AB20086D671eE225
