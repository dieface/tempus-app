import { BigNumber } from 'ethers';
import getConfig from '../utils/get-config';
import TempusAMMService from './TempusAMMService';
import { DepositedEvent, RedeemedEvent } from './TempusControllerService';
import TempusPoolService from './TempusPoolService';
import { PoolBalanceChangedEvent, SwapEvent } from './VaultService';

/**
 * Type guard - Checks if provided event is of type DepositedEvent
 */
export function isDepositEvent(event: DepositedEvent | RedeemedEvent | SwapEvent): event is DepositedEvent {
  return 'depositor' in event.args;
}

/**
 * Type guard - Checks if provided event is of type RedeemedEvent
 */
export function isRedeemEvent(event: DepositedEvent | RedeemedEvent | SwapEvent): event is RedeemedEvent {
  return 'redeemer' in event.args;
}

/**
 * Type guard - Checks if provided event is of type SwapEvent
 */
export function isSwapEvent(
  event: DepositedEvent | RedeemedEvent | SwapEvent | PoolBalanceChangedEvent,
): event is SwapEvent {
  return 'tokenIn' in event.args;
}

/**
 * Type guard - Checks if provided event is of type SwapEvent
 */
export function isPoolBalanceChangedEvent(
  event: SwapEvent | PoolBalanceChangedEvent,
): event is PoolBalanceChangedEvent {
  return 'liquidityProvider' in event.args;
}

export function getEventPoolAddress(event: DepositedEvent | RedeemedEvent | SwapEvent, amm: TempusAMMService): string {
  if (isDepositEvent(event) || isRedeemEvent(event)) {
    return event.args.pool;
  }
  if (isSwapEvent(event)) {
    return amm.getTempusPoolAddressFromId(event.args.poolId);
  }

  throw new Error('EventUtils - getEventPoolAddress() - Invalid event type!');
}

export function getEventBackingTokenValue(
  event: DepositedEvent | RedeemedEvent | SwapEvent,
  principalsAddress: string,
): BigNumber {
  if (isDepositEvent(event) || isRedeemEvent(event)) {
    return event.args.backingTokenValue;
  }
  if (isSwapEvent(event)) {
    // If tokenIn is principal token, return amountIn as an event value, otherwise return amountOut as an event value.
    return event.args.tokenIn === principalsAddress ? event.args.amountIn : event.args.amountOut;
  }

  throw new Error('EventUtils - getEventBackingTokenValue() - Invalid event type!');
}
