# Reaper Masonry Autocompounder

How to deploy a mainnet fork:
npx hardhat node <- to start a node that forks mainnet
npx hardhat run --network localhost scripts/deploy.js <- deploys contracts on the forked blockchain
yarn start <- start front-end
Change const vaultAddress = "0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07"; to your deployed vault address
