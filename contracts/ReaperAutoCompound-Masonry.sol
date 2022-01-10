// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'ozlatest/token/ERC20/ERC20.sol';
import 'ozlatest/token/ERC20/utils/SafeERC20.sol';

interface IUniswapRouterETH {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityETH(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountToken, uint256 amountETH);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;
}

interface IUniswapV2Pair {
    function token0() external view returns (address);

    function token1() external view returns (address);
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityETH(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountToken, uint256 amountETH);

    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityETHWithPermit(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountToken, uint256 amountETH);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function quote(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) external pure returns (uint256 amountB);

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountOut);

    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountIn);

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountETH);

    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;
}

import './ReaperBaseStrategy.sol';
import './Mason.sol';

/**
 * @dev Implementation of a strategy to get yields from farming LP Pools in SpookySwap.
 * SpookySwap is an automated market maker (“AMM”) that allows two tokens to be exchanged on Fantom's Opera Network.
 *
 * This strategy deposits whatever funds it receives from the vault into the selected masonry pool.
 * rewards from providing liquidity are farmed every few minutes, sold and split 50/50.
 * The corresponding pair of assets are bought and more liquidity is added to the masonry pool.
 *
 * Expect the amount of LP tokens you have to grow over time while you have assets deposit
 */
contract ReaperAutoCompoundMasonry is ReaperBaseStrategy {
    using SafeERC20 for IERC20;

    /**
     * @dev Tokens Used:
     * {wftm} - Required for liquidity routing when doing swaps.
     * {rewardToken} - Token generated by staking our funds.
     * {stakedToken} - LP Token that the strategy maximizes.
     */
    address public constant wftm = address(0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83);
    address public constant rewardToken = address(0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7);
    address public constant stakedToken = address(0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37);

    /**
     * @dev Third Party Contracts:
     * {uniRouter} - the uniRouter for target DEX
     * {masonry} - masonry contract
     * {masons} - vaults the strategy cycles through to allow withdrawals every epoch (up to the current mason's supply + w/e is in the deposit queue)
     */
    address public constant uniRouter = address(0xF491e7B69E4244ad4002BC14e878a34207E38c29);
    address public constant masonry = address(0x8764DE60236C5843D9faEB1B638fbCE962773B67);
    address[] public masons;

    /**
     * @dev Routes we take to swap tokens using PanrewardTokenSwap.
     * {rewardTokenToWftmRoute} - Route we take to get from {rewardToken} into {wftm}.
     * {rewardTokenToStakedTokenRoute} - Route we take to get from {rewardToken} into {stakedToken}.
     */
    address[] public rewardTokenToWftmRoute = [rewardToken, wftm];
    address[] public rewardTokenToStakedTokenRoute = [rewardToken, wftm, stakedToken];

    /**
     * @dev Variables used to prevent erronous interactions with the masonry
     * {tokensHaveBeenWithdrawn} - Flag to prevent interacting with the masonry before the tokens have been withdrawn,
     * as any interaction with the masonry locks the assets from withdrawal
     * {lastWithdrawIndex} - Last mason index used for withdraw and deposit
     * {depositTimeFrame} - Duration during which deposits will stake into the masonry before the end of an epoch
     * {MAX_DEPOSIT_TIME_FRAME} - Maximum duration for the depositTimeFrame
     * {MASON_QUANTITY} - Number of masons managed by the strat. 36 hours / 6 epochs => 6 masons
     * {sameBlockLock} - Lock necessary to prevent withdrawing and staking in the masonry in the same block, triggering its reentrancy guard
     * {stratHasBeenRetired} - Flag to help emptying strategy funds
     */
    bool tokensHaveBeenWithdrawn;
    uint256 lastWithdrawIndex;
    uint256 depositTimeFrame = 1 hours;
    uint256 MAX_DEPOSIT_TIME_FRAME = 4 hours;
    uint256 MASON_QUANTITY = 6;
    bool sameBlockLock;
    bool stratHasBeenRetired;

    /**
     * @dev Initializes the strategy. Sets parameters, saves routes, and gives allowances.
     * @notice see documentation for each variable above its respective declaration.
     */
    constructor(
        address _vault,
        address[] memory _feeRemitters,
        address[] memory _strategists
    ) ReaperBaseStrategy(_vault, _feeRemitters, _strategists) {
        for (uint256 i; i < MASON_QUANTITY; i++) {
            masons.push(address(new Mason(address(this))));
        }

        _giveAllowances();
    }

    /**
     * @dev Function that puts the funds to work.
     * It gets called whenever someone deposits in the strategy's vault contract.
     * It deposits {stakedToken} in the masonry to farm {rewardToken}
     */
    function deposit() public whenNotPaused {
        require(masons.length == MASON_QUANTITY, 'The masons array must be initialized');
        _checkNewEpoch();
        uint256 stakedTokenBal = IERC20(stakedToken).balanceOf(address(this));
        address currentMason = masons[_getCurrentMasonIndex()];
        if (stakedTokenBal > 0 && block.timestamp > IMason(currentMason).nextEpochPoint() - depositTimeFrame) {
            IERC20(stakedToken).safeTransfer(currentMason, stakedTokenBal);
            uint256 masonStakedTokenBal = IERC20(stakedToken).balanceOf(currentMason);
            IMason(currentMason).stake(masonStakedTokenBal);
        }
    }

    /**
     * @dev Withdraws funds and sents them back to the vault.
     * It withdraws {stakedToken} from the masonry.
     * The available {stakedToken} minus fees is returned to the vault.
     */
    function withdraw(uint256 _amount) external {
        require(_msgSender() == vault, '!vault');
        _checkNewEpoch();
        require(balanceDuringCurrentEpoch() >= _amount, '_amount too great for the current strategy balance');
        _retrieveTokensFromMason();
        uint256 stakedTokenBal = IERC20(stakedToken).balanceOf(address(this));
        stakedTokenBal = stakedTokenBal > _amount ? _amount : stakedTokenBal;
        uint256 withdrawFee = (stakedTokenBal * securityFee) / PERCENT_DIVISOR;
        IERC20(stakedToken).safeTransfer(vault, stakedTokenBal - withdrawFee);
        sameBlockLock = false;
    }

    /**
     * @dev Core function of the strat, in charge of collecting and re-investing rewards.
     * 1. It claims rewards from the masonry.
     * 2. It charges the system fees to simplify the split.
     * 3. It swaps the {rewardToken} token for {lpToken0} & {lpToken1}
     * 4. Adds more liquidity to the pool if on another block than the rewards' claiming.
     * 5. It deposits the new LP tokens.
     */
    function _harvestCore() internal override whenNotPaused {
        require(!stratHasBeenRetired, 'retired');
        _checkNewEpoch();
        _retrieveTokensFromMason();
        _chargeFees();
        _addLiquidity();
        if (!sameBlockLock) {
            deposit();
        }
        sameBlockLock = false;
    }

    /**
     * @dev Returns the approx amount of profit from harvesting plus fee that
     *      would be returned to harvest caller.
     */
    function estimateHarvest() external view virtual override returns (uint256 profit, uint256 callFeeToUser) {
        uint256 reward = IMason(masons[_getCurrentMasonIndex()]).earned();
        uint256[] memory amountOutMin = IUniswapV2Router02(uniRouter).getAmountsOut(reward, rewardTokenToWftmRoute);
        profit = amountOutMin[1];
        uint256 wftmFee = (profit * totalFee) / PERCENT_DIVISOR;
        callFeeToUser = (wftmFee * callFee) / PERCENT_DIVISOR;
        profit = profit - wftmFee;
    }

    /**
     * @dev Will check if the epoch has changed and will reset {tokensHaveBeenWithdrawn}
     */
    function _checkNewEpoch() internal {
        if (lastWithdrawIndex != _getCurrentMasonIndex()) {
            tokensHaveBeenWithdrawn = false;
            lastWithdrawIndex = _getCurrentMasonIndex();
        }
    }

    /**
     * @dev If not done yet in the current epoch, will retrieve all staked tokens & pending rewards from the masonry
     * and transfer them to the strategy
     */
    function _retrieveTokensFromMason() internal {
        if (!tokensHaveBeenWithdrawn) {
            address currentMason = masons[_getCurrentMasonIndex()];

            if (IMason(currentMason).balanceOf() > 0) {
                sameBlockLock = true;
                IMason(currentMason).exit();
            }
            _pullFromMason(currentMason);

            tokensHaveBeenWithdrawn = true;
        }
    }

    /**
     * @dev Takes out fees from the rewards. Set by constructor
     * callFeeToUser is set as a percentage of the fee,
     * as is treasuryFeeToVault and strategistFee
     */
    function _chargeFees() internal {
        uint256 rewardTokenBal = IERC20(rewardToken).balanceOf(address(this));
        if (rewardTokenBal > 0 && totalFee != 0) {
            uint256 toWftm = (rewardTokenBal * totalFee) / PERCENT_DIVISOR;
            IUniswapRouterETH(uniRouter).swapExactTokensForTokensSupportingFeeOnTransferTokens(
                toWftm,
                0,
                rewardTokenToWftmRoute,
                address(this),
                block.timestamp + 600
            );

            uint256 wftmBal = IERC20(wftm).balanceOf(address(this));

            uint256 callFeeToUser = (wftmBal * callFee) / PERCENT_DIVISOR;
            uint256 treasuryFeeToVault = (wftmBal * treasuryFee) / PERCENT_DIVISOR;
            uint256 feeToStrategist = (treasuryFeeToVault * strategistFee) / PERCENT_DIVISOR;
            treasuryFeeToVault = treasuryFeeToVault - feeToStrategist;
            IERC20(wftm).safeTransfer(msg.sender, callFeeToUser);
            IERC20(wftm).safeTransfer(treasury, treasuryFeeToVault);
            IPaymentRouter(strategistRemitter).routePayment(wftm, feeToStrategist);
        }
    }

    /**
     * @dev Swaps {rewardToken} for {stakedToken} using SpookySwap.
     */
    function _addLiquidity() internal {
        uint256 rewardTokenBal = IERC20(rewardToken).balanceOf(address(this));
        if (rewardTokenBal > 0) {
            IUniswapRouterETH(uniRouter).swapExactTokensForTokensSupportingFeeOnTransferTokens(
                rewardTokenBal,
                0,
                rewardTokenToStakedTokenRoute,
                address(this),
                block.timestamp + 600
            );
        }
    }

    /**
     * @dev Function to calculate the total underlaying {lpPair} held by the strat.
     * It takes into account both the funds in hand, as the funds allocated in the masonry.
     */
    function balanceOf() public view override returns (uint256) {
        return balanceOfStakedToken() + balanceOfPool();
    }

    /**
     * @dev It calculates how much {tshare} the contract holds.
     */
    function balanceOfStakedToken() public view returns (uint256) {
        return IERC20(stakedToken).balanceOf(address(this));
    }

    /**
     * @dev It calculates how much {tshare} the strategy has allocated in the masonry
     */
    function balanceOfPool() public view returns (uint256) {
        uint256 totalPoolBalance = 0;
        for (uint256 i = 0; i < masons.length; i++) {
            address mason = masons[i];
            totalPoolBalance = totalPoolBalance + IMason(mason).balanceOf();
        }
        return totalPoolBalance;
    }

    /**
     * Returns stakedToken available for withdraw for the current epoch
     */
    function balanceDuringCurrentEpoch() public view returns (uint256) {
        uint256 balance = IMason(masons[_getCurrentMasonIndex()]).canWithdraw()
            ? balanceOfStakedToken() + IMason(masons[_getCurrentMasonIndex()]).balanceOf()
            : balanceOfStakedToken();
        return balance;
    }

    /**
     * @dev Indicates if the funds can be withdrawn from mason
     */
    function canWithdrawFromMason() external view returns (bool) {
        return block.timestamp < IMason(masons[_getCurrentMasonIndex()]).nextEpochPoint() - depositTimeFrame;
    }

    /**
     * @dev Returns the index for this epoch's mason
     */
    function _getCurrentMasonIndex() internal view returns (uint8) {
        return uint8(IMasonry(masonry).epoch() % MASON_QUANTITY);
    }

    function setDepositTimeFrame(uint256 _depositTimeFrame) external {
        require(_depositTimeFrame <= MAX_DEPOSIT_TIME_FRAME, 'depositTimeFrame too big');
        _onlyStrategistOrOwner();
        depositTimeFrame = _depositTimeFrame;
    }

    /**
     * @dev Function that has to be called as part of strat migration. It sends all the available funds back to the
     * vault, ready to be migrated to the new strat.
     */
    function retireStrat() external {
        require(msg.sender == vault, '!vault');
        stratHasBeenRetired = true;
        _checkNewEpoch();
        _retrieveTokensFromMason();
        uint256 stakedTokenBal = IERC20(stakedToken).balanceOf(address(this));
        IERC20(stakedToken).safeTransfer(vault, stakedTokenBal);
    }

    /**
     * @dev Pauses deposits. Withdraws all funds from the masonry for the current mason, leaving rewards behind
     *      Can only be called by strategist or owner.
     */
    function panic() public {
        _onlyStrategistOrOwner();
        pause();
        _checkNewEpoch();
        _retrieveTokensFromMason();
    }

    /**
     * @dev Allows to withdraw leftover funds from masons once the strat has been retired
     *      Can only be called by strategist or owner
     */
    function withdrawPostRetire() external {
        require(stratHasBeenRetired, '!retired');
        _onlyStrategistOrOwner();
        // Get tokens from masons that can withdraw
        for (uint8 i; i < masons.length; i++) {
            if (IMason(masons[i]).canWithdraw() && IMason(masons[i]).balanceOf() > 0) {
                IMason(masons[i]).exit();

                _pullFromMason(masons[i]);
            }
        }

        // Convert rewardToken to stakedToken
        _addLiquidity();

        // Send to Vault, do not use withdrawFee
        uint256 stakedTokenBal = IERC20(stakedToken).balanceOf(address(this));
        IERC20(stakedToken).safeTransfer(vault, stakedTokenBal);
    }

    function _pullFromMason(address mason) internal {
        uint256 masonStakedToken = IERC20(stakedToken).balanceOf(mason);
        uint256 masonRewardToken = IERC20(rewardToken).balanceOf(mason);

        if (masonStakedToken > 0) {
            IERC20(stakedToken).safeTransferFrom(mason, address(this), masonStakedToken);
        }
        if (masonRewardToken > 0) {
            IERC20(rewardToken).safeTransferFrom(mason, address(this), masonRewardToken);
        }
    }

    /**
     * @dev Pauses the strat. Can only be called by strategist or owner.
     */
    function pause() public {
        _onlyStrategistOrOwner();
        _pause();
        _removeAllowances();
    }

    /**
     * @dev Unpauses the strat. Can only be called by strategist or owner.
     */
    function unpause() external {
        _onlyStrategistOrOwner();
        _unpause();

        _giveAllowances();

        deposit();
    }

    /**
     * @dev Set allowance for token transfers
     */
    function _giveAllowances() internal {
        IERC20(rewardToken).safeApprove(uniRouter, 0);
        IERC20(rewardToken).safeApprove(uniRouter, type(uint256).max);

        IERC20(stakedToken).safeApprove(strategistRemitter, 0);
        IERC20(stakedToken).safeApprove(strategistRemitter, type(uint256).max);
    }

    /**
     * @dev Set all allowances to 0
     */
    function _removeAllowances() internal {
        IERC20(stakedToken).safeApprove(masonry, 0);
        IERC20(rewardToken).safeApprove(uniRouter, 0);
    }
}
