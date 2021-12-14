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

Vault deployed to 0xb40e774a627fC5Ca4dD628d997B18242da540B32

Strategy deployed to 0xb203A4ab80d84982602e413346724E83118ACb17

mason1 deployed at 0xaA8e0626e64817DcA2968A5535e26De642855caF

mason2 deployed at 0xcdCF7a84d7B82229958c1af1cD8EAc63703A2E3f

mason3 deployed at 0xFD35c7921f43f596116638Ff9af013AefC7879f8

mason4 deployed at 0x0BAe10A87623Ed8e31223DD10754201E29BF7fC0

mason5 deployed at 0x52e0e794B16CbEb31ab82C1f9713e973cC29A3Cc

mason6 deployed at 0xa4Fa4752618B545F6E3f92eD34C863522815d356
