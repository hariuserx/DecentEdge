async function main() {
    // Grab the contract factory 
    const MarketPlace = await ethers.getContractFactory("MarketPlace");
 
    // Start deployment, returning a promise that resolves to a contract object
    const marketPlace = await MarketPlace.deploy(); // Instance of the contract 
    console.log("Contract deployed to address:", marketPlace.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });