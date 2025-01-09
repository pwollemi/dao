import {
  ContractDeployed as ContractDeployedEvent,
  DAOCreated as DAOCreatedEvent,
  DAOSocialConfigUpdated as DAOSocialConfigUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/DAOFactory/DAOFactory"
import {
  ContractDeployed,
  DAOCreated,
  DAOSocialConfigUpdated,
  OwnershipTransferred,
} from "../generated/schema"

export function handleContractDeployed(event: ContractDeployedEvent): void {
  let entity = new ContractDeployed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.contractAddress = event.params.contractAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDAOCreated(event: DAOCreatedEvent): void {
  let entity = new DAOCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.daoId = event.params.daoId
  entity.description = event.params.description
  entity.website = event.params.website
  entity.linkedin = event.params.linkedin
  entity.twitter = event.params.twitter
  entity.telegram = event.params.telegram
  entity.name = event.params.name
  entity.governor = event.params.governor
  entity.timelock = event.params.timelock
  entity.governanceToken = event.params.governanceToken
  entity.communityToken = event.params.communityToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDAOSocialConfigUpdated(
  event: DAOSocialConfigUpdatedEvent,
): void {
  let entity = new DAOSocialConfigUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.daoId = event.params.daoId
  entity.description = event.params.description
  entity.website = event.params.website
  entity.linkedin = event.params.linkedin
  entity.twitter = event.params.twitter
  entity.telegram = event.params.telegram

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
