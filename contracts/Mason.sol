// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'ozlatest/token/ERC20/ERC20.sol';
import 'ozlatest/token/ERC20/utils/SafeERC20.sol';
import 'ozlatest/access/Ownable.sol';

interface IMasonry {
    function stake(uint256 _amount) external;

    function withdraw(uint256 _amount) external;

    function claimReward() external;

    function exit() external; //Could end up being useful if the masonry is deactivated, or other unexpected reasons

    function balanceOf(address user) external view returns (uint256);

    function canClaimReward(address user) external view returns (bool);

    function canWithdraw(address user) external view returns (bool);

    function earned(address user) external view returns (uint256);

    function epoch() external view returns (uint256);

    function nextEpochPoint() external view returns (uint256);
}

/**
 * @dev The IMason wraps the IMasonry but does not need the address user parameter
 */
interface IMason {
    function stake(uint256 _amount) external;

    function withdraw(uint256 _amount) external;

    function claimReward() external;

    function exit() external; //Could end up being useful if the masonry is deactivated, or other unexpected reasons

    function balanceOf() external view returns (uint256);

    function canClaimReward() external view returns (bool);

    function canWithdraw() external view returns (bool);

    function earned() external view returns (uint256);

    function epoch() external view returns (uint256);

    function nextEpochPoint() external view returns (uint256);
}

/**
 * @dev A wrapper for the tomb Masonry contract that allows the strategy to have multiple
 * Masons, and therefore multiple separate timelocks in a rotation.
 */
contract Mason is IMason {
    using SafeERC20 for IERC20;
    address public masonry = address(0x8764DE60236C5843D9faEB1B638fbCE962773B67); // The tomb Masonry contract
    address public tshare = address(0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37); //TSHARE
    address public tomb = address(0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7); //TOMB
    address public strategy;

    modifier onlyAuthorized() {
        require(strategy == msg.sender, 'caller is not authorized');
        _;
    }

    constructor(address _strategy) {
        strategy = _strategy;
        _giveAllowances();
    }

    function stake(uint256 _amount) external override onlyAuthorized {
        IMasonry(masonry).stake(_amount);
    }

    function withdraw(uint256 _amount) external override onlyAuthorized {
        IMasonry(masonry).withdraw(_amount);
    }

    function claimReward() external override onlyAuthorized {
        IMasonry(masonry).claimReward();
    }

    function exit() external override onlyAuthorized {
        IMasonry(masonry).exit();
    }

    function balanceOf() external view override returns (uint256) {
        return IMasonry(masonry).balanceOf(address(this));
    }

    function canClaimReward() external view override returns (bool) {
        return IMasonry(masonry).canClaimReward(address(this));
    }

    function canWithdraw() external view override returns (bool) {
        return IMasonry(masonry).canWithdraw(address(this));
    }

    function earned() external view override returns (uint256) {
        return IMasonry(masonry).earned(address(this));
    }

    function epoch() external view override returns (uint256) {
        return IMasonry(masonry).epoch();
    }

    function nextEpochPoint() external view override returns (uint256) {
        return IMasonry(masonry).nextEpochPoint();
    }

    function _giveAllowances() internal {
        IERC20(tshare).safeApprove(masonry, 0);
        IERC20(tshare).safeApprove(strategy, 0);
        IERC20(tomb).safeApprove(strategy, 0);
        IERC20(tshare).safeApprove(masonry, type(uint256).max);
        IERC20(tshare).safeApprove(strategy, type(uint256).max);
        IERC20(tomb).safeApprove(strategy, type(uint256).max);
    }
}
