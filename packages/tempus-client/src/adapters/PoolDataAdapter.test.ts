import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import PoolDataAdapter from './PoolDataAdapter';

jest.mock('@ethersproject/providers');
const { JsonRpcProvider } = jest.requireMock('@ethersproject/providers');

describe('PoolDataAdapter', () => {
  let instance: PoolDataAdapter;

  const mockProvider = new JsonRpcProvider();

  beforeEach(() => {
    jest.clearAllMocks();

    const mockGetTempusControllerService = jest.fn();
    const mockGetERC20TokenService = jest.fn().mockImplementation((address: string) => {
      switch (address) {
        case 'backing-token-address': {
          return {
            balanceOf: jest.fn().mockResolvedValue(ethers.utils.parseEther('10')),
          };
        }

        case 'yield-bearing-token-address': {
          return {
            balanceOf: jest.fn().mockResolvedValue(ethers.utils.parseEther('20')),
          };
        }

        case 'principals-token-address': {
          return {
            balanceOf: jest.fn().mockResolvedValue(ethers.utils.parseEther('31')),
          };
        }

        case 'yields-token-address': {
          return {
            balanceOf: jest.fn().mockResolvedValue(ethers.utils.parseEther('12')),
          };
        }

        // LP tokens
        default: {
          return {
            balanceOf: jest.fn().mockResolvedValue(ethers.utils.parseEther('7')),
          };
        }
      }
    });
    const mockGetStatisticsService = jest.fn().mockImplementation(() => {
      return { getRate: jest.fn().mockResolvedValue(ethers.utils.parseEther('0.5')) };
    });

    const mockGetTempusPoolService = jest.fn().mockImplementation(() => {
      return {
        getBackingTokenAddress: jest.fn().mockResolvedValue('backing-token-address'),
        getBackingTokenTicker: jest.fn().mockResolvedValue('backing-token-ticker'),
        getYieldBearingTokenAddress: jest.fn().mockResolvedValue('yield-bearing-token-address'),
        getPrincipalTokenAddress: jest.fn().mockResolvedValue('principals-token-address'),
        getYieldTokenAddress: jest.fn().mockResolvedValue('yields-token-address'),
        numAssetsPerYieldToken: jest.fn().mockResolvedValue(ethers.utils.parseEther('1')),
      };
    });

    instance = new PoolDataAdapter();
    instance.init({
      eRC20TokenServiceGetter: mockGetERC20TokenService,
      statisticService: mockGetStatisticsService(),
      tempusControllerAddress: 'mock-tempus-controller-address',
      tempusControllerService: mockGetTempusControllerService(),
      tempusPoolService: mockGetTempusPoolService(),
    });
  });

  describe('getPoolDataAdapter()', () => {
    test('returns a not null PoolDataAdapter instance', () => {
      expect(instance).toBeInstanceOf(PoolDataAdapter);
      expect(instance).not.toBe(null);
    });
  });

  describe('retrieveBalances()', () => {
    test('returns an object containing balances ', async () => {
      const tempusPoolAddress = 'abc';
      const userWalletAddress = 'xyz';
      const tempusAmmAddress = '123';
      const signer = mockProvider;

      const balances = await instance.retrieveBalances(tempusPoolAddress, tempusAmmAddress, userWalletAddress, signer);

      expect(balances).toBeDefined();
      if (balances) {
        expect(ethers.utils.formatEther(balances.backingTokenBalance)).toBe('10.0');
        expect(ethers.utils.formatEther(balances.backingTokenRate)).toBe('0.5');
        expect(ethers.utils.formatEther(balances.yieldBearingTokenBalance)).toBe('20.0');
        expect(ethers.utils.formatEther(balances.yieldBearingTokenRate)).toBe('0.5');
        expect(ethers.utils.formatEther(balances.principalsTokenBalance)).toBe('31.0');
        expect(ethers.utils.formatEther(balances.yieldsTokenBalance)).toBe('12.0');
        expect(ethers.utils.formatEther(balances.lpTokensBalance)).toBe('7.0');
      }
    });
  });
});