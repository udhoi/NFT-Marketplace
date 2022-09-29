// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTMarketplaceLibrary.sol";

contract MAHToken is ERC20{

    address public erc20Address;

    constructor() ERC20("MAH Token", "MAH") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

    function setSmartContractAddress(address gotAddress) public {
        erc20Address = gotAddress;
    }

}