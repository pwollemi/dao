import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AddedContributorBounty,
  AddedProposalBounty,
  ClaimedBounty,
  Initialized,
  OwnershipTransferred,
  UpdatedBountyAmount
} from "../generated/Bounty/Bounty"

export function createAddedContributorBountyEvent(
  user: Address,
  contributor: Address,
  amount: BigInt
): AddedContributorBounty {
  let addedContributorBountyEvent =
    changetype<AddedContributorBounty>(newMockEvent())

  addedContributorBountyEvent.parameters = new Array()

  addedContributorBountyEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  addedContributorBountyEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor)
    )
  )
  addedContributorBountyEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return addedContributorBountyEvent
}

export function createAddedProposalBountyEvent(
  user: Address,
  proposalId: BigInt,
  amount: BigInt
): AddedProposalBounty {
  let addedProposalBountyEvent = changetype<AddedProposalBounty>(newMockEvent())

  addedProposalBountyEvent.parameters = new Array()

  addedProposalBountyEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  addedProposalBountyEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  addedProposalBountyEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return addedProposalBountyEvent
}

export function createClaimedBountyEvent(
  user: Address,
  amount: BigInt
): ClaimedBounty {
  let claimedBountyEvent = changetype<ClaimedBounty>(newMockEvent())

  claimedBountyEvent.parameters = new Array()

  claimedBountyEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  claimedBountyEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return claimedBountyEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createUpdatedBountyAmountEvent(
  bountyAmount: BigInt
): UpdatedBountyAmount {
  let updatedBountyAmountEvent = changetype<UpdatedBountyAmount>(newMockEvent())

  updatedBountyAmountEvent.parameters = new Array()

  updatedBountyAmountEvent.parameters.push(
    new ethereum.EventParam(
      "bountyAmount",
      ethereum.Value.fromUnsignedBigInt(bountyAmount)
    )
  )

  return updatedBountyAmountEvent
}
