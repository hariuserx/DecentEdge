const Web3 = require('web3')
const HDWalletProvider = require("@truffle/hdwallet-provider");
var to_address = process.argv.slice(2);

const provider = new HDWalletProvider({
    // mnemonic: fill the mnemonic of your address
    mnemonic: "",
    // providerOrUrl: Alchemy URL for sepolia
    providerOrUrl: "https://eth-sepolia.g.alchemy.com/v2/" + YOUR_ALCHEMY_API_KEY,
    addressIndex: 0
});

var web3 = new Web3(provider);
const fs = require('fs')
const call = async () => {
    await web3.eth.sendTransaction(
        // from: your public address
        {from:"",
        to:to_address[0].trim(),
        // 0.005: amount you would like to transfer to each account
        value: web3.utils.toWei("0.005", "ether")
        }, function(err, transactionHash) {
        if (err) { 
            console.log(err); 
        } else {
            fs.appendFile('transferETH_transactionHash.txt', transactionHash + '\r\n', (err) => {
                // In case of a error throw err.
                if (err) throw err;
            })
        }
    });
}

call()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
