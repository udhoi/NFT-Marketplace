//const { inputToConfig } = require("@ethereum-waffle/compiler");
const {ethers} = require("hardhat");
const {utils, BigNumber} = require('ethers');

describe("NFT Marketplace MAH (Function Calls)", function(){

    it("Deploy Solidity Smart Contracts", async function(){

        //Pre-requisites
        let tokenName = "Test Token Name"; //INPUT (Frontend)
        let tokenSymbol = "TKNSYMBL"; //INPUT (Frontend)
        let initialTokenSupply = 5000; //INPUT (Frontend)
        let maxTokenSupply = "1000000000"; //INPUT (Frontend)


        //Deploy smart contract
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();

    });

    it("Set/Get - Max token supply", async function(){

        //Pre-requisites
        let maxTokenSupply = "100000"; //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS
        let initialTokenSupply = 5000; //IGNORE THIS


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();


        //FUNCTIONS:
        //Function - Set max token supply
        nft.setMaxTokenSupply(BigNumber.from(maxTokenSupply));
        //Function - Get max token supply
        maxToken = nft.getMaxTokenSupply();

    });


    it("Set/Get - Listing price", async function(){

        //Pre-requisites
        let listingPrice = "0.055"; //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS
        let initialTokenSupply = 5000; //IGNORE THIS


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();
        

        //FUNCTIONS:
        //Function - Set listing price
        market.setListingPrice(ethers.utils.parseUnits(listingPrice,"ether"));
        //Function - Get listing price
        listingPrice = market.getListingPrice();

    });

    it("Mint NFT / List NFT", async function(){

        //Pre-requisites
        let uriLink = "http://uriLink.com"; //INPUT (Frontend)
        let sellPrice = "0.09"; //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS
        let initialTokenSupply = 5000; //IGNORE THIS


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();


        //FEATURE:
        //Create market item
        nft.createToken(uriLink);
        await market.createMarketItem(nft.address, nft.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await market.getListingPrice()});
        const getNewTokenID = await nft.getNewTokenID();
        
    });

    /*
    it("Fetch Market Items", async function(){

        //Pre-requisites
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let sellPrice = "0.01"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS
        let initialTokenSupply = 5000; //IGNORE THIS


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();
        await nft.createToken(uriLink);
        await market.createMarketItem(nft.address, nft.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await market.getListingPrice()});
        

        //FUNCTIONS:
        //Function - Fetch market items
        const marketItemsArray = await market.fetchUnsoldMarketItems();

    });
    */

    it("Transfer Market Items", async function(){

        //Pre-requisites
        let recieverAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"; //INPUT (Frontend) [NOTE: This is just an example address input]
        let transferItemId = 1; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let sellPrice = "0.01"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS
        let initialTokenSupply = 5000; //IGNORE THIS


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();
        await nft.createToken(uriLink);
        await market.createMarketItem(nft.address, nft.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await market.getListingPrice()});
        

        //FUNCTIONS:
        //Function - Transfer market items
        await market.transferMarketItem(nft.address, recieverAddress, transferItemId, {value: market.getTransferFee()});

    });


    it("Sell Market Items", async function(){

        //Pre-requisites
        let itemId = 1; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let sellPrice = "0.01"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS
        let initialTokenSupply = 5000; //IGNORE THIS


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();
        await nft.createToken(uriLink);
        await market.createMarketItem(nft.address, nft.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await market.getListingPrice()});
        

        //FUNCTIONS:
        //Function - Sell market items
        await market.buyMarketItem(nft.address, itemId, {value: ethers.utils.parseUnits(sellPrice,"ether")});

    });

    it("Fetch wallet address owned tokens", async function(){

        //Pre-requisites
        let recieverAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"; //INPUT (Frontend) [NOTE: This is just an example address input]
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let sellPrice = "0.01"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS
        let initialTokenSupply = 5000; //IGNORE THIS


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();
        await nft.createToken(uriLink);
        await market.createMarketItem(nft.address, nft.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await market.getListingPrice()});

        //FUNCTIONS:
        //Function - Fetch wallet address URI
        const gotWalletTokens = await market.fetchOwnedTokens(recieverAddress);
    
    });

    it("Fetch wallet address URI", async function(){

        //Pre-requisites
        let checkAddressTokens = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; //INPUT (Frontend) [NOTE: This is just an example address input]
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let sellPrice = "0.01"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS
        let initialTokenSupply = 5000; //IGNORE THIS
    
    
        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplaceMAH");
        let market = await NFTMarketplaceContract.deploy();
        await market.deployed();
        let NFTContract = await ethers.getContractFactory("NFT");
        let nft = await NFTContract.deploy(market.address, initialTokenSupply, tokenName, tokenSymbol);
        await nft.deployed();
        await nft.createToken(uriLink);
        await market.createMarketItem(nft.address, nft.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await market.getListingPrice()});
        

        //FUNCTIONS:
        //Function - Fetch wallet address URI
        const gotWalletURI = await market.fetchWalletAddressURIs(checkAddressTokens);

    });

});