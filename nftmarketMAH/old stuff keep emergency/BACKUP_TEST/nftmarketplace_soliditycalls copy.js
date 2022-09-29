//const { inputToConfig } = require("@ethereum-waffle/compiler");
const {ethers} = require("hardhat");
const {utils, BigNumber} = require('ethers');

describe("NFT Marketplace (Function Calls)", function(){

    //COMPLETED
    it("Deploy Solidity Smart Contracts", async function(){

        //Pre-requisites
        let tokenName = "Test Token Name"; //INPUT (Frontend)
        let tokenSymbol = "TKNSYMBL"; //INPUT (Frontend)
        let maxTokenSupply = "500"; //INPUT (Frontend)
        let listingFee = "0.0005"; //INPUT (Frontend)
        let transferFee = "0.0001"; //INPUT (Frontend)
        let sellMarketOwnerFee = 2.5 //INPUT (Frontend) (Percentage)
        
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
            ethers.utils.parseUnits(listingFee,"ether"), 
            ethers.utils.parseUnits(transferFee,"ether"), 
            sellMarketOwnerFee*100
        );
        await nftmarket.deployed();
        await nftmarket.setSmartContractAddress(nftmarket.address);

    });

    //COMPLETED
    it("Set/Get - Max token supply", async function(){

        //Pre-requisites
        let newMaxTokenSupply = "5000" //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let listingFee = "0.0005"; //IGNORE THIS (already have data)
        let transferFee = "0.0001"; //IGNORE THIS (already have data)
        let sellMarketOwnerFee = 2.5 //IGNORE THIS (already have data)
        
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
            ethers.utils.parseUnits(listingFee,"ether"), 
            ethers.utils.parseUnits(transferFee,"ether"), 
            sellMarketOwnerFee*100
        );
        await nftmarket.deployed();
        await nftmarket.setSmartContractAddress(nftmarket.address);


        //FUNCTIONS:
        //Function - Set max token supply
        await nftmarket.setMaxTokenSupply(BigNumber.from(newMaxTokenSupply));
        //Function - Get max token supply
        maxToken = await nftmarket.getMaxTokenSupply();

    });

    //COMPLETED
    it("Set/Get - Listing Fee", async function(){

        //Pre-requisites
        let newListingFee = "0.0002"; //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let listingFee = "0.0005"; //IGNORE THIS (already have data)
        let transferFee = "0.0001"; //IGNORE THIS (already have data)
        let sellMarketOwnerFee = 2.5 //IGNORE THIS (already have data)
        
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
            ethers.utils.parseUnits(listingFee,"ether"), 
            ethers.utils.parseUnits(transferFee,"ether"), 
            sellMarketOwnerFee*100
        );
        await nftmarket.deployed();
        await nftmarket.setSmartContractAddress(nftmarket.address);
        

        //FUNCTIONS:
        //Function - Set listing price
        await nftmarket.setListingFee(ethers.utils.parseUnits(newListingFee,"ether"));
        //Function - Get listing price
        let listingPrice = await nftmarket.getListingFee();

    });

    //COMPLETED
    it("Set/Get - Market Owner Fee", async function(){

        //Pre-requisites
        let newMarketOwnerFee = 2; //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let listingFee = "0.0005"; //IGNORE THIS (already have data)
        let transferFee = "0.0001"; //IGNORE THIS (already have data)
        let sellMarketOwnerFee = 2.5 //IGNORE THIS (already have data)
        
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
            ethers.utils.parseUnits(listingFee,"ether"), 
            ethers.utils.parseUnits(transferFee,"ether"), 
            sellMarketOwnerFee*100
        );
        await nftmarket.deployed();
        await nftmarket.setSmartContractAddress(nftmarket.address);
        

        //FUNCTIONS:
        //Function - Set listing price
        await nftmarket.setMarketOwnerFee(newMarketOwnerFee*100);
        //Function - Get listing price
        let marketOwnerFee = await nftmarket.getMarketOwnerFee();
        //console.log(marketOwnerFee/100);

    });

    //COMPLETED
    it("Set/Get - Transfer Fee", async function(){

        //Pre-requisites
        let newTransferFee = "0.0009"; //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let listingFee = "0.0005"; //IGNORE THIS (already have data)
        let transferFee = "0.0001"; //IGNORE THIS (already have data)
        let sellMarketOwnerFee = 2.5 //IGNORE THIS (already have data)
        
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
            ethers.utils.parseUnits(listingFee,"ether"), 
            ethers.utils.parseUnits(transferFee,"ether"), 
            sellMarketOwnerFee*100
        );
        await nftmarket.deployed();
        await nftmarket.setSmartContractAddress(nftmarket.address);
        

        //FUNCTIONS:
        //Function - Set listing price
        await nftmarket.setTransferFee(ethers.utils.parseUnits(newTransferFee,"ether"));
        //Function - Get listing price
        let gotTransferFee = await nftmarket.getTransferFee();

    });

    it("Mint NFT / List NFT", async function(){

        //Pre-requisites
        let uriLink = "http://uriLink.com"; //INPUT (Frontend)
        let sellPrice = "0.09"; //INPUT (Frontend)
        //let creatorCommision = 8.5 //INPUT (Frontend) (Percentage) [REQUIREMENT: 2 Decimal places]
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let listingFee = "0.0005"; //IGNORE THIS (already have data)
        let transferFee = "0.0001"; //IGNORE THIS (already have data)
        let sellMarketOwnerFee = 2.5 //IGNORE THIS (already have data)


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
            ethers.utils.parseUnits(listingFee,"ether"), 
            ethers.utils.parseUnits(transferFee,"ether"), 
            sellMarketOwnerFee*100
        );
        await nftmarket.deployed();
        await nftmarket.setSmartContractAddress(nftmarket.address);
        
        //FEATURE:
        //Create market item
        await nftmarket.createToken(uriLink);
        await nftmarket.createMarketItem(nftmarket.address, await nftmarket.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await nftmarket.getListingFee()});
        const getNewTokenID = await nftmarket.getNewTokenID();
        
    });

    it("Sell Market Items", async function(){

        //Pre-requisites
        let itemId = 1; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let listingFee = "0.0005"; //IGNORE THIS (already have data)
        let transferFee = "0.0001"; //IGNORE THIS (already have data)
        let sellMarketOwnerFee = 2.5 //IGNORE THIS (already have data)
        let sellPrice = "0.05"; //IGNORE THIS

        let sellerGets = ethers.utils.parseUnits((((98/100)*(parseFloat(sellPrice))).toString()),"ether"); //CALCULATE: Seller gets 98%
        let marketOwnerGets = ethers.utils.parseUnits((((2/100)*(parseFloat(sellPrice))).toString()),"ether"); //CALCULATE: Seller gets 2%


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
            ethers.utils.parseUnits(listingFee,"ether"), 
            ethers.utils.parseUnits(transferFee,"ether"), 
            sellMarketOwnerFee*100
        );
        await nftmarket.deployed();
        await nftmarket.setSmartContractAddress(nftmarket.address);
        await nftmarket.createToken(uriLink);
        await nftmarket.createMarketItem(nftmarket.address, nftmarket.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await nftmarket.getListingFee()});
        

        /*
        let sellerGets = 8.5;
        let storedSellerGets = sellerGets*100;
        console.log((sellerGets/100)*(parseFloat(sellPrice)));
        console.log(parseFloat(sellPrice)*(storedSellerGets/10000));
        */

        //FUNCTIONS:
        //Function - Sell market items

        await nftmarket.buyMarketItem(
            nftmarket.address, 
            itemId, 
            ethers.utils.parseUnits((((98/100)*(parseFloat(sellPrice))).toString()),"ether"), 
            ethers.utils.parseUnits((((2/100)*(parseFloat(sellPrice))).toString()),"ether"), 
            {value: ethers.utils.parseUnits(sellPrice,"ether")}
        );

    });

    it("Transfer Market Items", async function(){

        //Pre-requisites
        let recieverAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"; //INPUT (Frontend) [NOTE: This is just an example address input]
        let transferItemId = 1; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let sellPrice = "0.01"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let listingFee = "0.0005"; //IGNORE THIS (already have data)
        let transferFee = "0.0001"; //IGNORE THIS (already have data)
        let sellMarketOwnerFee = 2.5 //IGNORE THIS (already have data)


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
            ethers.utils.parseUnits(listingFee,"ether"), 
            ethers.utils.parseUnits(transferFee,"ether"), 
            sellMarketOwnerFee*100
        );
        await nftmarket.deployed();
        await nftmarket.setSmartContractAddress(nftmarket.address);
        await nftmarket.createToken(uriLink);
        await nftmarket.createMarketItem(nftmarket.address, nftmarket.getNewTokenID(), ethers.utils.parseUnits(sellPrice,"ether"), uriLink, {value: await nftmarket.getListingFee()});

        //FUNCTIONS:
        //Function - Transfer market items
        await nftmarket.transferMarketItem(nftmarket.address, recieverAddress, transferItemId, {value: nftmarket.getTransferFee()});
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

});