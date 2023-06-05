require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');
const BigNumber = require('bignumber.js');

// Get Alchemy App URL
const API_KEY = process.env.API_KEY;

// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider('goerli', API_KEY)

// Get contract ABI file
const contract = require("../artifacts/contracts/MarketPlace.sol/MarketPlace.json");

// Create a signer
const privateKey = process.env.PRIVATE_KEY_B
const signer = new ethers.Wallet(privateKey, provider)

// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0x28bB390c00F575Fc7e48D16456d11CB532e63f1E'

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer)

console.log("time = ", new Date().toLocaleString());

let etherscanProvider = new ethers.providers.EtherscanProvider('goerli', "pkey");
const divider = 1000000000;


console.log("XXX: ", process.argv[2])

// Call listNFT function
const listNFT = async () => {
    var startTime = performance.now()

    let nftTxn = await myNftContract.listNFT("0x89a438ED2BE2ED4DFe8fA27e925c348C1e4E2414", parseInt(process.argv[2], 10), 1000, {
     gasLimit: new BigNumber("571295").toString(), value: new BigNumber("1").toString()});
    await nftTxn.wait()
    console.log(`NFT Listed! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

    let info = await etherscanProvider.getTransaction(nftTxn.hash);

    var endTime = performance.now()

    const gasUsed = parseInt(info.gasLimit._hex, 16);
    const gasPrice = parseInt(info.gasPrice._hex, 16) / divider;
    const maxPriorityFeePerGas = parseInt(info.maxPriorityFeePerGas._hex, 16) / divider;
    const baseFee = gasPrice - maxPriorityFeePerGas;
    const transactionFees = gasUsed * gasPrice;

    const values = [(endTime - startTime) / 1000, gasUsed, baseFee, maxPriorityFeePerGas, gasPrice, transactionFees];

    const valuesStr = values.toString() + "\n";

    fs.writeFileSync('./results_list.csv', valuesStr, { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
        });
    
    
}


listNFT()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
