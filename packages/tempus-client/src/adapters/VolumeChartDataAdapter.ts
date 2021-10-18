import { BigNumber, ethers } from 'ethers';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BLOCK_DURATION_SECONDS, SECONDS_IN_A_DAY } from '../constants';
import { Config } from '../interfaces';
import ChartDataPoint from '../interfaces/ChartDataPoint';
import StatisticsService from '../services/StatisticsService';
import TempusPoolService from '../services/TempusPoolService';
import TempusControllerService, { DepositedEvent, RedeemedEvent } from '../services/TempusControllerService';
import VaultService, { SwapEvent } from '../services/VaultService';
import { getEventBackingTokenValue, getEventPoolAddress } from '../services/EventUtils';
import TempusAMMService from '../services/TempusAMMService';
import { div18f, mul18f } from '../utils/wei-math';
import getConfig from '../utils/get-config';

type VolumeChartDataAdapterParameters = {
  signerOrProvider: JsonRpcProvider | JsonRpcSigner;
  tempusPoolService: TempusPoolService;
  statisticsService: StatisticsService;
  tempusControllerService: TempusControllerService;
  vaultService: VaultService;
  tempusAMMService: TempusAMMService;
  config: Config;
};

class VolumeChartDataAdapter {
  private readonly NUMBER_OF_PAST_DAYS = 29;

  private tempusPoolService: TempusPoolService | null = null;
  private statisticsService: StatisticsService | null = null;
  private tempusControllerService: TempusControllerService | null = null;
  private vaultService: VaultService | null = null;
  private tempusAMMService: TempusAMMService | null = null;

  private signerOrProvider: JsonRpcProvider | JsonRpcSigner | null = null;

  private config: Config | null = null;

  public init(params: VolumeChartDataAdapterParameters): void {
    this.tempusPoolService = params.tempusPoolService;
    this.statisticsService = params.statisticsService;
    this.tempusControllerService = params.tempusControllerService;
    this.vaultService = params.vaultService;
    this.tempusAMMService = params.tempusAMMService;

    this.signerOrProvider = params.signerOrProvider;

    this.config = params.config;
  }

  public async generateChartData(): Promise<ChartDataPoint[]> {
    let blocksToQuery: ethers.providers.Block[];
    try {
      blocksToQuery = await this.fetchDataPointBlocks();
    } catch (error) {
      console.error('VolumeChartDataAdapter - generateChartData() - Failed to fetch data point blocks!', error);
      return Promise.reject(error);
    }

    const chartDataSegmentsFetchPromises = [];
    for (let i = 0; i < blocksToQuery.length - 1; i++) {
      const currentBlock = blocksToQuery[i];
      const nextBlock = blocksToQuery[i + 1];

      chartDataSegmentsFetchPromises.push(this.getTempusVolume(currentBlock, nextBlock));
    }
    const chartDataSegments = await Promise.all(chartDataSegmentsFetchPromises);

    return chartDataSegments.map((chartDataSegment, index) => {
      const previousChartDataSegment = chartDataSegments[index - 1];

      let valueIncrease = BigNumber.from('0');
      if (previousChartDataSegment && previousChartDataSegment.volume && !previousChartDataSegment.volume.isZero()) {
        const valueDiff = chartDataSegment.volume.sub(previousChartDataSegment.volume);
        const valueRatio = div18f(valueDiff, previousChartDataSegment.volume);

        valueIncrease = mul18f(valueRatio, ethers.utils.parseEther('100'));
      }

      return {
        value: Number(ethers.utils.formatEther(chartDataSegment.volume)),
        date: new Date(chartDataSegment.timeEnd * 1000),
        valueIncrease: ethers.utils.formatEther(valueIncrease),
      };
    });
  }

  private async fetchDataPointBlocks(): Promise<ethers.providers.Block[]> {
    if (!this.signerOrProvider) {
      return Promise.reject();
    }

    const blockInterval = Math.floor(SECONDS_IN_A_DAY / BLOCK_DURATION_SECONDS);

    let currentBlock: ethers.providers.Block;
    try {
      if (this.signerOrProvider instanceof JsonRpcProvider) {
        currentBlock = await this.signerOrProvider.getBlock('latest');
      } else {
        currentBlock = await this.signerOrProvider.provider.getBlock('latest');
      }
    } catch (error) {
      console.error('VolumeChartDataAdapter - fetchDataPointBlocks() - Failed to fetch latest block data!', error);
      return Promise.reject(error);
    }

    let pastBlocks: ethers.providers.Block[];
    try {
      const blockFetchPromises = [];
      // Fetch Blocks for previous NUMBER_OF_PAST_DAYS days (1 block per day)
      for (let i = this.NUMBER_OF_PAST_DAYS; i >= 0; i--) {
        const blockToQuery = currentBlock.number - (currentBlock.number % blockInterval) - i * blockInterval;
        if (this.signerOrProvider instanceof JsonRpcProvider) {
          blockFetchPromises.push(this.signerOrProvider.getBlock(blockToQuery));
        } else {
          blockFetchPromises.push(this.signerOrProvider.provider.getBlock(blockToQuery));
        }
      }
      pastBlocks = await Promise.all(blockFetchPromises);
    } catch (error) {
      console.error(
        'VolumeChartDataAdapter - fetchDataPointBlocks() - Failed to fetch block block data for past days!',
        error,
      );
      return Promise.reject(error);
    }

    return [...pastBlocks, currentBlock];
  }

  private async getTempusVolume(startBlock: ethers.providers.Block, endBlock: ethers.providers.Block) {
    if (!this.tempusControllerService || !this.vaultService) {
      console.error(
        'VolumeChartDataAdapter - fetchData() - Attempted to use VolumeChartDataAdapter before initializing it!',
      );
      return Promise.reject();
    }

    let depositEvents: DepositedEvent[];
    let redeemEvents: RedeemedEvent[];
    let swapEvents: SwapEvent[];
    try {
      const forUser = undefined;
      const forPool = undefined;
      [depositEvents, redeemEvents, swapEvents] = await Promise.all([
        this.tempusControllerService.getDepositedEvents(forPool, forUser, startBlock.number, endBlock.number),
        this.tempusControllerService.getRedeemedEvents(forPool, forUser, startBlock.number, endBlock.number),
        this.vaultService.getSwapEvents(forPool, startBlock.number, endBlock.number),
      ]);
    } catch (error) {
      console.error('Failed to fetch deposit and redeem events for volume chart', error);
      return Promise.reject(error);
    }

    let eventsVolume: BigNumber;
    try {
      eventsVolume = await this.fetchEventsVolume([...depositEvents, ...redeemEvents, ...swapEvents]);
    } catch (error) {
      console.error('Failed to fetch chart data for deposit and redeem events', error);
      return Promise.reject(error);
    }

    return {
      volume: eventsVolume,
      timeStart: endBlock.timestamp,
      timeEnd: endBlock.timestamp,
    };
  }

  /**
   * Fetches chart data for all passed events.
   */
  private async fetchEventsVolume(events: Array<DepositedEvent | RedeemedEvent | SwapEvent>): Promise<BigNumber> {
    const fetchPromises: Promise<BigNumber>[] = [];

    events.forEach(event => {
      fetchPromises.push(this.getEventValue(event));
    });

    let eventValues: BigNumber[];
    try {
      eventValues = await Promise.all(fetchPromises);
    } catch (error) {
      console.error('Failed to fetch events chart data', error);
      return Promise.reject(error);
    }

    let totalVolume = BigNumber.from('0');
    eventValues.forEach(value => {
      totalVolume = totalVolume.add(value);
    });
    return totalVolume;
  }

  /**
   * Generates chart data for a single event that contains timestamp of the event and value of the event in terms of USD
   */
  private async getEventValue(event: DepositedEvent | RedeemedEvent | SwapEvent): Promise<BigNumber> {
    if (!this.tempusPoolService || !this.statisticsService || !this.tempusAMMService || !this.config) {
      console.error('Attempted to use VolumeChartDataAdapter before initializing it!');
      return Promise.reject();
    }

    const eventPoolAddress = getEventPoolAddress(event, this.tempusAMMService);

    const poolConfig = this.config.tempusPools.find(pool => pool.address === eventPoolAddress);
    if (!poolConfig) {
      return Promise.reject();
    }

    let poolBackingTokenRate: BigNumber;
    try {
      // TODO - Use chainlink data once we go to mainnet
      poolBackingTokenRate = await this.statisticsService.getCoingeckoRate(poolConfig.backingToken);
    } catch (error) {
      console.error('Failed to get tempus pool exchange rate to USD!');
      return Promise.reject(error);
    }

    const eventBackingTokenValue = getEventBackingTokenValue(event, poolConfig.principalsAddress);

    return mul18f(eventBackingTokenValue, poolBackingTokenRate);
  }
}
export default VolumeChartDataAdapter;
