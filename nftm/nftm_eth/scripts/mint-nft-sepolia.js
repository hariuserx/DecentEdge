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


// Call mintNFT function
const mintNFT = async () => {

    const provider = await alch.config.getProvider();

        // Get contract ABI file
    const contract = require("../artifacts/contracts/MarketPlace.sol/MarketPlace.json");

    // Create a signer
    const privateKey = process.env.PRIVATE_KEY_A
    const signer = new ethers.Wallet(privateKey, provider)

    signer.estimateGas = async(transaction) => {
        return new BigNumber("5849181").toString();
    }

    // Get contract ABI and address
    const abi = contract.abi
    const contractAddress = '0x371Ce5B01deCc5444cCA43A11d15a1dCf6Fd7f66'

    // Create a contract instance
    const myNftContract = new ethers.Contract(contractAddress, abi, signer)

    // Get the NFT Metadata IPFS URL
    const tokenUri = "https://gateway.pinata.cloud/ipfs/QmYueiuRNmL4MiA2GwtVMm6ZagknXnSpQnB3z2gWbz36hP"

    console.log("time = ", new Date().toLocaleString());

    let etherscanProvider = new ethers.providers.EtherscanProvider('sepolia', "-----");
    const divider = 1000000000;

    var startTime = performance.now()
    let nftTxn = await myNftContract.mintNFT(tokenUri)
    //let nftTxn = await myNftContract.mintNFT(tokenUri, {maxPriorityFeePerGas: new BigNumber("10000").toString(),
    //                                    maxFeePerGas: new BigNumber("110000").toString()})
    await nftTxn.wait()
    console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);

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

    fs.writeFileSync('./results_mint_sepolia.csv', valuesStr, { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
        });
    
    
}


mintNFT()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
