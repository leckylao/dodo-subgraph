import { BigInt } from "@graphprotocol/graph-ts"
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
import { ExampleEntity } from "../generated/schema"

export function handleBuyBaseToken(event: BuyBaseToken): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.buyer = event.params.buyer
  entity.receiveBase = event.params.receiveBase
  entity.payQuote = event.params.payQuote

  let contract = Contract.bind(event.address)
  entity.midPrice = contract.getMidPrice()

  // Entities can be written to the store with `.save()`
  entity.save()

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

export function handleSellBaseToken(event: SellBaseToken): void {}

export function handleUpdateGasPriceLimit(event: UpdateGasPriceLimit): void {}

export function handleUpdateK(event: UpdateK): void {}

export function handleUpdateLiquidityProviderFeeRate(
  event: UpdateLiquidityProviderFeeRate
): void {}

export function handleUpdateMaintainerFeeRate(
  event: UpdateMaintainerFeeRate
): void {}

export function handleWithdraw(event: Withdraw): void {}
