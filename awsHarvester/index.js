const { ethers } = require("ethers");

const STRATEGY_ADDR = "0x8ff7c300ed517503b2d05f16b5a9daf5129bce97";
const abi = require('./ReaperAutoCompoundMasonry.json');

exports.handler = async () => {
    let walletKey = process.env.WALLET_KEY;
    const provider = new ethers.providers.JsonRpcProvider("https://rpcapi.fantom.network", 250);
    const walletSigner = new ethers.Wallet(walletKey, provider);
    const contract = new ethers.Contract(STRATEGY_ADDR, abi, walletSigner);

    try {
        const tx = await contract.harvest();
    } catch(err) {
        return err;
    }

    return true;
};