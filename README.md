# DecentEdge/LiftPlace
LiftPlace implementation and evaluation modules

The complete evaluation data is present in `Evaluations.xlsx`

## Project Setup
For the Liftplace off chain component, we need an SGX enabled machine.

Install the OpenEnclave SDK following the guide https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/README.md
and make sure that you are able to run a sample project from https://github.com/openenclave/openenclave/blob/master/samples/helloworld/README.md

### Additional setup
Follow the required steps in `setup.sh`

## Starting LiftPlace
A CLI interface can be accessed as follows

```shell
cd nftm
make build
make run
```

Note: We have removed our private keys (TEE) in the source files. Replace them with 
your generated keys. (enc.cpp and host.cpp) 

This Open an interactive shell and the available commands are

1. gd --- generate message digest
2. gs -- generate signature
3. initiate - initiate the marketplace (called by verifiers)
4. mint -- mint nft
5. list -- list nft
6. update_balance -- update proxy wallet balance
7. buy -- buy nft
8. update_txn_status -- final section called by verifiers
9. print_nfts -- print nfts with owners
10. print_wallets -- print wallet balances
11. print_listings -- print listed NFTs
12. print_pending -- print pending on-chain transactions (final sections)

## OpenSea throughput evaluation
For OpenSea evaluations we used https://github.com/ProjectOpenSea/seaport. 
Download the repo and create the required number of wallets for throughput testing 
using the `createWallet_shell.sh` in `wallet_creation_and_eth_tranfer_scripts` folder 
in this repo. After the wallet creation, name the files as 

`address.txt` -- public keys <br>
`mnemonic.txt` -- passwords <br>
`privateKey.txt` -- private keys <br>

We need additional dependencies on 

`"@opensea/seaport-js": "^1.1.0"` and `"alchemy-sdk": "^2.7.0"`.

Now, use the `interact.js` in `OpenSea-throughput` directory to perform 3 actions
1. setting approvals over the NFT smart contract to seaport smart contracts. This has to be done first.
2. Create order
3. Finally, fullfil orders

All the above actions can be trigerred by the provided `execute-shell.sh` command.
Make sure to uncomment the corresponding step in `interact.js`.

## OpenSea transaction time evaluations
We used the OpenSea SDK https://github.com/ProjectOpenSea/opensea-js to perform transaction time 
evaluations. Note that this is rate limited. 

`sell_nft.js` is used to List(Sell) an NFT on OpenSea. The NFT token needs to be in your account and you can set a price for it.

`buy_nft.js` is used to Buy an NFT on OpenSea if you know the token ID of the NFT and have sufficient balance in your account.

The ETH gets transferred between the buyer and seller when the order gets executed.

## Onchain NFT marketplace evaluations 
Create Alchemy account in https://www.alchemy.com/homepage and generate API keys.
We use Alchemy as our connector. Also create etherscan account from https://etherscan.io/
and generate API key to access the transaction status. Populate the keys in 
`nftm/nftm_eth/.env`

Our main on-chain smartcontract is in `nftm/nftm_eth/contracts`. We need to deploy it first.

```shell
cd nftm
cd nftm_eth

npm init -y
npm install --save-dev hardhat
npm install @openzeppelin/contracts
npm install dotenv --save
npx hardhat run scripts/deploy.js --network sepolia
```

Or you can use an online IDE like remix (https://remix.ethereum.org/) to manage and deploy your smart contract.

Now you can use the files in the scripts directory to perform various marketpalce functions.

Example of parallel execution of NFT buy requests:
```shell
for i in {1..21}; do node scripts/buy-sepolia.js $i; done
```


## LiftPlace Evaluations
Some sample test cases are provided in `nftm/testcases`

Note that we have removed our private keys from these testcases which are required 
for execution. We replaced the keys with `pkey` placeholder.

Example:
```shell
for i in {1..100}; do make run < testcases/input.txt; done;
```

### Without SGX evaluations
Use the `host.cpp.without_sgx` file instead of host.cpp for evaluating the performance 
without using SGX.
