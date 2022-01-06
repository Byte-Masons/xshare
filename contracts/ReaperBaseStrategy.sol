// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'ozlatest/access/Ownable.sol';
import 'ozlatest/security/Pausable.sol';
import 'ozlatest/utils/Address.sol';
import 'ozlatest/utils/math/SafeMath.sol';

abstract contract ReaperBaseStrategy is Pausable, Ownable {
    using Address for address;
    using SafeMath for uint256;

    uint256 public constant PERCENT_DIVISOR = 10_000;
    uint256 public constant ONE_YEAR = 365 days;

    /**
     * {TotalFeeUpdated} Event that is fired each time the total fee is updated.
     * {FeesUpdated} Event that is fired each time callFee+treasuryFee+strategistFee are updated.
     */
    event TotalFeeUpdated(uint256 newFee);
    event FeesUpdated(uint256 newCallFee, uint256 newTreasuryFee, uint256 newStrategistFee);

    /**
     * @dev Distribution of fees earned. This allocations relative to the % implemented on
     * Current implementation separates 5% for fees. Can be changed through the constructor
     * Inputs in constructor should be ratios between the Fee and Max Fee, divisble into percents by 10000
     *
     * {callFee} - Percent of the totalFee reserved for the harvester (1000 = 10% of total fee: 4.5% by default)
     * {treasuryFee} - Percent of the totalFee taken by maintainers of the software (6500 = 65% of total fee: 4.5% by default)
     * {strategistFee} - Percent of the totalFee taken by strategist (2500 = 25% of total fee: 4.5% by default)
     * {securityFee} - Fee taxed when a user withdraws funds. Taken to prevent flash deposit/harvest attacks.
     * These funds are redistributed to stakers in the pool.
     *
     * {totalFee} - divided by 10,000 to determine the % fee. Set to 4.5% by default and
     * lowered as necessary to provide users with the most competitive APY.
     *
     * {STRATEGIST_MAX_FEE} - Maximum strategist fee allowed by the strategy. Hard-capped at 50%.
     * {MAX_FEE} - Maximum fee allowed by the strategy. Hard-capped at 10%.
     * {PERCENT_DIVISOR} - Constant used to safely calculate the correct percentages.
     */

    uint256 public callFee = 1000;
    uint256 public treasuryFee = 6500;
    uint256 public strategistFee = 2500;
    uint256 public securityFee = 10;
    uint256 public totalFee = 450;
    uint256 public constant STRATEGIST_MAX_FEE = 5000;
    uint256 public constant MAX_FEE = 1000;

    struct Harvest {
        uint256 timestamp;
        uint256 profit;
        uint256 tvl; // doesn't include profit
        uint256 timeSinceLastHarvest;
    }

    Harvest[] public harvestLog;
    uint256 public harvestLogCadence = 12 hours;
    uint256 public lastHarvestTimestamp;

    event StratHarvest(address indexed harvester);

    /**
     * @dev harvest() function that takes care of logging. Subclasses should
     *      override _harvestCore() and implement their specific logic in it.
     */
    function harvest() external whenNotPaused {
        require(!Address.isContract(msg.sender), '!contract');

        Harvest memory logEntry;
        logEntry.timestamp = block.timestamp;
        logEntry.tvl = balanceOf();
        logEntry.timeSinceLastHarvest = block.timestamp.sub(lastHarvestTimestamp);

        _harvestCore();

        logEntry.profit = balanceOf().sub(logEntry.tvl);
        if (
            harvestLog.length == 0 ||
            harvestLog[harvestLog.length - 1].timestamp.add(harvestLogCadence) <= logEntry.timestamp
        ) {
            harvestLog.push(logEntry);
        }

        lastHarvestTimestamp = block.timestamp;
        emit StratHarvest(msg.sender);
    }

    function harvestLogLength() external view returns (uint256) {
        return harvestLog.length;
    }

    /**
     * @dev Returns a slice of the harvest log containing the _n latest harvests.
     */
    function latestHarvestLogSlice(uint256 _n) external view returns (Harvest[] memory slice) {
        slice = new Harvest[](_n);
        uint256 sliceCounter = 0;

        for (uint256 i = harvestLog.length.sub(_n); i < harvestLog.length; i++) {
            slice[sliceCounter++] = harvestLog[i];
        }
    }

    /**
     * @dev Traverses the harvest log backwards until it hits _timestamp,
     *      and returns the average APR calculated across all the included
     *      log entries. APR is multiplied by PERCENT_DIVISOR to retain precision.
     *
     * Note: will never hit the first log since that won't really have a proper
     * timeSinceLastHarvest
     */
    function averageAPRSince(uint256 _timestamp) external view returns (uint256) {
        uint256 runningAPRSum;
        uint256 numLogsProcessed;

        for (uint256 i = harvestLog.length - 1; i > 0 && harvestLog[i].timestamp >= _timestamp; i--) {
            uint256 projectedYearlyProfit = harvestLog[i].profit.mul(ONE_YEAR).div(harvestLog[i].timeSinceLastHarvest);
            runningAPRSum = runningAPRSum.add(projectedYearlyProfit.mul(PERCENT_DIVISOR).div(harvestLog[i].tvl));

            numLogsProcessed++;
        }

        return runningAPRSum.div(numLogsProcessed);
    }

    /**
     * @dev Traverses the harvest log backwards _n items,
     *      and returns the average APR calculated across all the included
     *      log entries. APR is multiplied by PERCENT_DIVISOR to retain precision.
     *
     * Note: will never hit the first log since that won't really have a proper
     * timeSinceLastHarvest
     */
    function averageAPRAcrossLastNHarvests(uint256 _n) external view returns (uint256) {
        uint256 runningAPRSum;
        uint256 numLogsProcessed;

        for (uint256 i = harvestLog.length - 1; i > 0 && numLogsProcessed < _n; i--) {
            uint256 projectedYearlyProfit = harvestLog[i].profit.mul(ONE_YEAR).div(harvestLog[i].timeSinceLastHarvest);
            runningAPRSum = runningAPRSum.add(projectedYearlyProfit.mul(PERCENT_DIVISOR).div(harvestLog[i].tvl));

            numLogsProcessed++;
        }

        return runningAPRSum.div(numLogsProcessed);
    }

    function updateHarvestLogCadence(uint256 _newCadenceInSeconds) external onlyOwner {
        harvestLogCadence = _newCadenceInSeconds;
    }

    /**
     * @dev updates the total fee, capped at 10%
     */
    function updateTotalFee(uint256 _totalFee) external onlyOwner returns (bool) {
        require(_totalFee <= MAX_FEE, 'Fee Too High');
        totalFee = _totalFee;
        emit TotalFeeUpdated(totalFee);
        return true;
    }

    function updateFees(
        uint256 _callFee,
        uint256 _treasuryFee,
        uint256 _strategistFee
    ) external onlyOwner returns (bool) {
        require(_strategistFee <= STRATEGIST_MAX_FEE, 'Cannot set the strategist fee higher than max fee');
        require(_callFee.add(_treasuryFee).add(_strategistFee) == PERCENT_DIVISOR, 'Fees must add up to 100%');
        callFee = _callFee;
        treasuryFee = _treasuryFee;
        strategistFee = _strategistFee;
        emit FeesUpdated(callFee, treasuryFee, strategistFee);
        return true;
    }

    /**
     * @dev Returns the approx amount of profit from harvesting plus fee that
     *      would be returned to harvest caller.
     */
    function estimateHarvest() external view virtual returns (uint256 profit, uint256 callFeeToUser);

    function balanceOf() public virtual returns (uint256);

    /**
     * @dev subclasses should add their custom harvesting logic in this function
     *      including charging any fees.
     */
    function _harvestCore() internal virtual;
}
