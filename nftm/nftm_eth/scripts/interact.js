require("dotenv").config()
const API_URL = process.env.API_URL
// Get Alchemy App URL
const API_KEY = process.env.API_KEY;

const ethers = require('ethers');
// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider('goerli', API_KEY)
const privateKey = process.env.PRIVATE_KEY
const signer = new ethers.Wallet(privateKey, provider)

const contract = require("../artifacts/contracts/MarketPlace.sol/MarketPlace.json")
const contractAddress = "0x23E94A4BC6e9f01d238Fb13559AD49eebC48193F"
const nftContract = new ethers.Contract(contractAddress, contract.abi, signer)

async function getFunds(address) {
  const funds = await nftContract.getFunds(address)
  console.log(funds)
}

getFunds("0x89a438ED2BE2ED4DFe8fA27e925c348C1e4E2414");

