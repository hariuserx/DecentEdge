require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');
const BigNumber = require('bignumber.js');

// Get Alchemy App URL
const API_KEY = "-----"

// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider('goerli', API_KEY)

// Get contract ABI file
const contract = require("../artifacts/contracts/MarketPlace.sol/MarketPlace.json");

// Create a signer
const privateKey = "----"
//const privateKey = process.argv.slice(2)[0].trim
console.log(privateKey)
const signer = new ethers.Wallet(privateKey, provider)

// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0x28bB390c00F575Fc7e48D16456d11CB532e63f1E'

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer)

// Get the NFT Metadata IPFS URL
const tokenUri = "https://gateway.pinata.cloud/ipfs/QmYueiuRNmL4MiA2GwtVMm6ZagknXnSpQnB3z2gWbz36hP"

console.log("time = ", new Date().toLocaleString());

let etherscanProvider = new ethers.providers.EtherscanProvider('goerli', "----");
const divider = 1000000000;


// Call mintNFT function
const mintNFT = async () => {
    var startTime = performance.now()
    var start = new Date().toLocaleString()
    let nftTxn = await myNftContract.mintNFT(tokenUri)
    await nftTxn.wait()
    console.log(`NFT Minted! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`)

    var endTime = performance.now()
    var end = new Date().toLocaleString()
                fs.appendFile('mint_start_time.txt', start + '\r\n', (err) => {
                    
                                    // In case of a error throw err.
                                    if (err) throw err;
                                })
		            fs.appendFile('mint_end_time.txt', end + '\r\n', (err) => {
                    
                                    // In case of a error throw err.
                                    if (err) throw err;
                                })
    console.log("Time taken in milliseconds", start, " ", end, " ", endTime-startTime);
    /*
    let info = await etherscanProvider.getTransaction(nftTxn.hash);
    console.log(info);
    let blockInfo = await etherscanProvider.getBlock(info.blockNumber);
    console.log("Block LLL :", blockInfo.timestamp , " txnttl : ", info.timestamp);

    const gasUsed = parseInt(info.gasLimit._hex, 16);
    const gasPrice = parseInt(info.gasPrice._hex, 16) / divider;
    const maxPriorityFeePerGas = parseInt(info.maxPriorityFeePerGas._hex, 16) / divider;
    const baseFee = gasPrice - maxPriorityFeePerGas;
    const transactionFees = gasUsed * gasPrice;

    const values = [(endTime - startTime) / 1000, gasUsed, baseFee, maxPriorityFeePerGas, gasPrice, transactionFees];

    const valuesStr = values.toString() + "\n";

    fs.writeFileSync('./results.csv', valuesStr, { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
        });
    */
    
}


mintNFT()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
