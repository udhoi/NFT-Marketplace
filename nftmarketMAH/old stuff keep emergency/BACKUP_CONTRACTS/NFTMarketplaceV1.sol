// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract NFTMarketplaceV1 is ReentrancyGuard, ERC721URIStorage{
    
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _tokenIds;
    address _scAddress;
    string public _tokenName;
    string public _tokenSymbol;
    uint256 public _maxTokenSupply;
    uint256 public _listingFee;
    uint256 public _transferFee;
    uint256 public _marketOwnerFee; //Limit to 2dp max

    address payable owner;


    //Variables to add
    //Percentage of what each party gets: Seller, Market Owner, Creator.
    //Idea: Store the marketOwnerFee percentage in global (make set get functions) and creatorFee (store in item and make set function)...
    //...in solidity like this: creatorPercentage * 10 * decimal().
    //Then in the client side we can calculate the seller gets finally in the end.

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        string uri;
        address payable nftCreator;
        address payable nftOwner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private MarketItemDatabase;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        string uri,
        address creator,
        address owner,
        uint256 price,
        bool sold
    );

    constructor(string memory tokenName, string memory tokenSymbol, uint256 gotMaxTokenSupply, uint256 listingPrice, uint256 transferFee, uint256 marketOwnerFee) ERC721(tokenName, tokenSymbol){
        owner = payable(msg.sender);
        require(gotMaxTokenSupply > 0, "Max token supply needs to be greater than 0.");
        _maxTokenSupply = gotMaxTokenSupply;
        _tokenName = tokenName;
        _tokenSymbol = tokenSymbol;
        _listingFee = listingPrice;
        _transferFee = transferFee;
        _marketOwnerFee = marketOwnerFee;
    }

    function createToken(string memory tokenURI) public {
        require(_tokenIds.current() != _maxTokenSupply, "MAHTKN Token has reached it's max supply limit");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(_scAddress, true);
    }

    function getNewCreatedTokenID() public view returns (uint256){
        return _tokenIds.current();
    }

    //MAX 2 DECIMAL PLACES OR DON'T TAKE INPUT!!!
    function setMarketOwnerFee(uint256 newMarketOwnerFee) public {
        _marketOwnerFee = newMarketOwnerFee;
    }

    function getMarketOwnerFee() public view returns (uint256) {
        return _marketOwnerFee;
    }

    function setSmartContractAddress(address scAddress) public{
        _scAddress = scAddress;
    }

    function getMaxTokenSupply() public view returns (uint256){
        return _maxTokenSupply;
    }

    function setMaxTokenSupply(uint256 gotNewMaxTokenSupply) public {
        require(gotNewMaxTokenSupply > _maxTokenSupply, "New max token supply needs to be greater than previous Max Token Supply.");
        _maxTokenSupply = gotNewMaxTokenSupply;
    }

    function getTokenName() public view returns (string memory){
        return _tokenName;
    }

    function getTokenSymbol() public view returns (string memory){
        return _tokenSymbol;
    }

    function getNewTokenID() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getListingFee() public view returns (uint256){
        return _listingFee;
    }

    function setListingFee(uint256 gotListingFee) public{
        if(msg.sender == owner){
            _listingFee = gotListingFee * 10 ** 18;
        }
    }

    function getTransferFee() public view returns (uint256){
        return _transferFee;
    }

    function setTransferFee(uint256 gotTransferFee) public{
        if(msg.sender == owner){
            _transferFee = gotTransferFee;
        }
    }

    function createMarketItem(address nftMarketContract, uint256 tokenId, uint256 price, string memory uri) public payable nonReentrant{
        require(price > 0, "You cannot sell for free.");
        require(msg.value == _listingFee, "You must pay the listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        
        MarketItemDatabase[itemId] = MarketItem(
            itemId, 
            nftMarketContract, 
            tokenId,
            uri,
            payable(msg.sender), 
            payable(address(0)), 
            price, 
            false
        );

        IERC721(nftMarketContract).transferFrom(msg.sender, address(this), tokenId);
        payable(owner).transfer(msg.value);
        
        emit MarketItemCreated(
            itemId, 
            nftMarketContract, 
            tokenId,
            uri,
            msg.sender, 
            address(0), 
            price, 
            false
        );

    }

    function buyMarketItem(address nftContract, uint256 itemId, uint256 sellerGets, uint256 marketOwnerGets) public payable nonReentrant{

        uint256 price = MarketItemDatabase[itemId].price;
        uint256 tokenId = MarketItemDatabase[itemId].tokenId;

        require(msg.value == price, "Please pay the asking price.");

        if(MarketItemDatabase[itemId].nftOwner == address(0)){
            MarketItemDatabase[itemId].nftCreator.transfer(sellerGets);
        } else if((MarketItemDatabase[itemId].nftOwner != address(0)))
        {
            MarketItemDatabase[itemId].nftOwner.transfer(sellerGets);
        }
        
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        MarketItemDatabase[itemId].nftOwner = payable(msg.sender);
        MarketItemDatabase[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(marketOwnerGets);
    }

    function transferMarketItem(address nftContract, address recieverAddress, uint256 itemId) public payable nonReentrant{
        uint256 tokenId = MarketItemDatabase[itemId].tokenId;
        require((msg.sender == MarketItemDatabase[itemId].nftCreator && MarketItemDatabase[itemId].nftOwner == address(0)) || msg.sender == MarketItemDatabase[itemId].nftOwner, "You are not the owner of this Item");
        require(msg.value == _transferFee, "Please pay the transfer fee.");
        IERC721(nftContract).transferFrom(address(this), recieverAddress, tokenId);
        MarketItemDatabase[itemId].nftOwner = payable(recieverAddress);
        payable(owner).transfer(_transferFee);
    }

    function fetchOwnedTokens(address walletAddress) public view returns (uint256[] memory){

        uint256 totalItemCount = _itemIds.current();
        uint256 tokenIdCount = 0;
        
        uint256 currentIndex = 0;
        for(uint256 i=0; i<totalItemCount; i++){

            if(MarketItemDatabase[i+1].nftCreator == walletAddress && MarketItemDatabase[i+1].nftOwner == address(0) || MarketItemDatabase[i+1].nftOwner == walletAddress){
                tokenIdCount +=1;
            }
        }

        uint256[] memory tokenIds = new uint256[](tokenIdCount);
        for(uint i=0; i<totalItemCount; i++){

            if(MarketItemDatabase[i+1].nftCreator == walletAddress && MarketItemDatabase[i+1].nftOwner == address(0) || MarketItemDatabase[i+1].nftOwner == walletAddress){
                uint256 currentId = MarketItemDatabase[i+1].tokenId;
                tokenIds[currentIndex] = currentId;
                currentIndex +=1;
            }

        }

        return tokenIds;
    }

    function fetchWalletAddressURIs(address walletAddress) public view returns (string[] memory){

        uint256 totalItemCount = _itemIds.current();
        uint256 uriCount = 0;
        
        uint256 currentIndex = 0;
        for(uint256 i=0; i<totalItemCount; i++){

            if(MarketItemDatabase[i+1].nftCreator == walletAddress && MarketItemDatabase[i+1].nftOwner == address(0) || MarketItemDatabase[i+1].nftOwner == walletAddress){
                uriCount +=1;
            }
        }

        string[] memory uris = new string[](uriCount);
        for(uint256 i=0; i<totalItemCount; i++){

            if(MarketItemDatabase[i+1].nftCreator == walletAddress && MarketItemDatabase[i+1].nftOwner == address(0) || MarketItemDatabase[i+1].nftOwner == walletAddress){
                string memory currentURI = MarketItemDatabase[i+1].uri;
                uris[currentIndex] = currentURI;
                currentIndex +=1;
            }

        }

        return uris;
    }

//-----------------------MY FUNCTIONS----------------------------
    
/*
    function fetchUnsoldMarketItems() public view returns (MarketItem[] memory){
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();

        uint256 currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for(uint256 i=0; i<itemCount; i++){
            if(MarketItemDatabase[i+1].nftOwner == address(0)){
                uint256 currentId = MarketItemDatabase[i+1].itemId;
                MarketItem storage currentItem = MarketItemDatabase[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
    */
    

    /*
    function fetchMyMarketItems() public view returns (MarketItem[] memory){
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        
        uint256 currentIndex = 0;
        for(uint256 i=0; i<totalItemCount; i++){
            if(MarketItemDatabase[i+1].nftOwner == msg.sender){
                itemCount +=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint256 i=0; i<totalItemCount; i++){
            if(MarketItemDatabase[i+1].nftOwner == msg.sender){
                uint256 currentId = MarketItemDatabase[i+1].itemId;
                MarketItem storage currentItem = MarketItemDatabase[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }

        return items;
    }
    */
    

    /*
    function fetchItemsCreatedByMe() public view returns (MarketItem[] memory){
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        
        uint256 currentIndex = 0;
        for(uint256 i=0; i<totalItemCount; i++){
            if(MarketItemDatabase[i+1].nftCreator == msg.sender){
                itemCount +=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint256 i=0; i<totalItemCount; i++){
            if(MarketItemDatabase[i+1].nftCreator == msg.sender){
                uint256 currentId = MarketItemDatabase[i+1].itemId;
                MarketItem storage currentItem = MarketItemDatabase[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }

        return items;
    }
    */
    
}