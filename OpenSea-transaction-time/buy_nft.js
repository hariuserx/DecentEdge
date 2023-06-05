const Web3 = require('web3')
const opensea = require('opensea-js')
const HDWalletProvider = require("@truffle/hdwallet-provider");

const alchemy_api = ""
const provider = new HDWalletProvider({
    mnemonic: "library cost lunar coach tongue card mimic bulk mimic drastic leopard burden",
    providerOrUrl: "https://eth-goerli.g.alchemy.com/v2/" + alchemy_api,
    addressIndex: 0
});

const seaport = new opensea.OpenSeaSDK(provider, {
  networkName: opensea.Network.Goerli,
  //gasPriceAddition: 50000000000000
})

const call = async () => {
    const order = await seaport.api.getOrder({
        side: "ask",
        assetContractAddress: "", // token address of smart contract
        tokenId: "", // NFT token ID
        //gas: 5000000000000000
      })
      const accountAddress = "" // The buyer's wallet address, also the taker
      var date1 = new Date();
      const transactionHash = await seaport.fulfillOrder({ order: order, accountAddress: accountAddress});
      var date2 = new Date();

   var diff = date2 - date1; //milliseconds interval
   console.log("Time taken to fulfill the order:", diff);
}

call()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });