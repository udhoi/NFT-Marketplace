const { ethers } = require("hardhat");

async function main(){

    let maxTokenSupply = 100000;
    let tokenName = "MAH Token";
    let tokenSymbol = "MAH";
    let uriLink = "mohdarafathossain.com"
    const[owner, addr1,...addrs] = await ethers.getSigners();
    let sellPrice1 = "0.001";
    //console.log(addr1.address);

  //Deploying NFTMarketplace
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarket = await NFTMarket.deploy(tokenName, tokenSymbol, maxTokenSupply);
  await nftMarket.deployed();
  console.log("NFTMarketplace contract deployed to: ", nftMarket.address);
  await nftMarket.marketSetup(nftMarket.address);
  console.log("Set Address Completed");
  //await nftMarket.mintNFT(uriLink, {gasLimit:20000000});
  await nftMarket.mintNFT(uriLink, {gasLimit:320000});
  console.log("Minted Successfully");
  /*
  // await nftMarket.connect(addr1).bidWalletIN({value: ethers.utils.parseUnits(sellPrice1,"ether"), gasLimit:20000000});
  await nftMarket.connect(addr1).bidWalletIN({value: ethers.utils.parseUnits(sellPrice1,"ether"), gasLimit:320000});
  console.log("Bid Wallet IN Completed");
  // await nftMarket.bidWalletOUT(addr1.address,ethers.utils.parseUnits(sellPrice1,"ether"), {value: ethers.utils.parseUnits(sellPrice1,"ether"), gasLimit:20000000});
  await nftMarket.bidWalletOUT(addr1.address,ethers.utils.parseUnits(sellPrice1,"ether"), {value: ethers.utils.parseUnits(sellPrice1,"ether"), gasLimit:320000});
  console.log("Bid Wallet OUT Completed");
  */
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
})