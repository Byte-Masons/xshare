// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IMasonry {
    function stake(uint256 _amount) external;

    function withdraw(uint256 _amount) external;

    function claimReward() external;

    function exit() external; //Could end up being useful if the masonry is deactivated, or other unexpected reasons

    function balanceOf() external view returns (uint256);

    function canClaimReward(address user) external view returns (bool);

    function canWithdraw(address user) external view returns (bool);

    function earned(address user) external view returns (uint256);

    function epoch() external view returns (uint256);
}

/**
 * @dev A wrapper for the tomb Masonry contract that allows the strategy to have multiple
 * Masons, and therefore multiple separate timelocks in a rotation.
 */
contract Mason is IMasonry {
    address public masonry =
        address(0x2b2929E785374c651a81A63878Ab22742656DcDd); // The tomb Masonry contract

    function stake(uint256 _amount) external override {
        IMasonry(masonry).stake(_amount);
    }

    function withdraw(uint256 _amount) external override {
        IMasonry(masonry).withdraw(_amount);
    }

    function claimReward() external override {
        IMasonry(masonry).claimReward();
    }

    function exit() external override {
        IMasonry(masonry).exit();
    }

    function balanceOf() external view override returns (uint256) {
        // balanceOf differs, probably need different interfaces
    }

    function canClaimReward(address user)
        external
        view
        override
        returns (bool)
    {
        return IMasonry(masonry).canClaimReward(user);
    }

    function canWithdraw(address user) external view override returns (bool) {
        return IMasonry(masonry).canWithdraw(user);
    }

    function earned(address user) external view override returns (uint256) {
        return IMasonry(masonry).earned(user);
    }

    function epoch() external view override returns (uint256) {
        return IMasonry(masonry).epoch();
    }
}
