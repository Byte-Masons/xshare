const { ethers } = require("ethers");

const STRATEGY_ADDR = "0xCCfC062B025C6753a87C576b4Cdf85603BA0Fedc";
const abi = require('./ReaperAutoCompoundMasonry.json');

exports.handler = async () => {
    let walletKey = process.env.WALLET_KEY;
    const provider = new ethers.providers.JsonRpcProvider("https://rpcapi.fantom.network", 250);
    const walletSigner = new ethers.Wallet(walletKey, provider);
    const contract = new ethers.Contract(STRATEGY_ADDR, abi, walletSigner);

    try {
        const tx = await contract.deposit();
    } catch(err) {
        return err;
    }

    return true;
};