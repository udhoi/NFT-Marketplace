//const { inputToConfig } = require("@ethereum-waffle/compiler");
const {ethers} = require("hardhat");
const {utils, BigNumber} = require('ethers');

describe("NFT Marketplace (Function Calls)", function(){

    //COMPLETED
    it("Deploy Solidity Smart Contracts", async function(){

        //Pre-requisites
        let tokenName = "Test Token Name"; //INPUT (Frontend)
        let tokenSymbol = "TKNSYMBL"; //INPUT (Frontend)
        let maxTokenSupply = 500; //INPUT (Frontend)
        
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            BigNumber.from(maxTokenSupply)
        );

        await nftmarket.deployed();
        //IMPORTANT DO THIS IMMEDIATLY AFTER DEPLOY!!!!!!!!!!!!!!!!
        await nftmarket.marketSetup(nftmarket.address);

    });

    //COMPLETED
    it("Set/Get - Max token supply", async function(){

        //Pre-requisites
        let newMaxTokenSupply = 5000 //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = 500; //IGNORE THIS (already have data)
        
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            BigNumber.from(maxTokenSupply)
        );
        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);


        //FUNCTIONS:
        //Function - Set max token supply
        await nftmarket.addTokens(BigNumber.from(newMaxTokenSupply));
        //Function - Get max token supply
        maxToken = await nftmarket.getMaxTokenSupply();

    });

    it("Mint NFT / List NFT", async function(){

        //Pre-requisites
        let uriLink = "http://uriLink.com"; //INPUT (Frontend)
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)


        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply, 
        );
        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        
        //FEATURE:
        //Create market item
        await nftmarket.mintNFT(uriLink);
        let getNewTokenID = await nftmarket.getNewTokenID();
        
    });

    it("Listing Market Item", async function(){

        //Pre-requisites
        let tokenId1 = 1; //INPUT (Frontend)
        let sellPrice1 = "0.05"; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)

        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply
        );
        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        await nftmarket.mintNFT(uriLink);

        //FUNCTIONS:
        //Function - List market item
        await nftmarket.listNFT(tokenId1, ethers.utils.parseUnits(sellPrice1,"ether"));
    });

    it("Unlisting Market Items", async function(){
        //Pre-requisites
        let tokenId1 = 1; //INPUT (Frontend)
        let sellPrice1 = "0.05"; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)

        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply
        );
        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        await nftmarket.mintNFT(uriLink);
        await nftmarket.listNFT(tokenId1, ethers.utils.parseUnits(sellPrice1,"ether"));

        //FUNCTIONS:
        //Function - Unlist market item
        await nftmarket.unlistNFT(tokenId1);

    });

    it("Sell Market Items", async function(){

        //Pre-requisites
        let tokenId1 = 1; //INPUT (Frontend)
        let sellPrice1 = "0.007"; //INPUT (Frontend)
        let sellerGetsPercentage = 97; //INPUT (Frontend)
        let marketOwnerGetsPercentage = 3; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        const[owner, addr1, addr2,...addrs] = await ethers.getSigners();

        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply
        );
        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        await nftmarket.mintNFT(uriLink);
        await nftmarket.listNFT(tokenId1, ethers.utils.parseUnits(sellPrice1,"ether"));
        
        //FUNCTIONS:
        //Function - Sell market items

        let sellerGets1 = ethers.utils.parseUnits((((sellerGetsPercentage*(parseFloat(sellPrice1))))/100).toFixed(16).toString(), "ether"); //CALCULATE: Seller gets 98%
        let marketOwnerGets1 = ethers.utils.parseUnits((((marketOwnerGetsPercentage*(parseFloat(sellPrice1))))/100).toFixed(16).toString(), "ether"); //CALCULATE: Seller gets 98%

        /*
        await nftmarket.sellNFT(
            tokenId1,
            ethers.utils.parseUnits(sellPrice1,"ether"),
            sellerGets1, 
            marketOwnerGets1, 
            {value: ethers.utils.parseUnits(sellPrice1,"ether")}
        );
        */

        await nftmarket.connect(addr1).sellNFT(
            tokenId1,
            ethers.utils.parseUnits(sellPrice1,"ether"),
            sellerGets1, 
            marketOwnerGets1, 
            {value: ethers.utils.parseUnits(sellPrice1,"ether")}
        );

    });

    it("Transfer Market Items", async function(){

        //Pre-requisites
        let recieverAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"; //INPUT (Frontend) [NOTE: This is just an example address input]
        let transferItemId = 1; //INPUT (Frontend)
        let transferFee = "0.0001"; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)



        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply
        );
        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        await nftmarket.mintNFT(uriLink);

        //FUNCTIONS:
        //Function - Transfer market items
        await nftmarket.transferNFT(recieverAddress, transferItemId, ethers.utils.parseUnits(transferFee,"ether"), {value: ethers.utils.parseUnits(transferFee,"ether")});
        
    });

    it("Fetch URI of TokenID", async function(){
        
        let tokenID = 1; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)

        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply
        );
        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        await nftmarket.mintNFT(uriLink);

        
        //FUNCTIONS:
        //Function - Get URI of Token ID
        let gotURI = await nftmarket.fetchTokenIDURI(tokenID);
    });

    it("Adding funds to Bidding wallet", async function(){

        let tokenID = 1; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let sellPrice1 = "0.001";
        let lessMoneyWallet = "0.0001";
        const[owner, addr1, addr2,...addrs] = await ethers.getSigners();

        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply
        );

        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        await nftmarket.mintNFT(uriLink);
        await nftmarket.listNFT(tokenID, ethers.utils.parseUnits(sellPrice1,"ether"));
        
        nftmarket.connect(addr1).bidWalletIN(addr1.address, {value: ethers.utils.parseUnits(sellPrice1,"ether")});
    });


    it("Bid pass check", async function(){

        let tokenID = 1; //INPUT (Frontend)
        let uriLink = "http://uriLink.com"; //IGNORE THIS
        let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
        let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
        let maxTokenSupply = "500"; //IGNORE THIS (already have data)
        let sellPrice1 = "0.001";
        let lessMoneyWallet = "0.0001";
        const[owner, addr1, addr2,...addrs] = await ethers.getSigners();

        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply
        );

        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        await nftmarket.mintNFT(uriLink);
        await nftmarket.listNFT(tokenID, ethers.utils.parseUnits(sellPrice1,"ether"));
        
        nftmarket.connect(addr1).bidWalletIN(addr1.address, {value: ethers.utils.parseUnits(sellPrice1,"ether")});
        let passOrFail = await nftmarket.connect(addr1).bidPassCheck( addr1.address, ethers.utils.parseUnits(sellPrice1,"ether"), tokenID);
    });


});