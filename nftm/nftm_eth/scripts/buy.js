require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');
const BigNumber = require('bignumber.js');
const { hashMessage } = require("@ethersproject/hash");

// Get Alchemy App URL
const API_KEY = process.env.API_KEY;

// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider('goerli', API_KEY)

// Get contract ABI file
const contract = require("../artifacts/contracts/MarketPlace.sol/MarketPlace.json");

// Create a signer
const tee_privateKey = process.env.PRIVATE_KEY_A
const buyer_privateKey = process.env.PRIVATE_KEY_C
const signer = new ethers.Wallet(tee_privateKey, provider)
const buyerSigner = new ethers.Wallet(buyer_privateKey, provider);


// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0x28bB390c00F575Fc7e48D16456d11CB532e63f1E'

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer)

// Get the NFT Metadata IPFS URL

console.log("time = ", new Date().toLocaleString());

let etherscanProvider = new ethers.providers.EtherscanProvider('goerli', "pkey");
const divider = 1000000000;

// Call buyNFT function
const buyNFT = async () => {
    var startTime = performance.now()

    // Message we are signing
    const message = "Buy;seq_num:" + process.argv[2] + ";token:" + process.argv[2];

    // Unlike Web3.js, Ethers seperates the provider instance and wallet instance, so we must also create a wallet instance
    const teeSignature = await signer.signMessage(message);
    const buyerSignature = await buyerSigner.signMessage(message);

    let nftTxn = await myNftContract.buyNFT("0x89a438ED2BE2ED4DFe8fA27e925c348C1e4E2414", parseInt(process.argv[2], 10), parseInt(process.argv[2], 10), 
        buyerSignature, teeSignature, {gasLimit: new BigNumber("571295").toString(), value: new BigNumber("1").toString()});
    await nftTxn.wait()
    console.log(`NFT purchased! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

    let info = await etherscanProvider.getTransaction(nftTxn.hash);

    var endTime = performance.now()

    const gasUsed = parseInt(info.gasLimit._hex, 16);
    const gasPrice = parseInt(info.gasPrice._hex, 16) / divider;
    const maxPriorityFeePerGas = parseInt(info.maxPriorityFeePerGas._hex, 16) / divider;
    const baseFee = gasPrice - maxPriorityFeePerGas;
    const transactionFees = gasUsed * gasPrice;

    const values = [(endTime - startTime) / 1000, gasUsed, baseFee, maxPriorityFeePerGas, gasPrice, transactionFees];

    const valuesStr = values.toString() + "\n";

    fs.writeFileSync('./results_buy.csv', valuesStr, { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
        });
    
    
}


buyNFT()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
