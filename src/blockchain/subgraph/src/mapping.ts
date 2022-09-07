import {
  RegisterGeneralBalance,
  RegisterPension,
  RegisterQuote,
  RegisterQuoteRetaired,
} from "../generated/Pension/Pension"
import { DataPension, ContributorQuote, RetairedQuote, GeneralBalance } from "../generated/schema"

export function handleDataPension(event: RegisterPension): void {
  
  let id = event.params._pensionId.toString()
  let entity = DataPension.load(id)

  if (!entity) entity = new DataPension(id)
  
  entity.owner = event.params._owner.toHexString()
  entity.biologySex = event.params._biologySex
  entity.age = event.params._age
  entity.bornAge = event.params._bornAge
  entity.retirentmentData = event.params._retirentmentDate
  entity.pensionCreatedTime = event.params._pensionCreatedTime
  entity.save()
}

export function handleContributorQuote(event: RegisterQuote): void {

  let id = event.params._id.toHexString()
  let entity = ContributorQuote.load(id)

  if (!entity) entity = new ContributorQuote(id)

  entity.owner = event.params._dataPension.owner.toHexString()
  entity.pension = event.params._dataPension.owner.toHexString()
  entity.contributionDate = event.params._contributionDate
  entity.savingAmount = event.params._savingAmount
  entity.solidaryAmount = event.params._solidaryAmount
  entity.totalAmount = event.params._totalAmount
  entity.save()

}

export function handleRetairedQuote(event: RegisterQuoteRetaired): void {
  
  let id = event.transaction.hash.toHexString()
  let entity = RetairedQuote.load(id)

  if (!entity) entity = new RetairedQuote(id)

  entity.owner = event.params._owner.toHexString()
  entity.monthlyQuote = event.params._monthlyQuote
  entity.quantityQuote = event.params._quantityQuotes
  entity.totalPaidQuotes = event.params._totalPaidQuotes
  entity.totalPensionValue = event.params._totalPensionValue
  entity.save()
}

// export function handleGeneralBalance(event: RegisterGeneralBalance): void {

//   let id = event.transaction.hash.toHexString()
//   let entity = GeneralBalance.load(id)

//   if (!entity) entity = new GeneralBalance(id)

//   entity.totalAmount = event.params._generalBalance.totalAmount
//   entity.totalToPay = event.params._generalBalance.totalAmount
//   entity.solvent = event.params._generalBalance.solvent
//   entity.retairedRecords = event.params._generalBalance.retairedRecords
//   entity.retairedRecords = event.params._generalBalance.monthlyRecords 
//   entity.save()
// }

