// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import './Mason.sol';

/**
 * @dev Implementation of a deployer that will deploy 'masons' contracts to be operated by a Strategy
 * The masons can only be operated by the Strategy, they handle all Masonry interactions.
 */
contract MasonDeployer {
    address[] masons;

    /**
     * @dev Deploys multiple masons
     */
    function deployMasons(uint256 _total) external returns (address[] memory) {
        delete masons;
        address mason;
        for (uint256 i; i < _total; i++) {
            mason = address(deployMason());
            masons.push(mason);
        }
        return masons;
    }

    /**
     * @dev Deploys a single mason and assigns it the Strategy as the only authorized party
     */
    function deployMason() public returns (address) {
        address mason = address(new Mason(msg.sender));
        return mason;
    }
}
