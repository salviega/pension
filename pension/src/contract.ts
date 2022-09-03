import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  Approval,
  ApprovalForAll,
  Transfer,
  depositContributor
} from "../generated/Contract/Contract";

import {depositContributor as _depositContributor}  from "../generated/schema";

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransfer(event: Transfer): void {}

export function handledepositContributor(event: depositContributor): void {
    // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = _depositContributor.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new _depositContributor(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    //entity.contributorAddress = event.params.contributorAddress
  }
    // Entity fields can be set based on event parameters

    entity.contributorAmount = entity.contributorAmount.plus(BigInt.fromI32(2))
  
    // Entities can be written to the store with `.save()`
    entity.save()

}