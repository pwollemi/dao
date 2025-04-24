// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {SBT} from "../src/SBT.sol";

contract SBTTest is Test {
    SBT public sbt;

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        sbt = new SBT();
    }

    function test_owner() public view {
        assertEq(address(sbt.owner()), address(this));
    }

    function test_Mint() public {
        sbt.mint(alice);
        assertEq(sbt.balanceOf(alice), 1);
    }

    function test_TransferFrom() public {
        vm.prank(address(this));
        sbt.mint(alice);

        vm.prank(alice);
        vm.expectRevert("SBT: non-transferable");
        sbt.transferFrom(alice, bob, 0);

        vm.prank(alice);
        vm.expectRevert("SBT: non-transferable");
        sbt.safeTransferFrom(alice, bob, 0);
    }
}
