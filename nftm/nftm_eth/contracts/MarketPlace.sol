// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MarketPlace is ReentrancyGuard, Ownable, ERC721URIStorage {

    using Counters for Counters.Counter;

    uint256 public number;

    address zeroAddress = 0x0000000000000000000000000000000000000000;

    mapping(address => uint256) public proxyWallet;
    mapping(address => bool) public withdrawStatus;
    mapping(uint256 => uint256) public sequenceNumbers;
    mapping(address => uint256) public walletSequenceNumbers;

    struct listedNFT {
        address buyerAddress;
        uint256 price;
        uint256 tokenId;
        address sellerAddress;
    }


    mapping(uint256 => listedNFT) public listedNFTS;

    
    event NFTListed(
        address buyerAddress,
        uint256 price,
        uint256 tokenId,
        address sellerAddress
    );

    event NFTPurchased (
        uint256 tokenId,
        uint256 balance,
        address owner
    );

    Counters.Counter private _tokenIds;

    uint256 public LISTING_FEE = 0.005 ether;
    address marketplaceAddress;

    constructor() ERC721("MyNFT", "NFT") {
        marketplaceAddress = msg.sender;
    }

    function mintNFT(string memory tokenURI)
        public
        returns (uint256)
    {

        // Verify digital signature
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        sequenceNumbers[newItemId] = 1;

        return newItemId;
    }

    function listNFT(address buyerAddress, uint256 _tokenId, uint256 _price) payable public {

        //verify signature (may not be required as caller is the owner of the nft)

        require(_price > 0, "Price must be at least 1 wei");
        require(msg.value >= LISTING_FEE, "Need to pay minimum listing fee");

        require(this.ownerOf(_tokenId) == msg.sender, "You are not the owner");

        // Set contract approval to sell the nft.
        approve(marketplaceAddress, _tokenId);

        listedNFTS[_tokenId] = listedNFT(buyerAddress, _price, _tokenId, msg.sender);

        emit NFTListed(buyerAddress, _price, _tokenId, msg.sender);

    }


    function unlistNFT(uint256 _tokenId) public {

        //verify signature (may not be required as caller is the owner of the nft)
        
        require(this.ownerOf(_tokenId) == msg.sender, "You are not the owner");
        
        // Unset contract approval to sell the nft.
        approve(zeroAddress, _tokenId);

        delete listedNFTS[_tokenId];
    }

    function buyNFT(address buyerAddress, uint256 tokenId, uint256 seqNum, bytes memory buyerSignature,
                bytes memory teeSignature) payable public onlyOwner{

        string memory expected_message = string.concat("Buy;seq_num:",Strings.toString(seqNum), ";token:", Strings.toString(tokenId));

        // verify tee signature
        require(verify(marketplaceAddress, expected_message, teeSignature), "TEE Signature verification failed");


        // verify buyer signature
        require(verify(buyerAddress, expected_message, buyerSignature), "Buyer Signature verification failed");



        // verify sequence number
        require(sequenceNumbers[tokenId] <= seqNum, "Duplicate transaction or Invalid order");
        require(listedNFTS[tokenId].tokenId > 0, "NFT is not listed");
        
        if (listedNFTS[tokenId].buyerAddress == buyerAddress || listedNFTS[tokenId].buyerAddress == address(0)) {
            require(proxyWallet[buyerAddress] > listedNFTS[tokenId].price, "Not enough funds");
            
            transferFrom(listedNFTS[tokenId].sellerAddress, buyerAddress, tokenId);
            
            proxyWallet[buyerAddress] -= listedNFTS[tokenId].price;
            proxyWallet[listedNFTS[tokenId].sellerAddress] += listedNFTS[tokenId].price;

            require(proxyWallet[buyerAddress] >= 0, "Not enough funds");

            delete listedNFTS[tokenId];

            sequenceNumbers[tokenId] = seqNum + 1;

            emit NFTPurchased(tokenId, proxyWallet[buyerAddress], buyerAddress);

        }

        else {
            require(false, "Listed for another buyer");
        }

    }

    function addFunds() payable public {
        proxyWallet[msg.sender] += msg.value;
    }

    function getFunds(address add) public view returns (uint256) {
        return proxyWallet[add];
    }

    function allowWithdrawl(address add, bytes memory signature, uint256 seqNumber) public onlyOwner {
        // verify signature
        
        require(walletSequenceNumbers[add] <= seqNumber, "Sequence number is old");

        string memory expected_message = string.concat("AllowWithdrawl;seq_num:",Strings.toString(seqNumber), ";addr:", Strings.toHexString(uint160(add), 20));

        require(verify(marketplaceAddress, expected_message, signature), "Signature verification failed");

        walletSequenceNumbers[add] = seqNumber + 1;


        withdrawStatus[add] = true;
    }

    function blockWithdrawl(address add, bytes memory signature, uint256 seqNumber) public onlyOwner {
        // verify signature

        require(walletSequenceNumbers[add] <= seqNumber, "Sequence number is old");

        string memory expected_message = string.concat("BlockWithdrawl;seq_num:",Strings.toString(seqNumber), ";addr:", Strings.toHexString(uint160(add), 20));

        require(verify(marketplaceAddress, expected_message, signature), "Signature verification failed");

        walletSequenceNumbers[add] = seqNumber + 1;

        withdrawStatus[add] = false;
    }

    function withdraw(uint256 amount) public {
        require(withdrawStatus[msg.sender], "Blocked for withdrawl");
        require(amount <= proxyWallet[msg.sender], "Not sufficient balance");

        address payable payee = payable(msg.sender);

        payee.transfer(amount);
        proxyWallet[msg.sender] -= amount;
    }
  
    function store(uint256 num) public {
        number = num;
    }
   
    function retrieve() public view returns (uint256){
        return number;
    }

    // function getMessageHash(
    //     string memory _message
    // ) public pure returns (bytes32) {
    //     return keccak256(abi.encodePacked(_message));
    // }

   
    // function getEthSignedMessageHash(string memory _message)
    //     public
    //     pure
    //     returns (bytes32)
    // {
       
    //     return
    //         keccak256(
    //             abi.encodePacked("\x19Ethereum Signed Message:\n", bytes(_message).length, _message)
    //         );
    // }


    function getEthSignedMessageHash(string memory _message) public pure returns (bytes32) {
        return keccak256(bytes(string.concat("\x19Ethereum Signed Message:\n", Strings.toString(bytes(_message).length), _message)));
    }

    function verify(
        address _signer,
        string memory _message,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(_message);

        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }
}