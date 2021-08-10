/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface CompoundPriceOracleInterface extends ethers.utils.Interface {
  functions: {
    "currentRate(address)": FunctionFragment;
    "numYieldTokensPerAsset(address,uint256)": FunctionFragment;
    "scaledBalance(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "currentRate", values: [string]): string;
  encodeFunctionData(
    functionFragment: "numYieldTokensPerAsset",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "scaledBalance",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "currentRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numYieldTokensPerAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "scaledBalance",
    data: BytesLike
  ): Result;

  events: {};
}

export class CompoundPriceOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: CompoundPriceOracleInterface;

  functions: {
    currentRate(token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    numYieldTokensPerAsset(
      t: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    scaledBalance(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  currentRate(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  numYieldTokensPerAsset(
    t: string,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  scaledBalance(
    token: string,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    currentRate(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    numYieldTokensPerAsset(
      t: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    scaledBalance(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    currentRate(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    numYieldTokensPerAsset(
      t: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    scaledBalance(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    currentRate(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    numYieldTokensPerAsset(
      t: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    scaledBalance(
      token: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
