import { BigInt, BigDecimal, Address, ethereum } from "@graphprotocol/graph-ts"
import { Token, Pair } from "../generated/schema"
import {
  ERC20
} from "../generated/Contract/ERC20"

import {
  Contract
} from "../generated/Contract/Contract"

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')

export function createToken(address: Address): void {
  let token = Token.load(address.toHexString())
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (token === null) {
    token = new Token(address.toHexString())
    // Entity fields can be set using simple assignments
    let tokenContract = ERC20.bind(address)
    token.symbol = tokenContract.symbol()
    token.name = tokenContract.name()
    token.decimals = BigInt.fromI32(tokenContract.decimals())
    token.totalSupply = tokenContract.totalSupply()
    token.tradeVolume = ZERO_BD
    token.tradeVolumeUSD = ZERO_BD
    token.txCount = ZERO_BI
    token.totalLiquidity = ZERO_BD
    token.save()
  }
}

export function createPair(address: Address, event: ethereum.Event): void {
  let pair = Pair.load(address.toHexString())
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (pair === null) {
    pair = new Pair(address.toHexString())
    // Entity fields can be set using simple assignments
    let contract = Contract.bind(event.address)
    let baseTokenAddress = contract._BASE_TOKEN_()
    let quoteTokenAddress = contract._QUOTE_TOKEN_()
    createToken(baseTokenAddress)
    createToken(quoteTokenAddress)

    pair.baseToken = baseTokenAddress.toHexString();
    pair.quoteToken = quoteTokenAddress.toHexString();

    pair.createdAtTimestamp = event.block.timestamp
    pair.createdAtBlockNumber = event.block.number
    pair.save()
  }
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

