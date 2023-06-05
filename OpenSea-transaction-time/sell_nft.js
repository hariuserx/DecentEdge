const Web3 = require('web3')
const opensea = require('opensea-js')
const HDWalletProvider = require("@truffle/hdwallet-provider");

// arg[0]: private mnemonic of the selling account
// arg[1]: account address
// arg[2]: NFT token ID
// arg[3]: alchemy API
var arg = process.argv.slice(2);

const provider = new HDWalletProvider({
    mnemonic: arg[0],
    providerOrUrl: "https://eth-goerli.g.alchemy.com/v2/"+arg[3],
    addressIndex: 0
});

const seaport = new opensea.OpenSeaSDK(provider, {
  networkName: opensea.Network.Goerli
})


const call = async () => {
  const accountAddress = arg[1]
  const tokenId = arg[2].toString()
  const tokenAddress = "" //token address of smart contract
  var date1 = new Date();
  const offer = await seaport.createSellOrder({
    asset: {
      tokenAddress: tokenAddress,
      tokenId: tokenId,
    },
    accountAddress: accountAddress,
    startAmount: 0.000000000005
  })
  var date2 = new Date();
  var diff = date2 - date1; //milliseconds interval
  console.log("Time taken to list the NFT " + tokenId + ":", diff);
}

call()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });