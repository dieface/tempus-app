import * as ejs from 'ethers';
import TempusAMMABI from '../abi/TempusAMM.json';
import getDefaultProvider from './getDefaultProvider';
import TempusAMMService from './TempusAMMService';
import TempusPoolService from './TempusPoolService';

describe('TempusAMMService', () => {
  let tempusAMMService: TempusAMMService;
  let tempusPoolService: TempusPoolService;

  const tempusAMMAddresses = ['address-a', 'address-b', 'address-c'];
  const tempusPoolIds = ['test-pool-id-a', 'test-pool-id-b', 'test-pool-id-c'];
  const tempusPoolAddresses = ['test-pool-address-a', 'test-pool-address-b', 'test-pool-address-c'];
  const mockConfig = {
    tempusPools: [
      {
        ammAddress: 'address-a',
        address: 'test-pool-address-a',
        poolId: 'test-pool-id-a',
      },
      {
        ammAddress: 'address-b',
        address: 'test-pool-address-b',
        poolId: 'test-pool-id-b',
      },
      {
        ammAddress: 'address-c',
        address: 'test-pool-address-c',
        poolId: 'test-pool-id-c',
      },
    ],
  };

  const mockGetPoolId = jest.fn();
  const mockTempusPool = jest.fn();
  const mockGetSwapFeePercentage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(ejs as any, 'Contract').mockImplementation(() => {
      return {
        getPoolId: mockGetPoolId,
        tempusPool: mockTempusPool,
        getSwapFeePercentage: mockGetSwapFeePercentage,
      };
    });

    mockGetPoolId.mockImplementation(() => Promise.resolve(tempusPoolIds[0]));
    mockTempusPool.mockImplementation(() => Promise.resolve(tempusPoolAddresses[0]));

    tempusAMMService = new TempusAMMService();
    tempusPoolService = new TempusPoolService();

    tempusAMMService.init({
      Contract: ejs.Contract,
      tempusAMMAddresses: tempusAMMAddresses,
      signerOrProvider: getDefaultProvider(),
      TempusAMMABI: TempusAMMABI,
      tempusPoolService,
      config: mockConfig as any,
    });
  });

  describe('init()', () => {
    test('Properly initializes the ethers contract for all addresses', () => {
      expect(tempusAMMService['tempusAMMMap'].get(tempusAMMAddresses[0])).toBeDefined();
      expect(tempusAMMService['tempusAMMMap'].get(tempusAMMAddresses[1])).toBeDefined();
      expect(tempusAMMService['tempusAMMMap'].get(tempusAMMAddresses[2])).toBeDefined();
    });

    test('Cleans up previous contracts if called multiple times', () => {
      expect(tempusAMMService['tempusAMMMap'].size).toBe(3);

      tempusAMMService.init({
        Contract: ejs.Contract,
        TempusAMMABI: TempusAMMABI,
        signerOrProvider: getDefaultProvider(),
        tempusAMMAddresses: tempusAMMAddresses,
        tempusPoolService,
        config: mockConfig as any,
      });

      expect(tempusAMMService['tempusAMMMap'].size).toBe(3);
    });
  });

  describe('poolId()', () => {
    test('Returns poolId for specified AMM address', async () => {
      const poolId = await tempusAMMService.poolId(tempusAMMAddresses[2]);

      expect(poolId).toBe(tempusPoolIds[0]);
    });

    test('Throws error if AMM with specified address does not exist', async () => {
      const nonExistingAddress = 'non-existing-address';

      try {
        await tempusAMMService.poolId(nonExistingAddress);
      } catch (error: any) {
        expect(error.message).toBe(
          `TempusAMMService - poolId('${nonExistingAddress}') - Invalid AMM address provided!`,
        );
      }
    });

    test('Logs error into console and rejects if contract call fails', async () => {
      mockGetPoolId.mockImplementation(() => {
        throw new Error('contract-error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(tempusAMMService.poolId(tempusAMMAddresses[0])).rejects.toEqual(new Error('contract-error'));
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTempusPoolAddressFromId()', () => {
    test('returns tempus pool address for specified poolId', async () => {
      const poolAddress = tempusAMMService.getTempusPoolAddressFromId(tempusPoolIds[0]);

      expect(poolAddress).toBe(tempusPoolAddresses[0]);
    });

    test('throws an error if tempus pool config with specified poolID does not exist', async () => {
      const nonExistingPoolId = 'non-existing-pooId';

      try {
        tempusAMMService.getTempusPoolAddressFromId(nonExistingPoolId);
      } catch (error: any) {
        expect(error.message).toBe(`Failed to find tempus pool config for pool with ${nonExistingPoolId} PoolID`);
      }
    });
  });

  describe('getSwapFeePercentage()', () => {
    test('returns tempus pool swap fee', async () => {
      const fee = ejs.BigNumber.from('12');
      mockGetSwapFeePercentage.mockResolvedValue(fee);
      const swapFee = await tempusAMMService.getSwapFeePercentage(tempusAMMAddresses[0]);

      expect(swapFee).toStrictEqual(fee);
    });
  });
});
