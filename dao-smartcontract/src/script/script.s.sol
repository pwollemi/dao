// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "forge-std/Script.sol";
import "../mocks/MockERC20.sol";
import "../Bounty.sol";
import "../Governance/GovernorAlpha.sol";
import "../Governance/Timelock.sol";
import "../ContractFactory.sol";
import "../DAOFactory.sol";
import "../PCECommunityGovToken.sol";

import {console} from "forge-std/console.sol";

contract script is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY_TESTNET");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);


        uint256 pceTokenAmount = 1000000e18;
        uint256 _bountyAmount = 0;

        address PCE_TOKEN = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9;
        Timelock timelock = new Timelock();
        GovernorAlpha gov = new GovernorAlpha();

        Bounty bounty = new Bounty(); // Deploy Bounty Contract
        bounty.initialize(ERC20Upgradeable(PCE_TOKEN), _bountyAmount, address(gov));

        ContractFactory contractFactory = new ContractFactory(deployerAddress);
        DAOFactory daoFactory = new DAOFactory();

        PCECommunityGovToken pceCommunityGovToken = new PCECommunityGovToken();

        daoFactory.setImplementation(address(timelock), address(gov), address(pceCommunityGovToken));

        pceCommunityGovToken.initialize(PCE_TOKEN);

        timelock.initialize(deployerAddress, 1 minutes);

        string memory daoName = "PCE DAO";
        uint256 _votingDelay = 1;
        uint256 _votingPeriod = 3; // 3 blocks
        uint256 _proposalThreshold = 1000e18;
        uint256 _quorumVotes = 2000e18;
        gov.initialize(daoName, address(pceCommunityGovToken), address(timelock), _votingDelay, _votingPeriod, _proposalThreshold, _quorumVotes);
        timelock.setPendingAdmin(address(gov));
        gov.__acceptAdmin();

        console.log("PCE Token: ", PCE_TOKEN);
        console.log("Timelock: ", address(timelock));
        console.log("Governor: ", address(gov));
        console.log("Bounty: ", address(bounty));
        console.log("ContractFactory: ", address(contractFactory));
        console.log("DAOFactory: ", address(daoFactory));
        console.log("PCE Community Gov Token: ", address(pceCommunityGovToken));
    }
}
