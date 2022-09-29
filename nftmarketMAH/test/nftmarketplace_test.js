//const { inputToConfig } = require("@ethereum-waffle/compiler");
const {ethers} = require("hardhat");
const {utils, BigNumber} = require('ethers');

describe("NFT Marketplace (Function Calls)", function(){

    it("Can Transfter Tokens", async function(){

        const [owner, addr1, addr2] = await ethers.getSigners();
        let MAHTokenContract = await ethers.getContractFactory("MAHToken");
        let mahToken = await MAHTokenContract.deploy();
        await mahToken.deployed();
        //await hardhatToken.connect(addr1).transfer(addr2.address, 50);
        let mahTokenAddress = mahToken.address;
        let ownerAddress = owner.address;
        let transferAmount = "1";

        let sameContract = 

        await mahToken.connect(owner).transfer(ownerAddress, ethers.utils.parseUnits(transferAmount,"ether"));
        //console.log(await mahToken.connect(owner).balanceOf(ownerAddress));
    });

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
        maxToken = await nftmarket.totalSupply();

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
        let zeroAddress = "0x0000000000000000000000000000000000000000";

        const [owner, addr1, addr2] = await ethers.getSigners();

        // let MAHTokenContract = await ethers.getContractFactory("MAHToken");
        // let mahToken = await MAHTokenContract.deploy();
        // await mahToken.deployed();
        // let mahTokenAddress = mahToken.address;
        // await mahToken.setSmartContractAddress(mahTokenAddress);
        let deployInitialSupply = "1000000000";
        let MAHTokenContract = await ethers.getContractFactory("PRAYToken");
        let mahToken = await MAHTokenContract.deploy(ethers.utils.parseUnits(deployInitialSupply,"ether"));
        await mahToken.deployed();
        //var newWayTokenContractAddress = new ethers.Contract(mahToken.address, abi, wallet);
        let mahTokenAddress = mahToken.address;
        //let mahTokenAddress = "0x3f4203223440348344d730fbba18797f55dca628"

        let ownerAddress = owner.address;
        let userAddress = addr1.address;
        let transferAmountOwner = "5";
        let transferAmountUser = "4";
        let listFee = "1";
        console.log("VAR Owner Amount in ethers: " + ethers.utils.parseUnits(transferAmountOwner,"ether"));
        console.log("VAR User Amount in ethers: " + ethers.utils.parseUnits(transferAmountUser,"ether"));
        console.log("VAR listFee in ethers: " + ethers.utils.parseUnits(listFee,"ether"));

        //=======================================================================================

        console.log("Before -------");
        console.log("Balance of Owner: " + await mahToken.connect(owner).balanceOf(ownerAddress));
        console.log("Balance of User: " + await mahToken.connect(addr1).balanceOf(userAddress));

        await mahToken.transfer(ownerAddress, ethers.utils.parseUnits(transferAmountOwner,"ether"));
        await mahToken.transfer(userAddress, ethers.utils.parseUnits(transferAmountUser,"ether"));

        console.log("After -------");
        console.log("Balance of Owner: " + await mahToken.connect(owner).balanceOf(ownerAddress));
        console.log("Balance of User: " + await mahToken.connect(addr1).balanceOf(userAddress));

        //======================================================================================

        //IGNORE THIS
        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            maxTokenSupply
        );
        await nftmarket.deployed();
        await nftmarket.marketSetup(nftmarket.address);
        await nftmarket.connect(addr1).mintNFT(uriLink);

        //FUNCTIONS:
        //Function - List market item

        await nftmarket.customToken(mahTokenAddress);
        
        if(await nftmarket.usingCustomToken()){
            console.log("Using custom token:");
            await mahToken.connect(addr1).approve(nftmarket.address, ethers.utils.parseUnits(listFee,"ether"));
            const allowance = await mahToken.allowance(addr1.address, nftmarket.address);
            console.log(allowance.toString());
            await nftmarket.connect(addr1).listNFT(tokenId1,ethers.utils.parseUnits(sellPrice1,"ether"), ethers.utils.parseUnits(listFee,"ether"), mahTokenAddress);
        } else{
            console.log("Not using custom token");
            await nftmarket.connect(addr1).listNFT(tokenId1, ethers.utils.parseUnits(sellPrice1,"ether"), ethers.utils.parseUnits(listFee,"ether"), zeroAddress,{value: ethers.utils.parseUnits(listFee,"ether")});
        }
    });

    // it("Unlisting Market Items", async function(){
    //     const [owner, addr1, addr2] = await ethers.getSigners();
    //     //Pre-requisites
    //     let tokenId1 = 1; //INPUT (Frontend)
    //     let sellPrice1 = "0.05"; //INPUT (Frontend)
    //     let uriLink = "http://uriLink.com"; //IGNORE THIS
    //     let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
    //     let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
    //     let maxTokenSupply = "500"; //IGNORE THIS (already have data)
    //     let listFee = "1";
    //     let zeroAddress = "0x0000000000000000000000000000000000000000";
    //     let ownerAddress = owner.address;
    //     let userAddress = addr1.address;
    //     let transferAmountOwner = "5";
    //     let transferAmountUser = "4";

    //     let MAHTokenContract = await ethers.getContractFactory("MAHToken");
    //     let mahToken = await MAHTokenContract.deploy();
    //     await mahToken.deployed();
    //     //await mahToken.connect(addr1).transfer(addr2.address, 50);
    //     let mahTokenAddress = mahToken.address;
    //     await mahToken.setSmartContractAddress(mahTokenAddress);

    //     await mahToken.transfer(ownerAddress, ethers.utils.parseUnits(transferAmountOwner,"ether"));
    //     await mahToken.transfer(userAddress, ethers.utils.parseUnits(transferAmountUser,"ether"));

    //     //IGNORE THIS
    //     let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
    //     let nftmarket = await NFTMarketplaceContract.deploy(
    //         tokenName, 
    //         tokenSymbol, 
    //         maxTokenSupply
    //     );
    //     await nftmarket.deployed();
    //     await nftmarket.marketSetup(nftmarket.address);
    //     await nftmarket.customToken(mahTokenAddress);
    //     await nftmarket.connect(addr1).mintNFT(uriLink);
    //     if(await nftmarket.usingCustomToken()){
    //         console.log("Using custom token:");
    //         await mahToken.connect(addr1).approve(nftmarket.address, ethers.utils.parseUnits(listFee,"ether"));
    //         const allowance = await mahToken.allowance(addr1.address, nftmarket.address);
    //         console.log(allowance.toString());
    //         await nftmarket.connect(addr1).listNFT(tokenId1,ethers.utils.parseUnits(sellPrice1,"ether"), ethers.utils.parseUnits(listFee,"ether"), mahTokenAddress,{value: ethers.utils.parseUnits(listFee,"ether")});
    //     } else{
    //         console.log("Not using custom token");
    //         await nftmarket.connect(addr1).listNFT(tokenId1, ethers.utils.parseUnits(sellPrice1,"ether"), ethers.utils.parseUnits(listFee,"ether"), zeroAddress,{value: ethers.utils.parseUnits(listFee,"ether")});
    //     }

    //     //FUNCTIONS:
    //     //Function - Unlist market item
    //     await nftmarket.connect(addr1).unlistNFT(tokenId1);

    // });

    // it("Sell Market Items", async function(){

    //     //Pre-requisites
    //     let tokenId1 = 1; //INPUT (Frontend)
    //     let sellPrice1 = "0.007"; //INPUT (Frontend)
    //     let sellerGetsPercentage = 97; //INPUT (Frontend)
    //     let marketOwnerGetsPercentage = 3; //INPUT (Frontend)
    //     let uriLink = "http://uriLink.com"; //IGNORE THIS
    //     let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
    //     let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
    //     let maxTokenSupply = "500"; //IGNORE THIS (already have data)
    //     const[owner, addr1, addr2,...addrs] = await ethers.getSigners();

    //     //IGNORE THIS
    //     let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
    //     let nftmarket = await NFTMarketplaceContract.deploy(
    //         tokenName, 
    //         tokenSymbol, 
    //         maxTokenSupply
    //     );
    //     await nftmarket.deployed();
    //     await nftmarket.marketSetup(nftmarket.address);
    //     await nftmarket.mintNFT(uriLink);
    //     await nftmarket.listNFT(tokenId1, ethers.utils.parseUnits(sellPrice1,"ether"));
        
    //     //FUNCTIONS:
    //     //Function - Sell market items

    //     let sellerGets1 = ethers.utils.parseUnits((((sellerGetsPercentage*(parseFloat(sellPrice1))))/100).toFixed(16).toString(), "ether"); //CALCULATE: Seller gets 98%
    //     let marketOwnerGets1 = ethers.utils.parseUnits((((marketOwnerGetsPercentage*(parseFloat(sellPrice1))))/100).toFixed(16).toString(), "ether"); //CALCULATE: Seller gets 98%

    //     /*
    //     await nftmarket.sellNFT(
    //         tokenId1,
    //         ethers.utils.parseUnits(sellPrice1,"ether"),
    //         sellerGets1, 
    //         marketOwnerGets1, 
    //         {value: ethers.utils.parseUnits(sellPrice1,"ether")}
    //     );
    //     */

    //     await nftmarket.connect(addr1).sellNFT(
    //         tokenId1,
    //         ethers.utils.parseUnits(sellPrice1,"ether"),
    //         sellerGets1, 
    //         marketOwnerGets1, 
    //         {value: ethers.utils.parseUnits(sellPrice1,"ether")}
    //     );

    // });

    // it("Transfer Market Items", async function(){

    //     //Pre-requisites
    //     let recieverAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"; //INPUT (Frontend) [NOTE: This is just an example address input]
    //     let transferItemId = 1; //INPUT (Frontend)
    //     let transferFee = "0.0001"; //INPUT (Frontend)
    //     let uriLink = "http://uriLink.com"; //IGNORE THIS
    //     let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
    //     let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
    //     let maxTokenSupply = "500"; //IGNORE THIS (already have data)



    //     //IGNORE THIS
    //     let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
    //     let nftmarket = await NFTMarketplaceContract.deploy(
    //         tokenName, 
    //         tokenSymbol, 
    //         maxTokenSupply
    //     );
    //     await nftmarket.deployed();
    //     await nftmarket.marketSetup(nftmarket.address);
    //     await nftmarket.mintNFT(uriLink);

    //     //FUNCTIONS:
    //     //Function - Transfer market items
    //     await nftmarket.transferNFT(recieverAddress, transferItemId, ethers.utils.parseUnits(transferFee,"ether"), {value: ethers.utils.parseUnits(transferFee,"ether")});
        
    // });

    // it("Fetch URI of TokenID", async function(){
        
    //     let tokenID = 1; //INPUT (Frontend)
    //     let uriLink = "http://uriLink.com"; //IGNORE THIS
    //     let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
    //     let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
    //     let maxTokenSupply = "500"; //IGNORE THIS (already have data)

    //     //IGNORE THIS
    //     let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
    //     let nftmarket = await NFTMarketplaceContract.deploy(
    //         tokenName, 
    //         tokenSymbol, 
    //         maxTokenSupply
    //     );
    //     await nftmarket.deployed();
    //     await nftmarket.marketSetup(nftmarket.address);
    //     await nftmarket.mintNFT(uriLink);

        
    //     //FUNCTIONS:
    //     //Function - Get URI of Token ID
    //     let gotURI = await nftmarket.fetchTokenIDURI(tokenID);
    // });

    // it("Adding funds to Bidding wallet", async function(){

    //     let tokenID = 1; //INPUT (Frontend)
    //     let uriLink = "http://uriLink.com"; //IGNORE THIS
    //     let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
    //     let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
    //     let maxTokenSupply = "500"; //IGNORE THIS (already have data)
    //     let sellPrice1 = "0.001";
    //     let lessMoneyWallet = "0.0001";
    //     const[owner, addr1, addr2,...addrs] = await ethers.getSigners();

    //     let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
    //     let nftmarket = await NFTMarketplaceContract.deploy(
    //         tokenName, 
    //         tokenSymbol, 
    //         maxTokenSupply
    //     );

    //     await nftmarket.deployed();
    //     await nftmarket.marketSetup(nftmarket.address);
    //     await nftmarket.mintNFT(uriLink);
    //     await nftmarket.listNFT(tokenID, ethers.utils.parseUnits(sellPrice1,"ether"));
        
    //     nftmarket.connect(addr1).bidWalletIN(addr1.address, {value: ethers.utils.parseUnits(sellPrice1,"ether")});
    // });

    // it("Bid pass check", async function(){

    //     let tokenID = 1; //INPUT (Frontend)
    //     let uriLink = "http://uriLink.com"; //IGNORE THIS
    //     let tokenName = "Test Token Name"; //IGNORE THIS (already have data)
    //     let tokenSymbol = "TKNSYMBL"; //IGNORE THIS (already have data)
    //     let maxTokenSupply = "500"; //IGNORE THIS (already have data)
    //     let sellPrice1 = "6";
    //     let ownerGets = "1";
    //     let nftOwnerGets = "5";
    //     let lessMoneyWallet = "0.0001";
    //     const[owner, addr1, addr2,...addrs] = await ethers.getSigners();

    //     let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
    //     let nftmarket = await NFTMarketplaceContract.deploy(
    //         tokenName, 
    //         tokenSymbol, 
    //         maxTokenSupply
    //     );

    //     await nftmarket.deployed();
    //     await nftmarket.marketSetup(nftmarket.address);
    //     await nftmarket.connect(addr1).mintNFT(uriLink);
    //     await nftmarket.connect(addr1).listNFT(tokenID, ethers.utils.parseUnits(sellPrice1,"ether"));

    //     //User enters money to bid wallet
    //     let gotBoolean = await nftmarket.connect(addr2).bidWalletIN({value: ethers.utils.parseUnits(sellPrice1,"ether")});
        
    //     //Check bid wallet
    //     gotBalance = await nftmarket.bidderWallet(addr2.address);
    //     console.log(gotBalance);

    //     //Check if passes bid check
    //     let passOrFail = await nftmarket.connect(addr2).bidPassCheck( addr2.address, ethers.utils.parseUnits(sellPrice1,"ether"), tokenID);
    //     if(passOrFail==false){
    //         await nftmarket.connect(addr2).bidWalletIn({value: ethers.utils.parseUnits(sellPrice1,"ether")});
    //     }
    //     await nftmarket.bidWalletOUT(addr2.address,ethers.utils.parseUnits(sellPrice1,"ether"), {value: ethers.utils.parseUnits(sellPrice1,"ether")});
    //     console.log(await nftmarket.bidderWallet(addr2.address));
    //     finalNFTBidPrice = ethers.utils.parseUnits(sellPrice1,"ether");

    //     //When bid time is over sell to winner
    //     //await nftmarket.soldBidNFT(addr2.address, finalNFTBidPrice, ethers.utils.parseUnits(nftOwnerGets,"ether"), ethers.utils.parseUnits(ownerGets,"ether"), tokenID, {value: ethers.utils.parseUnits(sellPrice1,"ether")});
    //     //console.log(addr2.address);

    // });

    it("Change Marketplace Coin", async function(){

        //Pre-requisites
        let tokenName = "Test Token Name"; //INPUT (Frontend)
        let tokenSymbol = "TKNSYMBL"; //INPUT (Frontend)
        let maxTokenSupply = 500; //INPUT (Frontend)

        let MAHTokenContract = await ethers.getContractFactory("MAHToken");
        let mahToken = await MAHTokenContract.deploy();
        await mahToken.deployed();
        let mahTokenAddress = mahToken.address;

        let NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
        let nftmarket = await NFTMarketplaceContract.deploy(
            tokenName, 
            tokenSymbol, 
            BigNumber.from(maxTokenSupply)
        );

        await nftmarket.deployed();
        //IMPORTANT DO THIS IMMEDIATLY AFTER DEPLOY!!!!!!!!!!!!!!!!
        await nftmarket.marketSetup(nftmarket.address);


        console.log(await nftmarket.usingCustomToken());
        await nftmarket.customToken(mahTokenAddress);
        console.log(await nftmarket.usingCustomToken());

    });


});