const Seaport = require('@opensea/seaport-js')
const BigNumber = require('bignumber.js');
const constants = require('@opensea/seaport-js/lib/constants')
const alchemy = require('alchemy-sdk')

require("dotenv").config()

// Get Alchemy App URL
const API_KEY = process.env.API_KEY;

const ethers = require('ethers');

// Define an Alchemy Provider
//const provider = new ethers.providers.AlchemyProvider('sepolia', API_KEY)
const alch = new alchemy.Alchemy({
    apiKey: API_KEY, // Replace with your Alchemy API key.
    network: alchemy.Network.ETH_SEPOLIA // Replace with your network.
});


async function execute() {

// Define an Alchemy Provider
    const provider = await alch.config.getProvider();
    const privateKey = process.argv.slice(2)[0].trim()
    const signer = new ethers.Wallet(privateKey, provider)

    signer.estimateGas = async(transaction) => {
        return new BigNumber("584918").toString();
    }

    const seaport = new Seaport.Seaport(signer);

    const contract = require("../nftm/nftm_eth/artifacts/contracts/MarketPlace.sol/MarketPlace.json")
    const nftContractAddress = "0x371Ce5B01deCc5444cCA43A11d15a1dCf6Fd7f66"
    const nftContract = new ethers.Contract(nftContractAddress, contract.abi, signer)

    const buyer = "0xE7a85A68A066bb55CF03BD7ACFD7a13dfb579450"

    const offerer = "0x9a932e12B60cE08b891710e100Ed80bb0b2E63ba";
    const fulfiller = "0xE7a85A68A066bb55CF03BD7ACFD7a13dfb579450";

    let x = await nftContract.setApprovalForAll("0x00000000006c3852cbEf3e08E8dF289169EdE581", true);
    await x.wait()

    let y = await nftContract.setApprovalForAll("0x00000000000001ad428e4906aE43D8F9852d0dD6", true);
    await y.wait()

    let z = await nftContract.setApprovalForAll("0x00000000F9490004C11Cef243f5400493c00Ad63", true);
    await z.wait()

// Create order -- uncomment it

// const { executeAllActions } = await seaport.createOrder(
//   {
//     offer: [
//       {
//         itemType: constants.ItemType.ERC721,
//         token: "0x371Ce5B01deCc5444cCA43A11d15a1dCf6Fd7f66",
//         identifier: "73",
//       },
//     ],
//     consideration: [
//       {
//         amount: ethers.utils.parseEther("0.000001").toString(),
//         recipient: offerer,
//       },
//     ],
//   },
//   offerer
// );

// const order = await executeAllActions();


// console.log("Order: ", order);

    // Full fill order -- uncomment. Must be called after creating the order and setting approveall permission.

// const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
//     order,
//     accountAddress: fulfiller,
//   });

//   const transaction = await executeAllFulfillActions();
//   console.log("Full fll status: ", transaction);

}

execute().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
