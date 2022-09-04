import { depositContributor } from "../generated/Pension/Pension";
import { DepositContributor }  from "../generated/schema";

function handleDepositContributor(event: depositContributor): void {

  let id = event.transaction.hash.toHexString()
  let entity = DepositContributor.load(id)

  if (!entity) {
    entity = new DepositContributor(id)
  }
    entity.contributorAddress = event.params.contributorAddress.toHexString()
    entity.contributorAmount = event.params.contributorAmount
    entity.timeDeposit = event.params.timeDeposit
    entity.save()
}

export { handleDepositContributor }