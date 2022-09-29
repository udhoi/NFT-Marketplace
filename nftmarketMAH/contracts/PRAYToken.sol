/**
 *Submitted for verification at polygonscan.com on 2022-05-31
*/

// SPDX-License-Identifier: MIT


import "./NFTMarketplaceLibrary.sol";

pragma solidity ^0.8.0;



library SafeMath {


function add(uint256 a, uint256 b) internal pure returns (uint256) {


uint256 c = a + b;


require(c >= a, "SafeMath: addition overflow");


return c;


}


function sub(uint256 a, uint256 b) internal pure returns (uint256) {


return sub(a, b, "SafeMath: subtraction overflow");


}


function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {


require(b <= a, errorMessage);


uint256 c = a - b;


return c;


}


function mul(uint256 a, uint256 b) internal pure returns (uint256) {


if (a == 0) {


return 0;


}


uint256 c = a * b;


require(c / a == b, "SafeMath: multiplication overflow");


return c;


}


function div(uint256 a, uint256 b) internal pure returns (uint256) {


return div(a, b, "SafeMath: division by zero");


}


function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {


require(b > 0, errorMessage);


uint256 c = a / b;


// assert(a == b * c + a % b); // There is no case in which this doesn't hold


return c;


}


function mod(uint256 a, uint256 b) internal pure returns (uint256) {


return mod(a, b, "SafeMath: modulo by zero");


}


function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {


require(b != 0, errorMessage);


return a % b;


}


}



contract Pausable is Context {


event Paused(address account);


event Unpaused(address account);


bool private _paused;


function paused() public view returns (bool) {


return _paused;


}


modifier whenNotPaused() {


require(!_paused, "Pausable: paused");


_;


}


modifier whenPaused() {


require(_paused, "Pausable: not paused");


_;


}


function _pause() internal virtual whenNotPaused {


_paused = true;


emit Paused(_msgSender());


}


function _unpause() internal virtual whenPaused {


_paused = false;


emit Unpaused(_msgSender());


}


}



abstract contract ERC20Burnable is Context, ERC20 {


function burn(uint256 amount) public virtual {


_burn(_msgSender(), amount);


}

}



contract PRAYToken is ERC20,ERC20Burnable {


constructor(uint256 initialSupply) public ERC20("PRAY TOKEN", "PRAY"){


_mint(msg.sender, initialSupply);


}


}