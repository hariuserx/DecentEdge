require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');

let etherscanProvider = new ethers.providers.EtherscanProvider('goerli', "------");

// Call buyNFT function
const checkStatus = async () => {
    var startTime = performance.now()

    let info = await etherscanProvider.getTransaction("0x95dc277e9293ee8520977ad9171fc85ca21ee173e14a47d5f157aaa5bc9a8805");

    var endTime = performance.now()

    console.log(endTime - startTime);
}


checkStatus()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
