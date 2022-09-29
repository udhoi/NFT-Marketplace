// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address scAddress;
    uint256 public _maxTokenSupply;
    string public _tokenName;
    string public _tokenSymbol;

    constructor(address mpAddress, uint256 gotMaxTokenSupply, string memory tokenName, string memory tokenSymbol) ERC721(tokenName, tokenSymbol){
        scAddress = mpAddress;
        require(gotMaxTokenSupply > 0, "Max token supply needs to be greater than 0.");
        _maxTokenSupply = gotMaxTokenSupply;
        _tokenName = tokenName;
        _tokenSymbol = tokenSymbol;
    }

    function createToken(string memory tokenURI) public {
        require(_tokenIds.current() != _maxTokenSupply, "MAHTKN Token has reached it's max supply limit");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(scAddress, true);
    }

    function getNewCreatedTokenID() public view returns (uint256){
        return _tokenIds.current();
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

}