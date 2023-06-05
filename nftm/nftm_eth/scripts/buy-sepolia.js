require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');
const BigNumber = require('bignumber.js');

const alchemy = require('alchemy-sdk')

// Get Alchemy App URL
const API_KEY = process.env.API_KEY;

// Define an Alchemy Provider
//const provider = new ethers.providers.AlchemyProvider('sepolia', API_KEY)
const alch = new alchemy.Alchemy({
    apiKey: API_KEY, // Replace with your Alchemy API key.
    network: alchemy.Network.ETH_SEPOLIA // Replace with your network.
});


const buyNFT = async () => {

    const provider = await alch.config.getProvider();

        // Get contract ABI file
    const contract = require("../artifacts/contracts/MarketPlace.sol/MarketPlace.json");

    // Create a signer

    const tee_privateKey = process.env.TEE_PRIVATE_KEY
    const buyer_privateKey = process.env.PRIVATE_KEY_B
    const signer = new ethers.Wallet(tee_privateKey, provider)
    const buyerSigner = new ethers.Wallet(buyer_privateKey, provider);

    signer.estimateGas = async(transaction) => {
        return new BigNumber("5849181").toString();
    }

    // Get contract ABI and address
    const abi = contract.abi
    const contractAddress = '0x371Ce5B01deCc5444cCA43A11d15a1dCf6Fd7f66'

    // Create a contract instance
    const myNftContract = new ethers.Contract(contractAddress, abi, signer)

    console.log("time = ", new Date().toLocaleString());

    let etherscanProvider = new ethers.providers.EtherscanProvider('sepolia', "pkey");
    const divider = 1000000000;

    var startTime = performance.now()

     // Message we are signing
     const message = "Buy;seq_num:" + process.argv[2] + ";token:" + process.argv[2];

     // Unlike Web3.js, Ethers seperates the provider instance and wallet instance, so we must also create a wallet instance
     const teeSignature = await signer.signMessage(message);
     const buyerSignature = await buyerSigner.signMessage(message);

    let nftTxn = await myNftContract.buyNFT("0xE7a85A68A066bb55CF03BD7ACFD7a13dfb579450", parseInt(process.argv[2], 10), parseInt(process.argv[2], 10), 
            buyerSignature, teeSignature, {value: new BigNumber("1").toString()});
    //let nftTxn = await myNftContract.mintNFT(tokenUri, {maxPriorityFeePerGas: new BigNumber("10000").toString(),
    //                                    maxFeePerGas: new BigNumber("110000").toString()})
    await nftTxn.wait()
    console.log(`NFT Bought! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);

    let info = await etherscanProvider.getTransaction(nftTxn.hash);

    var endTime = performance.now()

    console.log(info);

    // some how info doesn't contain gasused now. So using it from the online value which is fixed for a method.
    const gasUsed = 171295;
    const gasPrice = parseInt(info.gasPrice._hex, 16) / divider;
    const maxPriorityFeePerGas = parseInt(info.maxPriorityFeePerGas._hex, 16) / divider;
    const baseFee = gasPrice - maxPriorityFeePerGas;
    const transactionFees = gasUsed * gasPrice;

    const values = [(endTime - startTime) / 1000, gasUsed, baseFee, maxPriorityFeePerGas, gasPrice, transactionFees];

    const valuesStr = values.toString() + "\n";

    fs.writeFileSync('./results_list_sepolia.csv', valuesStr, { flag: 'a+' }, err => {
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
