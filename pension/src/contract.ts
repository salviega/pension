import { BigInt, Address } from "@graphprotocol/graph-ts"
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
  let id = event.transaction.hash.toHexString()
  let entity = _depositContributor.load(id)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new _depositContributor(id)
    //entity.id = BigInt.fromI32(1);
    // Entity fields can be set using simple assignments
    //entity.contributorAddress = event.params.contributorAddress
  }
    // Entity fields can be set based on event parameters

    entity.contributorAmount = event.params.contributorAmount
    entity.timeDeposit = event.params.timeDeposit.plus(BigInt.fromI32(2))
    entity.contributorAddress = event.params.contributorAddress.toHexString()
    
    // Entities can be written to the store with `.save()`
    entity.save()

}
