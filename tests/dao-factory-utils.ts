import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  ContractDeployed,
  DAOCreated,
  DAOSocialConfigUpdated,
  OwnershipTransferred
} from "../generated/DAOFactory/DAOFactory"

export function createContractDeployedEvent(
  contractAddress: Address
): ContractDeployed {
  let contractDeployedEvent = changetype<ContractDeployed>(newMockEvent())

  contractDeployedEvent.parameters = new Array()

  contractDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )

  return contractDeployedEvent
}

export function createDAOCreatedEvent(
  daoId: Bytes,
  description: string,
  website: string,
  linkedin: string,
  twitter: string,
  telegram: string,
  name: string,
  governor: Address,
  timelock: Address,
  governanceToken: Address,
  communityToken: Address
): DAOCreated {
  let daoCreatedEvent = changetype<DAOCreated>(newMockEvent())

  daoCreatedEvent.parameters = new Array()

  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("daoId", ethereum.Value.fromFixedBytes(daoId))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("website", ethereum.Value.fromString(website))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("linkedin", ethereum.Value.fromString(linkedin))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("twitter", ethereum.Value.fromString(twitter))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("telegram", ethereum.Value.fromString(telegram))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("governor", ethereum.Value.fromAddress(governor))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam("timelock", ethereum.Value.fromAddress(timelock))
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "governanceToken",
      ethereum.Value.fromAddress(governanceToken)
    )
  )
  daoCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "communityToken",
      ethereum.Value.fromAddress(communityToken)
    )
  )

  return daoCreatedEvent
}

export function createDAOSocialConfigUpdatedEvent(
  daoId: Bytes,
  description: string,
  website: string,
  linkedin: string,
  twitter: string,
  telegram: string
): DAOSocialConfigUpdated {
  let daoSocialConfigUpdatedEvent =
    changetype<DAOSocialConfigUpdated>(newMockEvent())

  daoSocialConfigUpdatedEvent.parameters = new Array()

  daoSocialConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("daoId", ethereum.Value.fromFixedBytes(daoId))
  )
  daoSocialConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  daoSocialConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("website", ethereum.Value.fromString(website))
  )
  daoSocialConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("linkedin", ethereum.Value.fromString(linkedin))
  )
  daoSocialConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("twitter", ethereum.Value.fromString(twitter))
  )
  daoSocialConfigUpdatedEvent.parameters.push(
    new ethereum.EventParam("telegram", ethereum.Value.fromString(telegram))
  )

  return daoSocialConfigUpdatedEvent
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
