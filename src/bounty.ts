import {
  AddedContributorBounty as AddedContributorBountyEvent,
  AddedProposalBounty as AddedProposalBountyEvent,
  ClaimedBounty as ClaimedBountyEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  UpdatedBountyAmount as UpdatedBountyAmountEvent
} from "../generated/Bounty/Bounty"
import {
  AddedContributorBounty,
  AddedProposalBounty,
  ClaimedBounty,
  Initialized,
  OwnershipTransferred,
  UpdatedBountyAmount
} from "../generated/schema"

export function handleAddedContributorBounty(
  event: AddedContributorBountyEvent
): void {
  let entity = new AddedContributorBounty(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.contributor = event.params.contributor
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAddedProposalBounty(
  event: AddedProposalBountyEvent
): void {
  let entity = new AddedProposalBounty(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.proposalId = event.params.proposalId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClaimedBounty(event: ClaimedBountyEvent): void {
  let entity = new ClaimedBounty(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdatedBountyAmount(
  event: UpdatedBountyAmountEvent
): void {
  let entity = new UpdatedBountyAmount(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bountyAmount = event.params.bountyAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
