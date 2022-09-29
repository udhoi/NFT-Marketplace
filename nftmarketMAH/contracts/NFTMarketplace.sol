// SPDX-License-Identifier: MIT

import "./NFTMarketplaceLibrary.sol";

pragma solidity ^0.8.0;
contract NFTMarketplace is ReentrancyGuard, ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter public _bidIds;
    address _scAddress;
    string public _tokenName;
    string public _tokenSymbol;
    IERC20 public _customToken;
    uint256 private _maxTokenSupply;
    address payable marketOwner;
    address public _customTokenAddress;
    mapping (uint256 => string) _tokenIDURI;
    uint256 totalUserMPWalletFunds;
    mapping(address => uint256) private mpWallets;
    bool public _useCustomToken;
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
        require(gotMaxTokenSupply > 0, "ERR:1");
        _maxTokenSupply = gotMaxTokenSupply;
        _tokenName = tokenName;
        _tokenSymbol = tokenSymbol;
        _useCustomToken = false;
    }
    function marketSetup(address scAddress) public onlyOwner{
        _scAddress = scAddress;
    }
    function totalSupply() public view returns (uint256){
        return (_maxTokenSupply);
    }
    function getNewTokenID() public view returns (uint256){
        return _tokenIds.current();
    }
    function addTokens(uint256 gotNewMaxTokenSupply) public onlyOwner{
        require(msg.sender == marketOwner, "ERR:2");
        require(gotNewMaxTokenSupply > _maxTokenSupply, "ERR:3");
        _maxTokenSupply = gotNewMaxTokenSupply;
    }
    function customToken(address gotAddress) public onlyOwner{
        require(msg.sender == marketOwner, "ERR:2");
        _useCustomToken = true;
        _customTokenAddress = gotAddress;
        _customToken = IERC20(gotAddress);
    }
    function usingCustomToken() public view returns(bool){
        return _useCustomToken;
    }
    function fetchTokenIDURI(uint256 tokenID) public view returns (string memory){
        bytes memory tempTokenURI = bytes(_tokenIDURI[tokenID]);
        require(tempTokenURI.length > 0, "ERR:4");
        return _tokenIDURI[tokenID];
    }
    function mintNFT(string memory uri) public payable nonReentrant{
        require(_tokenIds.current() != _maxTokenSupply, "ERR:5");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);
        _tokenIDURI[newTokenId] = uri;
        MarketItemDatabase[newTokenId] = MarketItem(newTokenId, _scAddress, uri, payable(msg.sender), payable(address(0)), 0, false);
        emit MarketItemCreated(newTokenId, _scAddress, uri, msg.sender, address(0), 0, false);
    }
    function listNFT(uint256 tokenId, uint256 price, uint256 listFee, address tokenAddress) public payable nonReentrant{
        require((msg.sender == MarketItemDatabase[tokenId].nftCreator && MarketItemDatabase[tokenId].nftOwner == address(0)) || msg.sender == MarketItemDatabase[tokenId].nftOwner, "ERR:6");
        setApprovalForAll(_scAddress, true);
        MarketItemDatabase[tokenId].forSale = true;
        MarketItemDatabase[tokenId].price = price;
        IERC721(_scAddress).transferFrom(msg.sender, address(this), tokenId);
        if(tokenAddress==address(0)){
            payable(marketOwner).transfer(listFee);
        }else{
            IERC20(_customTokenAddress).transferFrom(msg.sender,marketOwner, listFee);
        }
    }
    function unlistNFT(uint256 tokenId) public {
        require((msg.sender == MarketItemDatabase[tokenId].nftCreator && MarketItemDatabase[tokenId].nftOwner == address(0)) || msg.sender == MarketItemDatabase[tokenId].nftOwner || msg.sender == marketOwner, "ERR:7");
        require(MarketItemDatabase[tokenId].forSale == true, "ERR:8");
        setApprovalForAll(_scAddress, true);
        MarketItemDatabase[tokenId].forSale = false;
        MarketItemDatabase[tokenId].price = 0;
        if(MarketItemDatabase[tokenId].nftOwner == address(0)){
            IERC721(_scAddress).transferFrom(address(this), MarketItemDatabase[tokenId].nftCreator, tokenId);
        } else{
            IERC721(_scAddress).transferFrom(address(this), MarketItemDatabase[tokenId].nftOwner, tokenId);
        }
    }
    function sellNFT(uint256 tokenId, uint256 sellerGets, uint256 marketOwnerGets, address tokenAddress) public payable nonReentrant{
        require(msg.sender != marketOwner, "ERR:9");
        require(MarketItemDatabase[tokenId].forSale == true, "ERR:10");
        if(MarketItemDatabase[tokenId].nftOwner == address(0)){
            if(tokenAddress==address(0)){
                require(MarketItemDatabase[tokenId].price == msg.value, "ERR:11");
                MarketItemDatabase[tokenId].nftCreator.transfer(sellerGets);
            } else {
                IERC20(_customTokenAddress).transferFrom(msg.sender,MarketItemDatabase[tokenId].nftCreator, sellerGets);
            }
        } else{
            if(tokenAddress==address(0)){
                require(MarketItemDatabase[tokenId].price == msg.value, "ERR:11");
                MarketItemDatabase[tokenId].nftOwner.transfer(sellerGets);
            } else {
                IERC20(_customTokenAddress).transferFrom(msg.sender,MarketItemDatabase[tokenId].nftOwner, sellerGets);
            }
        }
        IERC721(_scAddress).transferFrom(address(this), msg.sender, tokenId);
        MarketItemDatabase[tokenId].nftOwner = payable(msg.sender);
        MarketItemDatabase[tokenId].forSale = false;
        MarketItemDatabase[tokenId].price = 0;
        if(tokenAddress == address(0)){
            payable(marketOwner).transfer(marketOwnerGets);
        } else {
            IERC20(_customTokenAddress).transferFrom(msg.sender,marketOwner, marketOwnerGets);
        }
    }
    function transferNFT(address recieverAddress, uint256 tokenId, uint256 gotTransferFee, address tokenAddress) public payable nonReentrant{
        require((msg.sender == MarketItemDatabase[tokenId].nftCreator && MarketItemDatabase[tokenId].nftOwner == address(0)) || msg.sender == MarketItemDatabase[tokenId].nftOwner, "ERR:12");
        require(MarketItemDatabase[tokenId].forSale == false, "ERR:13");
        setApprovalForAll(_scAddress, true);
        MarketItemDatabase[tokenId].nftOwner = payable(recieverAddress);
        if(tokenAddress==address(0)){
                payable(marketOwner).transfer(gotTransferFee);
            } else {
                IERC20(_customTokenAddress).transferFrom(msg.sender,marketOwner, gotTransferFee);
            }
        IERC721(_scAddress).transferFrom(msg.sender, recieverAddress, tokenId);
    }
    function bidWalletIN(address tokenAddress) public payable nonReentrant returns(bool){
        require(msg.sender != marketOwner, "ERR:15");
        if(tokenAddress==address(0)){
                payable(marketOwner).transfer(msg.value);
        } else {
                IERC20(_customTokenAddress).transferFrom(msg.sender,marketOwner, msg.value);
        }
        mpWallets[msg.sender] = mpWallets[msg.sender] + msg.value;
        totalUserMPWalletFunds = totalUserMPWalletFunds + msg.value;
        return true;
    }
    function bidWalletOUT(address sendTo, uint256 withdrawAmount, address tokenAddress) public payable nonReentrant onlyOwner{
        require(msg.value == withdrawAmount, "ERR:18");
        require(mpWallets[sendTo] >= withdrawAmount, "ERR:19");
        mpWallets[sendTo] = mpWallets[sendTo] - withdrawAmount;
        totalUserMPWalletFunds = totalUserMPWalletFunds - withdrawAmount;
        if(tokenAddress==address(0)){
                payable(sendTo).transfer(withdrawAmount);
        } else {
            IERC20(_customTokenAddress).transferFrom(msg.sender,sendTo, withdrawAmount);
        }
    }
    function bidPassCheck(address userWallet, uint256 currBid, uint256 tokenID) public view returns(bool){
        require(mpWallets[userWallet] > 0, "ERR:20");
        require((userWallet == MarketItemDatabase[tokenID].nftCreator && MarketItemDatabase[tokenID].nftOwner != address(0)) || userWallet != MarketItemDatabase[tokenID].nftOwner, "ERR:21");
        if(mpWallets[userWallet] >= currBid){
            return true;
        } else{
            return false;
        }
    }
    function soldBidNFT(address winner, uint256 bidAmount, uint256 nftOwnerGets, uint256 ownerGets, uint256 tokenId, address tokenAddress) public payable nonReentrant{
        require(MarketItemDatabase[tokenId].forSale == true, "ERR:22");
        require(msg.value == bidAmount, "ERR:23");
        setApprovalForAll(_scAddress, true);
        if(MarketItemDatabase[tokenId].nftOwner == address(0)){
            if(tokenAddress==address(0)){
                payable(MarketItemDatabase[tokenId].nftCreator).transfer(nftOwnerGets);
            } else{
                IERC20(_customTokenAddress).transferFrom(msg.sender,MarketItemDatabase[tokenId].nftCreator, nftOwnerGets);
            }
            
        }
        else {
            if(tokenAddress==address(0)){
                payable(MarketItemDatabase[tokenId].nftOwner).transfer(nftOwnerGets);
            } else{
                IERC20(_customTokenAddress).transferFrom(msg.sender,MarketItemDatabase[tokenId].nftOwner, nftOwnerGets);
            }
            
        }
        IERC721(_scAddress).transferFrom(address(this), winner, tokenId);

        if(tokenAddress==address(0)){
            payable(marketOwner).transfer(ownerGets);
        } else {
            IERC20(_customTokenAddress).transferFrom(msg.sender,marketOwner, ownerGets);
        }
        
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
