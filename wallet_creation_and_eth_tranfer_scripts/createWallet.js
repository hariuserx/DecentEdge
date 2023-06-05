const ethers = require('ethers');
const mnemonic = ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
const wallet = ethers.Wallet.fromMnemonic(mnemonic);

// console.log(wallet)

// console.log('address:', wallet.address)
// console.log('mnemonic:', wallet.mnemonic)
// console.log('privateKey:', wallet.privateKey)

const fs = require('fs')

fs.appendFile('address.txt', wallet.address + '\r\n', (err) => {
      
    // In case of a error throw err.
    if (err) throw err;
})

fs.appendFile('mnemonic.txt', wallet.mnemonic + '\r\n', (err) => {
      
    // In case of a error throw err.
    if (err) throw err;
})

fs.appendFile('privateKey.txt', wallet.privateKey + '\r\n', (err) => {
      
    // In case of a error throw err.
    if (err) throw err;
})
