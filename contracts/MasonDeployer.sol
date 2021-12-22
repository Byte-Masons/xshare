// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Mason.sol";

contract MasonDeployer {
    address[] masons;

    function deployMasons(uint256 _total) external returns(address[] memory){
        delete masons;
        address mason;
        for (uint256 i; i < _total; i++) {
            mason = address(deployMason());
            masons.push(mason);
        }
        return masons;
    }

    function deployMason() public returns(address){
        address mason = address(new Mason(msg.sender));
        return mason;
    }
}