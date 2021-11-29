// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract XShare is ERC20("XSHARE", "XSHARE") {
    using SafeMath for uint256;
    IERC20 public tshare;

    // Define the tshare token contract
    constructor(IERC20 _tshare) public {
        tshare = _tshare;
    }

    // Locks tshare and mints xshare
    function enter(uint256 _amount) public {
        // Gets the amount of tshare locked in the contract
        uint256 totalTShare = tshare.balanceOf(address(this));
        // Gets the amount of xshare in existence
        uint256 totalXShare = totalSupply();
        // If no xshare exists, mint it 1:1 to the amount put in
        if (totalXShare == 0 || totalTShare == 0) {
            mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xshare the tshare is worth. The ratio will change overtime, as xshare is burned/minted and tshare deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalXShare).div(totalTShare);
            mint(msg.sender, what);
        }
        // Lock the tshare in the contract
        tshare.transferFrom(msg.sender, address(this), _amount);
    }

    // Unlocks the staked + gained tshare and burns xshare
    function leave(uint256 _xshare) public {
        // Gets the amount of xshare in existence
        uint256 totalXShare = totalSupply();
        // Calculates the amount of tshare the xshare is worth
        uint256 what = _xshare.mul(tshare.balanceOf(address(this))).div(totalXShare);
        burn(msg.sender, _xshare);
        tshare.transfer(msg.sender, what);
    }

    // returns the total amount of tshare an address has in the contract including fees earned
    function tshareBalance(address _account) external view returns (uint256 tshareAmount_) {
        uint256 xshareAmount = balanceOf(_account);
        uint256 totalxshare = totalSupply();
        tshareAmount_ = xshareAmount.mul(tshare.balanceOf(address(this))).div(totalxshare);
    }

    // returns how much tshare someone gets for redeeming xshare
    function xshareForTShare(uint256 _xshareAmount) external view returns (uint256 tshareAmount_) {
        uint256 totalxshare = totalSupply();
        tshareAmount_ = _xshareAmount.mul(tshare.balanceOf(address(this))).div(totalxshare);
    }

    // returns how much xshare someone gets for depositing tshare
    function tshareForxshare(uint256 _tshareAmount) external view returns (uint256 xshareAmount_) {
        uint256 totaltshare = tshare.balanceOf(address(this));
        uint256 totalxshare = totalSupply();
        if (totalxshare == 0 || totaltshare == 0) {
            xshareAmount_ = _tshareAmount;
        }
        else {
            xshareAmount_ = _tshareAmount.mul(totalxshare).div(totaltshare);
        }
    }

    function burn(address _from, uint256 _amount) private {
        _burn(_from, _amount);
    }

    function mint(address recipient, uint256 _amount) private {
        _mint(recipient, _amount);
    }
}