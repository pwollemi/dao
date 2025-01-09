import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AddedContributorBounty } from "../generated/schema"
import { AddedContributorBounty as AddedContributorBountyEvent } from "../generated/Bounty/Bounty"
import { handleAddedContributorBounty } from "../src/bounty"
import { createAddedContributorBountyEvent } from "./bounty-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let contributor = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newAddedContributorBountyEvent = createAddedContributorBountyEvent(
      user,
      contributor,
      amount
    )
    handleAddedContributorBounty(newAddedContributorBountyEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AddedContributorBounty created and stored", () => {
    assert.entityCount("AddedContributorBounty", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AddedContributorBounty",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AddedContributorBounty",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contributor",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AddedContributorBounty",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
