// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';


contract NFTMarketplaceMAH is ReentrancyGuard{
    
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 public listingPrice = 0.01 * 10 ** 18;
    uint256 public transferFee = 0.005 * 10 ** 18;

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        string uri;
        address payable creator;
        address payable owner;
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

    constructor(){
        owner = payable(msg.sender);
    }

    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }

    function setListingPrice(uint256 gotListingPrice) public{
        if(msg.sender == owner){
            listingPrice = gotListingPrice * 10 ** 18;
        }
    }

    function getTransferFee() public view returns (uint256){
        return transferFee;
    }

    function setTransferFee(uint256 gotTransferFee) public{
        if(msg.sender == owner){
            transferFee = gotTransferFee;
        }
    }

    function createMarketItem(address nftContract, uint256 tokenId, uint256 price, string memory uri) public payable nonReentrant{
        require(price > 0, "You cannot sell for free.");
        require(msg.value == listingPrice, "You must pay the listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        
        MarketItemDatabase[itemId] = MarketItem(
            itemId, 
            nftContract, 
            tokenId,
            uri,
            payable(msg.sender), 
            payable(address(0)), 
            price, 
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        
        emit MarketItemCreated(
            itemId, 
            nftContract, 
            tokenId,
            uri,
            msg.sender, 
            address(0), 
            price, 
            false
        );
    }

    function buyMarketItem(address nftContract, uint256 itemId) public payable nonReentrant{
        uint256 price = MarketItemDatabase[itemId].price;
        uint256 tokenId = MarketItemDatabase[itemId].tokenId;

        require(msg.value == price, "Please pay the asking price.");

        if(MarketItemDatabase[itemId].owner == address(0)){
            MarketItemDatabase[itemId].creator.transfer(msg.value);
        } else if((MarketItemDatabase[itemId].owner != address(0)))
        {
            MarketItemDatabase[itemId].owner.transfer(msg.value);
        }
        
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        MarketItemDatabase[itemId].owner = payable(msg.sender);
        MarketItemDatabase[itemId].sold = true;
        _itemsSold.increment();
        //payable(owner).transfer(listingPrice);
    }

    function transferMarketItem(address nftContract, address recieverAddress, uint256 itemId) public payable nonReentrant{
        uint256 tokenId = MarketItemDatabase[itemId].tokenId;
        require((msg.sender == MarketItemDatabase[itemId].creator && MarketItemDatabase[itemId].owner == address(0)) || msg.sender == MarketItemDatabase[itemId].owner, "You are not the owner of this Item");
        require(msg.value == transferFee, "Please pay the transfer fee.");
        IERC721(nftContract).transferFrom(address(this), recieverAddress, tokenId);
        MarketItemDatabase[itemId].owner = payable(recieverAddress);
        payable(owner).transfer(transferFee);
    }

    function fetchUnsoldMarketItems() public view returns (MarketItem[] memory){
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();

        uint256 currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for(uint256 i=0; i<itemCount; i++){
            if(MarketItemDatabase[i+1].owner == address(0)){
                uint256 currentId = MarketItemDatabase[i+1].itemId;
                MarketItem storage currentItem = MarketItemDatabase[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchOwnedTokens(address walletAddress) public view returns (uint256[] memory){

        uint256 totalItemCount = _itemIds.current();
        uint256 tokenIdCount = 0;
        
        uint256 currentIndex = 0;
        for(uint256 i=0; i<totalItemCount; i++){

            if(MarketItemDatabase[i+1].creator == walletAddress && MarketItemDatabase[i+1].owner == address(0) || MarketItemDatabase[i+1].owner == walletAddress){
                tokenIdCount +=1;
            }
        }

        uint256[] memory tokenIds = new uint256[](tokenIdCount);
        for(uint i=0; i<totalItemCount; i++){

            if(MarketItemDatabase[i+1].creator == walletAddress && MarketItemDatabase[i+1].owner == address(0) || MarketItemDatabase[i+1].owner == walletAddress){
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

            if(MarketItemDatabase[i+1].creator == walletAddress && MarketItemDatabase[i+1].owner == address(0) || MarketItemDatabase[i+1].owner == walletAddress){
                uriCount +=1;
            }
        }

        string[] memory uris = new string[](uriCount);
        for(uint256 i=0; i<totalItemCount; i++){

            if(MarketItemDatabase[i+1].creator == walletAddress && MarketItemDatabase[i+1].owner == address(0) || MarketItemDatabase[i+1].owner == walletAddress){
                string memory currentURI = MarketItemDatabase[i+1].uri;
                uris[currentIndex] = currentURI;
                currentIndex +=1;
            }

        }

        return uris;
    }


    function fetchMyMarketItems() public view returns (MarketItem[] memory){
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        
        uint256 currentIndex = 0;
        for(uint256 i=0; i<totalItemCount; i++){
            if(MarketItemDatabase[i+1].owner == msg.sender){
                itemCount +=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint256 i=0; i<totalItemCount; i++){
            if(MarketItemDatabase[i+1].owner == msg.sender){
                uint256 currentId = MarketItemDatabase[i+1].itemId;
                MarketItem storage currentItem = MarketItemDatabase[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }

        return items;
    }

    function fetchItemsCreatedByMe() public view returns (MarketItem[] memory){
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        
        uint256 currentIndex = 0;
        for(uint256 i=0; i<totalItemCount; i++){
            if(MarketItemDatabase[i+1].creator == msg.sender){
                itemCount +=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint256 i=0; i<totalItemCount; i++){
            if(MarketItemDatabase[i+1].creator == msg.sender){
                uint256 currentId = MarketItemDatabase[i+1].itemId;
                MarketItem storage currentItem = MarketItemDatabase[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }

        return items;
    }

}