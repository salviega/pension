import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  RegisterGeneralBalance,
  RegisterPension,
  RegisterQuote,
  RegisterQuoteRetaired,
  Transfer
} from "../generated/Pension/Pension"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createRegisterGeneralBalanceEvent(
  _generalBalance: ethereum.Tuple
): RegisterGeneralBalance {
  let registerGeneralBalanceEvent = changetype<RegisterGeneralBalance>(
    newMockEvent()
  )

  registerGeneralBalanceEvent.parameters = new Array()

  registerGeneralBalanceEvent.parameters.push(
    new ethereum.EventParam(
      "_generalBalance",
      ethereum.Value.fromTuple(_generalBalance)
    )
  )

  return registerGeneralBalanceEvent
}

export function createRegisterPensionEvent(
  _owner: Address,
  _biologySex: string,
  _age: BigInt,
  _bornAge: BigInt,
  _retirentmentDate: BigInt,
  _pensionCreatedTime: BigInt,
  _pensionId: BigInt
): RegisterPension {
  let registerPensionEvent = changetype<RegisterPension>(newMockEvent())

  registerPensionEvent.parameters = new Array()

  registerPensionEvent.parameters.push(
    new ethereum.EventParam("_owner", ethereum.Value.fromAddress(_owner))
  )
  registerPensionEvent.parameters.push(
    new ethereum.EventParam(
      "_biologySex",
      ethereum.Value.fromString(_biologySex)
    )
  )
  registerPensionEvent.parameters.push(
    new ethereum.EventParam("_age", ethereum.Value.fromUnsignedBigInt(_age))
  )
  registerPensionEvent.parameters.push(
    new ethereum.EventParam(
      "_bornAge",
      ethereum.Value.fromUnsignedBigInt(_bornAge)
    )
  )
  registerPensionEvent.parameters.push(
    new ethereum.EventParam(
      "_retirentmentDate",
      ethereum.Value.fromUnsignedBigInt(_retirentmentDate)
    )
  )
  registerPensionEvent.parameters.push(
    new ethereum.EventParam(
      "_pensionCreatedTime",
      ethereum.Value.fromUnsignedBigInt(_pensionCreatedTime)
    )
  )
  registerPensionEvent.parameters.push(
    new ethereum.EventParam(
      "_pensionId",
      ethereum.Value.fromUnsignedBigInt(_pensionId)
    )
  )

  return registerPensionEvent
}

export function createRegisterQuoteEvent(
  _owner: Address,
  _id: Bytes,
  _dataPension: ethereum.Tuple,
  _contributionDate: BigInt,
  _savingAmount: BigInt,
  _solidaryAmount: BigInt,
  _totalAmount: BigInt
): RegisterQuote {
  let registerQuoteEvent = changetype<RegisterQuote>(newMockEvent())

  registerQuoteEvent.parameters = new Array()

  registerQuoteEvent.parameters.push(
    new ethereum.EventParam("_owner", ethereum.Value.fromAddress(_owner))
  )
  registerQuoteEvent.parameters.push(
    new ethereum.EventParam("_id", ethereum.Value.fromFixedBytes(_id))
  )
  registerQuoteEvent.parameters.push(
    new ethereum.EventParam(
      "_dataPension",
      ethereum.Value.fromTuple(_dataPension)
    )
  )
  registerQuoteEvent.parameters.push(
    new ethereum.EventParam(
      "_contributionDate",
      ethereum.Value.fromUnsignedBigInt(_contributionDate)
    )
  )
  registerQuoteEvent.parameters.push(
    new ethereum.EventParam(
      "_savingAmount",
      ethereum.Value.fromUnsignedBigInt(_savingAmount)
    )
  )
  registerQuoteEvent.parameters.push(
    new ethereum.EventParam(
      "_solidaryAmount",
      ethereum.Value.fromUnsignedBigInt(_solidaryAmount)
    )
  )
  registerQuoteEvent.parameters.push(
    new ethereum.EventParam(
      "_totalAmount",
      ethereum.Value.fromUnsignedBigInt(_totalAmount)
    )
  )

  return registerQuoteEvent
}

export function createRegisterQuoteRetairedEvent(
  _owner: Address,
  _id: Bytes,
  _monthlyQuote: BigInt,
  _quantityQuotes: BigInt,
  _totalPaidQuotes: BigInt,
  _totalPensionValue: BigInt
): RegisterQuoteRetaired {
  let registerQuoteRetairedEvent = changetype<RegisterQuoteRetaired>(
    newMockEvent()
  )

  registerQuoteRetairedEvent.parameters = new Array()

  registerQuoteRetairedEvent.parameters.push(
    new ethereum.EventParam("_owner", ethereum.Value.fromAddress(_owner))
  )
  registerQuoteRetairedEvent.parameters.push(
    new ethereum.EventParam("_id", ethereum.Value.fromFixedBytes(_id))
  )
  registerQuoteRetairedEvent.parameters.push(
    new ethereum.EventParam(
      "_monthlyQuote",
      ethereum.Value.fromUnsignedBigInt(_monthlyQuote)
    )
  )
  registerQuoteRetairedEvent.parameters.push(
    new ethereum.EventParam(
      "_quantityQuotes",
      ethereum.Value.fromUnsignedBigInt(_quantityQuotes)
    )
  )
  registerQuoteRetairedEvent.parameters.push(
    new ethereum.EventParam(
      "_totalPaidQuotes",
      ethereum.Value.fromUnsignedBigInt(_totalPaidQuotes)
    )
  )
  registerQuoteRetairedEvent.parameters.push(
    new ethereum.EventParam(
      "_totalPensionValue",
      ethereum.Value.fromUnsignedBigInt(_totalPensionValue)
    )
  )

  return registerQuoteRetairedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
