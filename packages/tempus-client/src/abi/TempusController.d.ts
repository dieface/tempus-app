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
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface TempusControllerInterface extends ethers.utils.Interface {
  functions: {
    "completeExitAndRedeem(address,bool)": FunctionFragment;
    "depositAndFix(address,uint256,bool,uint256)": FunctionFragment;
    "depositAndProvideLiquidity(address,uint256,bool)": FunctionFragment;
    "depositBacking(address,uint256,address)": FunctionFragment;
    "depositYieldBearing(address,uint256,address)": FunctionFragment;
    "exitTempusAMM(address,uint256,uint256,uint256,bool)": FunctionFragment;
    "exitTempusAMMAndRedeem(address,uint256,bool)": FunctionFragment;
    "owner()": FunctionFragment;
    "redeemToBacking(address,address,uint256,uint256,address)": FunctionFragment;
    "redeemToYieldBearing(address,address,uint256,uint256,address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "completeExitAndRedeem",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "depositAndFix",
    values: [string, BigNumberish, boolean, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositAndProvideLiquidity",
    values: [string, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "depositBacking",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "depositYieldBearing",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "exitTempusAMM",
    values: [string, BigNumberish, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "exitTempusAMMAndRedeem",
    values: [string, BigNumberish, boolean]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeemToBacking",
    values: [string, string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemToYieldBearing",
    values: [string, string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "completeExitAndRedeem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositAndFix",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositAndProvideLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositBacking",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositYieldBearing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "exitTempusAMM",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "exitTempusAMMAndRedeem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemToBacking",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redeemToYieldBearing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Deposited(address,address,address,uint256,uint256,uint256,uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Redeemed(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redeemed"): EventFragment;
}

export class TempusController extends BaseContract {
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

  interface: TempusControllerInterface;

  functions: {
    completeExitAndRedeem(
      tempusAMM: string,
      toBackingToken: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositAndFix(
      tempusAMM: string,
      tokenAmount: BigNumberish,
      isBackingToken: boolean,
      minTYSRate: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositAndProvideLiquidity(
      tempusAMM: string,
      tokenAmount: BigNumberish,
      isBackingToken: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositBacking(
      targetPool: string,
      backingTokenAmount: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositYieldBearing(
      targetPool: string,
      yieldTokenAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exitTempusAMM(
      tempusAMM: string,
      lpTokensAmount: BigNumberish,
      principalAmountOutMin: BigNumberish,
      yieldAmountOutMin: BigNumberish,
      toInternalBalances: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exitTempusAMMAndRedeem(
      tempusAMM: string,
      sharesAmount: BigNumberish,
      toBackingToken: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    redeemToBacking(
      targetPool: string,
      sender: string,
      principalAmount: BigNumberish,
      yieldAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeemToYieldBearing(
      targetPool: string,
      sender: string,
      principalAmount: BigNumberish,
      yieldAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  completeExitAndRedeem(
    tempusAMM: string,
    toBackingToken: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositAndFix(
    tempusAMM: string,
    tokenAmount: BigNumberish,
    isBackingToken: boolean,
    minTYSRate: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositAndProvideLiquidity(
    tempusAMM: string,
    tokenAmount: BigNumberish,
    isBackingToken: boolean,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositBacking(
    targetPool: string,
    backingTokenAmount: BigNumberish,
    recipient: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositYieldBearing(
    targetPool: string,
    yieldTokenAmount: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exitTempusAMM(
    tempusAMM: string,
    lpTokensAmount: BigNumberish,
    principalAmountOutMin: BigNumberish,
    yieldAmountOutMin: BigNumberish,
    toInternalBalances: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exitTempusAMMAndRedeem(
    tempusAMM: string,
    sharesAmount: BigNumberish,
    toBackingToken: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  redeemToBacking(
    targetPool: string,
    sender: string,
    principalAmount: BigNumberish,
    yieldAmount: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeemToYieldBearing(
    targetPool: string,
    sender: string,
    principalAmount: BigNumberish,
    yieldAmount: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    completeExitAndRedeem(
      tempusAMM: string,
      toBackingToken: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    depositAndFix(
      tempusAMM: string,
      tokenAmount: BigNumberish,
      isBackingToken: boolean,
      minTYSRate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    depositAndProvideLiquidity(
      tempusAMM: string,
      tokenAmount: BigNumberish,
      isBackingToken: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    depositBacking(
      targetPool: string,
      backingTokenAmount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    depositYieldBearing(
      targetPool: string,
      yieldTokenAmount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    exitTempusAMM(
      tempusAMM: string,
      lpTokensAmount: BigNumberish,
      principalAmountOutMin: BigNumberish,
      yieldAmountOutMin: BigNumberish,
      toInternalBalances: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    exitTempusAMMAndRedeem(
      tempusAMM: string,
      sharesAmount: BigNumberish,
      toBackingToken: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    redeemToBacking(
      targetPool: string,
      sender: string,
      principalAmount: BigNumberish,
      yieldAmount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    redeemToYieldBearing(
      targetPool: string,
      sender: string,
      principalAmount: BigNumberish,
      yieldAmount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    Deposited(
      pool?: string | null,
      depositor?: string | null,
      recipient?: string | null,
      yieldTokenAmount?: null,
      backingTokenValue?: null,
      shareAmounts?: null,
      interestRate?: null,
      fee?: null
    ): TypedEventFilter<
      [
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ],
      {
        pool: string;
        depositor: string;
        recipient: string;
        yieldTokenAmount: BigNumber;
        backingTokenValue: BigNumber;
        shareAmounts: BigNumber;
        interestRate: BigNumber;
        fee: BigNumber;
      }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    Redeemed(
      pool?: string | null,
      redeemer?: string | null,
      recipient?: string | null,
      principalShareAmount?: null,
      yieldShareAmount?: null,
      yieldTokenAmount?: null,
      backingTokenValue?: null,
      interestRate?: null,
      fee?: null,
      isEarlyRedeem?: null
    ): TypedEventFilter<
      [
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean
      ],
      {
        pool: string;
        redeemer: string;
        recipient: string;
        principalShareAmount: BigNumber;
        yieldShareAmount: BigNumber;
        yieldTokenAmount: BigNumber;
        backingTokenValue: BigNumber;
        interestRate: BigNumber;
        fee: BigNumber;
        isEarlyRedeem: boolean;
      }
    >;
  };

  estimateGas: {
    completeExitAndRedeem(
      tempusAMM: string,
      toBackingToken: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositAndFix(
      tempusAMM: string,
      tokenAmount: BigNumberish,
      isBackingToken: boolean,
      minTYSRate: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositAndProvideLiquidity(
      tempusAMM: string,
      tokenAmount: BigNumberish,
      isBackingToken: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositBacking(
      targetPool: string,
      backingTokenAmount: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositYieldBearing(
      targetPool: string,
      yieldTokenAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exitTempusAMM(
      tempusAMM: string,
      lpTokensAmount: BigNumberish,
      principalAmountOutMin: BigNumberish,
      yieldAmountOutMin: BigNumberish,
      toInternalBalances: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exitTempusAMMAndRedeem(
      tempusAMM: string,
      sharesAmount: BigNumberish,
      toBackingToken: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    redeemToBacking(
      targetPool: string,
      sender: string,
      principalAmount: BigNumberish,
      yieldAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeemToYieldBearing(
      targetPool: string,
      sender: string,
      principalAmount: BigNumberish,
      yieldAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    completeExitAndRedeem(
      tempusAMM: string,
      toBackingToken: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositAndFix(
      tempusAMM: string,
      tokenAmount: BigNumberish,
      isBackingToken: boolean,
      minTYSRate: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositAndProvideLiquidity(
      tempusAMM: string,
      tokenAmount: BigNumberish,
      isBackingToken: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositBacking(
      targetPool: string,
      backingTokenAmount: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositYieldBearing(
      targetPool: string,
      yieldTokenAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exitTempusAMM(
      tempusAMM: string,
      lpTokensAmount: BigNumberish,
      principalAmountOutMin: BigNumberish,
      yieldAmountOutMin: BigNumberish,
      toInternalBalances: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exitTempusAMMAndRedeem(
      tempusAMM: string,
      sharesAmount: BigNumberish,
      toBackingToken: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeemToBacking(
      targetPool: string,
      sender: string,
      principalAmount: BigNumberish,
      yieldAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeemToYieldBearing(
      targetPool: string,
      sender: string,
      principalAmount: BigNumberish,
      yieldAmount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}