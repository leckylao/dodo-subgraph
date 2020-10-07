import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import {
  Contract,
  BuyBaseToken,
  ChargeMaintainerFee,
  ChargePenalty,
  ClaimAssets,
  Deposit,
  Donate,
  OwnershipTransferPrepared,
  OwnershipTransferred,
  SellBaseToken,
  UpdateGasPriceLimit,
  UpdateK,
  UpdateLiquidityProviderFeeRate,
  UpdateMaintainerFeeRate,
  Withdraw
} from "../generated/Contract/Contract"
import { Pair, Token } from "../generated/schema"
import {
  createPair,
  createToken,
  ONE_BI,
  convertTokenToDecimal
} from './helpers'

export function handleBuyBaseToken(event: BuyBaseToken): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  createPair(event.address, event)
  let pair = Pair.load(event.address.toHexString())

  let baseToken = Token.load(pair.baseToken)
  let quoteToken = Token.load(pair.quoteToken)

  let baseTokenDecimals = baseToken.decimals
  let quoteTokenDecimals = quoteToken.decimals

  let contract = Contract.bind(event.address)

  // Entity fields can be set based on event parameters
  baseToken.tradeVolume = baseToken.tradeVolume + convertTokenToDecimal(event.params.receiveBase, baseTokenDecimals)
  baseToken.tradeVolumeUSD = baseToken.tradeVolumeUSD + convertTokenToDecimal(event.params.payQuote, quoteTokenDecimals)
  baseToken.txCount = baseToken.txCount + ONE_BI
  baseToken.totalLiquidity = baseToken.totalLiquidity + convertTokenToDecimal(contract._BASE_BALANCE_(), baseTokenDecimals)
  baseToken.save()

  quoteToken.tradeVolume = quoteToken.tradeVolume + convertTokenToDecimal(event.params.payQuote, quoteTokenDecimals)
  quoteToken.tradeVolumeUSD = quoteToken.tradeVolumeUSD + convertTokenToDecimal(event.params.payQuote, quoteTokenDecimals)
  quoteToken.txCount = quoteToken.txCount + ONE_BI
  quoteToken.totalLiquidity = quoteToken.totalLiquidity + convertTokenToDecimal(contract._QUOTE_BALANCE_(), quoteTokenDecimals)
  quoteToken.save()

  let midPrice = contract.getMidPrice()
  if (midPrice !== null){
    pair.midPrice = convertTokenToDecimal(midPrice, BigInt.fromI32(6))
  }
  pair.volumeBaseToken = pair.volumeBaseToken + convertTokenToDecimal(event.params.receiveBase, baseTokenDecimals)
  pair.volumeQuoteToken = pair.volumeQuoteToken + convertTokenToDecimal(event.params.payQuote, quoteTokenDecimals)
  pair.txCount = pair.txCount + ONE_BI

  // Entities can be written to the store with `.save()`
  pair.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract._BASE_BALANCE_(...)
  // - contract._BASE_CAPITAL_RECEIVE_QUOTE_(...)
  // - contract._BASE_CAPITAL_TOKEN_(...)
  // - contract._BASE_TOKEN_(...)
  // - contract._CLAIMED_(...)
  // - contract._CLOSED_(...)
  // - contract._DEPOSIT_BASE_ALLOWED_(...)
  // - contract._DEPOSIT_QUOTE_ALLOWED_(...)
  // - contract._GAS_PRICE_LIMIT_(...)
  // - contract._K_(...)
  // - contract._LP_FEE_RATE_(...)
  // - contract._MAINTAINER_(...)
  // - contract._MT_FEE_RATE_(...)
  // - contract._NEW_OWNER_(...)
  // - contract._ORACLE_(...)
  // - contract._OWNER_(...)
  // - contract._QUOTE_BALANCE_(...)
  // - contract._QUOTE_CAPITAL_RECEIVE_BASE_(...)
  // - contract._QUOTE_CAPITAL_TOKEN_(...)
  // - contract._QUOTE_TOKEN_(...)
  // - contract._R_STATUS_(...)
  // - contract._SUPERVISOR_(...)
  // - contract._TARGET_BASE_TOKEN_AMOUNT_(...)
  // - contract._TARGET_QUOTE_TOKEN_AMOUNT_(...)
  // - contract._TRADE_ALLOWED_(...)
  // - contract.buyBaseToken(...)
  // - contract.depositBase(...)
  // - contract.depositBaseTo(...)
  // - contract.depositQuote(...)
  // - contract.depositQuoteTo(...)
  // - contract.getBaseCapitalBalanceOf(...)
  // - contract.getExpectedTarget(...)
  // - contract.getLpBaseBalance(...)
  // - contract.getLpQuoteBalance(...)
  // - contract.getMidPrice(...)
  // - contract.getOraclePrice(...)
  // - contract.getQuoteCapitalBalanceOf(...)
  // - contract.getTotalBaseCapital(...)
  // - contract.getTotalQuoteCapital(...)
  // - contract.getWithdrawBasePenalty(...)
  // - contract.getWithdrawQuotePenalty(...)
  // - contract.queryBuyBaseToken(...)
  // - contract.querySellBaseToken(...)
  // - contract.sellBaseToken(...)
  // - contract.version(...)
  // - contract.withdrawAllBase(...)
  // - contract.withdrawAllBaseTo(...)
  // - contract.withdrawAllQuote(...)
  // - contract.withdrawAllQuoteTo(...)
  // - contract.withdrawBase(...)
  // - contract.withdrawBaseTo(...)
  // - contract.withdrawQuote(...)
  // - contract.withdrawQuoteTo(...)
}

export function handleChargeMaintainerFee(event: ChargeMaintainerFee): void {}

export function handleChargePenalty(event: ChargePenalty): void {}

export function handleClaimAssets(event: ClaimAssets): void {}

export function handleDeposit(event: Deposit): void {}

export function handleDonate(event: Donate): void {}

export function handleOwnershipTransferPrepared(
  event: OwnershipTransferPrepared
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleSellBaseToken(event: SellBaseToken): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  createPair(event.address, event)
  let pair = Pair.load(event.address.toHexString())

  let baseToken = Token.load(pair.baseToken)
  let quoteToken = Token.load(pair.quoteToken)
  let baseTokenDecimals = baseToken.decimals
  let quoteTokenDecimals = quoteToken.decimals

  let contract = Contract.bind(event.address)
  // Entity fields can be set based on event parameters
  baseToken.tradeVolume = baseToken.tradeVolume + convertTokenToDecimal(event.params.payBase, baseTokenDecimals)
  baseToken.tradeVolumeUSD = baseToken.tradeVolumeUSD + convertTokenToDecimal(event.params.receiveQuote, quoteTokenDecimals)
  baseToken.txCount = baseToken.txCount + ONE_BI
  baseToken.totalLiquidity = baseToken.totalLiquidity + convertTokenToDecimal(contract._BASE_BALANCE_(), baseTokenDecimals)
  baseToken.save()

  quoteToken.tradeVolume = quoteToken.tradeVolume + convertTokenToDecimal(event.params.receiveQuote, quoteTokenDecimals)
  quoteToken.tradeVolumeUSD = quoteToken.tradeVolumeUSD + convertTokenToDecimal(event.params.receiveQuote, quoteTokenDecimals)
  quoteToken.txCount = quoteToken.txCount + ONE_BI
  quoteToken.totalLiquidity = quoteToken.totalLiquidity + convertTokenToDecimal(contract._QUOTE_BALANCE_(), quoteTokenDecimals)
  quoteToken.save()

  let midPrice = contract.getMidPrice()
  if (midPrice !== null){
    pair.midPrice = convertTokenToDecimal(midPrice, BigInt.fromI32(6))
  }
  pair.volumeBaseToken = pair.volumeBaseToken + convertTokenToDecimal(event.params.payBase, baseTokenDecimals)
  pair.volumeQuoteToken = pair.volumeQuoteToken + convertTokenToDecimal(event.params.receiveQuote, quoteTokenDecimals)
  pair.txCount = pair.txCount + ONE_BI

  // Entities can be written to the store with `.save()`
  pair.save()
}

export function handleUpdateGasPriceLimit(event: UpdateGasPriceLimit): void {}

export function handleUpdateK(event: UpdateK): void {}

export function handleUpdateLiquidityProviderFeeRate(
  event: UpdateLiquidityProviderFeeRate
): void {}

export function handleUpdateMaintainerFeeRate(
  event: UpdateMaintainerFeeRate
): void {}

export function handleWithdraw(event: Withdraw): void {}
