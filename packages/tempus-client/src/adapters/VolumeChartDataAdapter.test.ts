import * as ejs from 'ethers';
import { SECONDS_IN_A_DAY } from '../constants';

import VolumeChartDataAdapter from './VolumeChartDataAdapter';

let instance: VolumeChartDataAdapter;

describe('generateChartData()', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(ejs as any, 'Contract').mockReturnValue({
      getPoolId: jest.fn(),
      queryFilter: jest.fn(),
      filters: {
        Deposited: jest.fn(),
        Redeemed: jest.fn(),
        Swap: jest.fn(),
      },
    });

    let mockGetBlock = jest.fn();
    // Latest block mock
    mockGetBlock = mockGetBlock.mockResolvedValueOnce({
      number: 30,
      timestamp: Math.floor(new Date().getTime() / 1000),
    });
    // Past days mock
    for (let i = 30; i >= 1; i--) {
      mockGetBlock = mockGetBlock.mockResolvedValueOnce({
        number: 30 - i,
        timestamp: Math.floor(new Date().getTime() / 1000) - SECONDS_IN_A_DAY * (i / 2),
      });
    }

    const mockGetTempusControllerService = jest.fn().mockImplementation(() => {
      return {
        getDepositedEvents: jest.fn().mockResolvedValue([
          {
            name: 'd-event-1',
            blockNumber: 0,
            args: {
              depositor: 'depositor-1',
              pool: 'pool-1',
              backingTokenValue: ejs.utils.parseEther('20'),
            },
          },
          {
            name: 'd-event-2',
            blockNumber: 1,
            args: {
              depositor: 'depositor-1',
              pool: 'pool-1',
              backingTokenValue: ejs.utils.parseEther('25'),
            },
          },
        ]),
        getRedeemedEvents: jest.fn().mockResolvedValue([
          {
            name: 'r-event-1',
            blockNumber: 5,
            args: {
              redeemer: 'redeemer-1',
              pool: 'pool-1',
              backingTokenValue: ejs.utils.parseEther('26'),
            },
          },
          {
            name: 'r-event-2',
            blockNumber: 2,
            args: {
              redeemer: 'redeemer-2',
              pool: 'pool-1',
              backingTokenValue: ejs.utils.parseEther('500'),
            },
          },
        ]),
      };
    });

    const mockGetVaultService = jest.fn().mockImplementation(() => {
      return {
        getSwapEvents: jest.fn().mockResolvedValue([
          {
            name: 's-event-1',
            blockNumber: 3,
            args: {
              tokenIn: 'principal-address',
              amountIn: ejs.utils.parseEther('5'),
              poolId: 'pool-id-1',
            },
          },
          {
            name: 's-event-2',
            blockNumber: 3,
            args: {
              tokenIn: 'principal-address',
              amountIn: ejs.utils.parseEther('3'),
              poolId: 'pool-id-1',
            },
          },
        ]),
      };
    });

    const mockGetTempusAMMService = jest.fn().mockImplementation(() => {
      return {
        getTempusPoolAddressFromId: jest.fn().mockReturnValue('pool-1'),
      };
    });

    const mockGetTempusPoolService = jest.fn().mockImplementation(() => {
      return {
        getBackingTokenTicker: jest.fn().mockResolvedValue('dai'),
        getPrincipalsTokenAddress: jest.fn().mockResolvedValue('principal-address'),
      };
    });

    const mockGetStatisticsService = jest.fn().mockImplementation(() => {
      return {
        getRate: jest.fn().mockResolvedValue(ejs.ethers.utils.parseEther('2')),
        getCoingeckoRate: jest.fn().mockResolvedValue(ejs.ethers.utils.parseEther('2')),
      };
    });

    const getMockProvider = jest.fn().mockReturnValue({
      provider: {
        getBlock: mockGetBlock,
      },
    });

    instance = new VolumeChartDataAdapter();
    instance.init({
      signerOrProvider: getMockProvider(),
      statisticsService: mockGetStatisticsService(),
      tempusAMMService: mockGetTempusAMMService(),
      tempusControllerService: mockGetTempusControllerService(),
      tempusPoolService: mockGetTempusPoolService(),
      vaultService: mockGetVaultService(),
      config: {
        tempusPools: [
          {
            address: 'pool-1',
            poolId: 'pool-id-1',
            principalsAddress: 'principal-address',
          },
        ],
      } as any,
    });
  });

  test('it returns an array of data points for past 30 days', async () => {
    const chartData = await instance.generateChartData();

    expect(chartData.length).toBe(30);

    expect(chartData[29].value).toBe(1158);
    expect(chartData[28].value).toBe(1158);
    expect(chartData[27].value).toBe(1158);
    expect(chartData[26].value).toBe(1158);

    expect(Number(chartData[29].valueIncrease).toFixed(2)).toBe('0.00');
    expect(Number(chartData[28].valueIncrease).toFixed(2)).toBe('0.00');
    expect(Number(chartData[27].valueIncrease).toFixed(2)).toBe('0.00');
    expect(Number(chartData[26].valueIncrease).toFixed(2)).toBe('0.00');
  });
});
