import { JsonRpcSigner, JsonRpcProvider } from '@ethersproject/providers';
import VariableRateService from './VariableRateService';
import getTempusPoolService from '../services/getTempusPoolService';
import getTempusAMMService from '../services/getTempusAMMService';
import getVaultService from '../services/getVaultService';
import getConfig from '../utils/get-config';

let variableRateService: VariableRateService;
let actualSignerOrProvider: JsonRpcSigner | JsonRpcProvider;
const getVariableRateService = (signerOrProvider?: JsonRpcSigner | JsonRpcProvider): VariableRateService => {
  if (!variableRateService) {
    variableRateService = new VariableRateService();
  }

  if (signerOrProvider !== undefined && signerOrProvider !== actualSignerOrProvider) {
    actualSignerOrProvider = signerOrProvider;
    variableRateService.init(
      actualSignerOrProvider,
      getTempusPoolService(actualSignerOrProvider),
      getVaultService(actualSignerOrProvider),
      getTempusAMMService(actualSignerOrProvider),
      getConfig(),
    );
  }

  return variableRateService;
};

export default getVariableRateService;
