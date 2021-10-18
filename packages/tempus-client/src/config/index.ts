import { Config } from '../interfaces';

// Ideally we should have only one contract address here (factory contract) that we can query to get additional contract addresses.
// Waiting for backend team for factory contract - for now, we need to store all relevant contract addresses in this config.
const config: Config = {
  tempusPools: [
    /*{
      address: '0x1c5AbE736C6CCb743Bc933241AB462e6b38c6EA4',
      poolId: '0xfb2df41a618b44634a4e180248faaa4dc755d84a000200000000000000000036',
      ammAddress: '0xFb2dF41A618b44634a4E180248fAAA4dc755d84a',
      principalsAddress: '0x08C90BC3448d0928D5b6a97A6c28a4228439E7f7',
      yieldsAddress: '0x868679f952B8b89047cbC015C5c8a765F44040a8',
      yieldBearingTokenAddress: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
      backingTokenAddress: '0x0000000000000000000000000000000000000000',
      startDate: 1633345485000,
      maturityDate: 1638190800000,
      protocol: 'lido',
      backingToken: 'ETH',
      yieldBearingToken: 'stETH',
      spotPrice: '2',
      maxLeftoverShares: '0.00001',
      decimalsForUI: 4,
    },
    {
      address: '0x0749982cAD68506009C7f0341a9A7fD6107A40C2',
      poolId: '0x1814562e59c704e8bc57d2d76e4eec2bd8a694f3000200000000000000000037',
      ammAddress: '0x1814562E59c704E8BC57D2d76e4eEc2bD8a694f3',
      principalsAddress: '0x910f835fceE30Eb45F3c682A57fD8F6A0034b76e',
      yieldsAddress: '0x5f7A80301622fBa05C93e84735815C6d3C3A18a2',
      yieldBearingTokenAddress: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
      backingTokenAddress: '0x0000000000000000000000000000000000000000',
      startDate: 1633345605000,
      maturityDate: 1675170000000,
      protocol: 'lido',
      backingToken: 'ETH',
      yieldBearingToken: 'stETH',
      spotPrice: '2',
      maxLeftoverShares: '0.00001',
      decimalsForUI: 4,
    },*/
    {
      address: '0x4Abee77a95857031321C7bdf41A2011554469554',
      ammAddress: '0x864c092cE9f4217DaF5f4Bed10E299Ebc6FfE79b',
      poolId: '0xd7e0287c555568416956435b0c8777ad376f804000020000000000000000003f',
      backingToken: 'ETH',
      backingTokenAddress: '0x0000000000000000000000000000000000000000',
      yieldBearingToken: 'stETH',
      yieldBearingTokenAddress: '0x209b1C2B038ef377f6f86d33C5Ca94d10ed9C89d',
      principalsAddress: '0xa362beFb6d164C8967FBf663481b4F2126bCE2bb',
      yieldsAddress: '0xb85f079D531F009e0897D00938e1f4037868a1FD',
      startDate: 1634588114000,
      maturityDate: 1672491600000,
      decimalsForUI: 4,
      maxLeftoverShares: '0.00001',
      protocol: 'lido',
      spotPrice: '2',
    },
  ],
  statisticsContract: '0x01fF82791D8414826ec7390dfE7902703F632F5C',
  tempusControllerContract: '0xd4330638b87f97Ec1605D7EC7d67EA1de5Dd7aaA',
  vaultContract: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  networkUrl: 'https://eth-goerli.alchemyapi.io/v2/T39WUBd3Ugwtv6z7LHAjqWM6ODBVzGUA',
  networkName: 'goerli',
  alchemyKey: 'T39WUBd3Ugwtv6z7LHAjqWM6ODBVzGUA',
  lidoOracle: '0x24d8451BC07e7aF4Ba94F69aCDD9ad3c6579D9FB',
};

export default config;
