// SPDX-License-Identifier: MIT
//Solidity Compiler: v0.8.4+commit.c7e474f2

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ReentrancyGuard, ERC721URIStorage, Ownable{
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter public _bidIds;
    address _scAddress;
    string public _tokenName;
    string public _tokenSymbol;
    uint256 private _maxTokenSupply;
    address payable marketOwner;
    mapping (uint256 => string) _tokenIDURI;
    uint256 totalUserMPWalletFunds;
    mapping(address => uint256) private mpWallets;

    struct MarketItem {
        uint256 tokenId;
        address nftContract;
        string uri;
        address payable nftCreator;
        address payable nftOwner;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => MarketItem) private MarketItemDatabase;

    event MarketItemCreated(
        uint256 indexed tokenId,
        address indexed nftContract,
        string uri,
        address creator,
        address owner,
        uint256 price,
        bool forSale
    );

    constructor(string memory tokenName, string memory tokenSymbol, uint256 gotMaxTokenSupply) ERC721(tokenName, tokenSymbol){

        marketOwner = payable(msg.sender);
        require(gotMaxTokenSupply > 0, "ERR:33");
        _maxTokenSupply = gotMaxTokenSupply;
        _tokenName = tokenName;
        _tokenSymbol = tokenSymbol;

    }

    function getMaxTokenSupply() public view returns (uint256){
        return (_maxTokenSupply);
    }

    function marketSetup(address scAddress) public onlyOwner{
        _scAddress = scAddress;
    }

    function getNewTokenID() public view returns (uint256){
        return _tokenIds.current();
    }

    function addTokens(uint256 gotNewMaxTokenSupply) public onlyOwner{
        require(msg.sender == marketOwner, "ERR:34");
        require(gotNewMaxTokenSupply > _maxTokenSupply, "ERR:35");
        _maxTokenSupply = gotNewMaxTokenSupply;
    }

    function fetchTokenIDURI(uint256 tokenID) public view returns (string memory){
        bytes memory tempTokenURI = bytes(_tokenIDURI[tokenID]);
        require(tempTokenURI.length > 0, "ERR:56");
        return _tokenIDURI[tokenID];
    }

    function mintNFT(string memory uri) public payable nonReentrant{
        require(_tokenIds.current() != _maxTokenSupply, "ERR:37");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);
        _tokenIDURI[newTokenId] = uri;

        MarketItemDatabase[newTokenId] = MarketItem(newTokenId, _scAddress, uri, payable(msg.sender), payable(address(0)), 0, false);
        
        emit MarketItemCreated(newTokenId, _scAddress, uri, msg.sender, address(0), 0, false);
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require((msg.sender == MarketItemDatabase[tokenId].nftCreator && MarketItemDatabase[tokenId].nftOwner == address(0)) || msg.sender == MarketItemDatabase[tokenId].nftOwner, "ERR:51");
        setApprovalForAll(_scAddress, true);
        MarketItemDatabase[tokenId].forSale = true;
        MarketItemDatabase[tokenId].price = price;
        IERC721(_scAddress).transferFrom(msg.sender, address(this), tokenId);
    }

    function unlistNFT(uint256 tokenId) public {
        require((msg.sender == MarketItemDatabase[tokenId].nftCreator && MarketItemDatabase[tokenId].nftOwner == address(0)) || msg.sender == MarketItemDatabase[tokenId].nftOwner, "ERR:51");
        require(MarketItemDatabase[tokenId].forSale == true, "ERR:38");
        setApprovalForAll(_scAddress, true);
        MarketItemDatabase[tokenId].forSale = false;
        MarketItemDatabase[tokenId].price = 0;
        IERC721(_scAddress).transferFrom(address(this), msg.sender, tokenId);
    }

    function sellNFT(uint256 tokenId, uint256 marketItemPrice, uint256 sellerGets, uint256 marketOwnerGets) public payable nonReentrant{
        require(msg.sender != marketOwner, "ERR:39");
        require(MarketItemDatabase[tokenId].forSale == true, "ERR:40");
        require(msg.value == marketItemPrice, "ERR:41");

        if(MarketItemDatabase[tokenId].nftOwner == address(0)){
            MarketItemDatabase[tokenId].nftCreator.transfer(sellerGets);
        } else if((MarketItemDatabase[tokenId].nftOwner != address(0)))
        {
            MarketItemDatabase[tokenId].nftOwner.transfer(sellerGets);
        }
        
        IERC721(_scAddress).transferFrom(address(this), msg.sender, tokenId);
        MarketItemDatabase[tokenId].nftOwner = payable(msg.sender);
        MarketItemDatabase[tokenId].forSale = false;
        MarketItemDatabase[tokenId].price = 0;
        payable(marketOwner).transfer(marketOwnerGets);
    }

    function transferNFT(address recieverAddress, uint256 tokenId, uint256 gotTransferFee) public payable nonReentrant{
        require((msg.sender == MarketItemDatabase[tokenId].nftCreator && MarketItemDatabase[tokenId].nftOwner == address(0)) || msg.sender == MarketItemDatabase[tokenId].nftOwner, "ERR:51");
        require(MarketItemDatabase[tokenId].forSale == false, "ERR:42");
        require(msg.value == gotTransferFee, "ERR:43");
        setApprovalForAll(_scAddress, true);
        MarketItemDatabase[tokenId].nftOwner = payable(recieverAddress);
        payable(marketOwner).transfer(gotTransferFee);
        IERC721(_scAddress).transferFrom(msg.sender, recieverAddress, tokenId);
    }

    function bidWalletIN(address gotAddress) public payable nonReentrant returns(bool){
        require(gotAddress != marketOwner, "ERR:49");
        mpWallets[gotAddress] = mpWallets[gotAddress] + msg.value;
        payable(marketOwner).transfer(msg.value);
        totalUserMPWalletFunds = totalUserMPWalletFunds + msg.value;
        return true;
    }

    function bidWalletOUT(address userWallet, uint256 withdrawAmount) public payable nonReentrant{
        require(userWallet != marketOwner, "ERR:50");
        require(msg.sender == userWallet, "ERR:57");
        require(mpWallets[userWallet] <= withdrawAmount, "ERR:44");
        mpWallets[userWallet] = mpWallets[userWallet] - withdrawAmount;
        totalUserMPWalletFunds = totalUserMPWalletFunds - withdrawAmount;
        payable(userWallet).transfer(withdrawAmount);
    }

    function bidPassCheck(address userWallet, uint256 currBid, uint256 tokenID) public view returns(bool){
        require(mpWallets[userWallet] > 0, "ERR:45");
        require((userWallet == MarketItemDatabase[tokenID].nftCreator && MarketItemDatabase[tokenID].nftOwner != address(0)) || userWallet != MarketItemDatabase[tokenID].nftOwner, "ERR:48");
        if(mpWallets[userWallet] >= currBid){
            return true;
        } else{
            return false;
        }
    }

    function soldBidNFT(address winner, uint256 bidAmount, uint256 nftOwnerGets, uint256 ownerGets, uint256 tokenId) public payable nonReentrant{
        require(MarketItemDatabase[tokenId].forSale == true, "ERR:46");
        require(msg.value == bidAmount, "ERR:47");
        setApprovalForAll(_scAddress, true);
        payable(MarketItemDatabase[tokenId].nftOwner).transfer(nftOwnerGets);
        payable(marketOwner).transfer(ownerGets);
        IERC721(_scAddress).transferFrom(MarketItemDatabase[tokenId].nftOwner, winner, tokenId);
        MarketItemDatabase[tokenId].nftOwner = payable(winner);
        MarketItemDatabase[tokenId].forSale == false;
        MarketItemDatabase[tokenId].price = 0;
        totalUserMPWalletFunds-=msg.value;
        mpWallets[winner] = mpWallets[winner] - msg.value;
    }

    function actualOwnerWallet(uint256 altOwnerFund) public view returns (uint256){
        return altOwnerFund-totalUserMPWalletFunds;
    }

    function bidderWallet(address bidderAddress) public view returns (uint256){
        return mpWallets[bidderAddress];
    }
    
}