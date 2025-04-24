// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../Campaigns.sol";
import "../PCEGovTokenTest.sol";

contract CampaignsScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        SBT sbt = new SBT();
        sbt.setMinter(address(this));

        Campaigns campaigns = new Campaigns();
        campaigns.initialize(
            ERC20Upgradeable(address(0x8d4d8C9192C7df57840129D71c18ED49dda7Fe33)),
            sbt
        );

        Campaigns.Campaign memory campaign = Campaigns.Campaign({
            title: "Test Campaign",
            description: "Test Description",
            amount: 10e18,
            startDate: block.timestamp + 100,
            endDate: block.timestamp + 1000,
            validateSignatures: true,
            isNFT: false
        });
        campaigns.createCampaign(campaign);
        campaigns.createCampaign(campaign);

        vm.roll(block.number + 1);

        Campaigns.Campaign memory _campaign = Campaigns.Campaign({
            title: "Test Campaign",
            description: "Test Description",
            amount: 10e18,
            startDate: block.timestamp + 100,
            endDate: block.timestamp + 1000,
            validateSignatures: false,
            isNFT: false
        });
        campaigns.createCampaign(_campaign);
        campaigns.createCampaign(_campaign);

        vm.roll(block.number + 1);

        campaigns.createCampaign(
            Campaigns.Campaign({
                title: "Test Campaign",
                description: "Test Description",
                amount: 10e18,
                startDate: block.timestamp + 100,
                endDate: block.timestamp + 1000,
                validateSignatures: false,
                isNFT: true
            })
        );

        campaigns.createCampaign(
            Campaigns.Campaign({
                title: "Test Campaign",
                description: "Test Description",
                amount: 10e18,
                startDate: block.timestamp + 100,
                endDate: block.timestamp + 1000,
                validateSignatures: false,
                isNFT: true
            })
        );

        campaigns.createCampaign(
            Campaigns.Campaign({
                title: "Airdrop Announcement: PCE Tokens for Top 10 Holders",
                description: "The Peace Coin Foundation is pleased to announce an exclusive airdrop of PCE tokens to the top 10 PCE token holders. A snapshot of eligible wallets will be taken on February 25, 2025. Stay tuned for more details and ensure your holdings are up to date!",
                amount: 10e18,
                startDate: block.timestamp + 100,
                endDate: block.timestamp + 10000,
                validateSignatures: false,
                isNFT: true
            })
        );

        campaigns.createCampaign(
            Campaigns.Campaign({
                title: "Airdrop Announcement: PCE Tokens for Top 10 Holders",
                description: "The Peace Coin Foundation is pleased to announce an exclusive airdrop of PCE tokens to the top 10 PCE token holders. A snapshot of eligible wallets will be taken on February 25, 2025. Stay tuned for more details and ensure your holdings are up to date!",
                amount: 10e18,
                startDate: block.timestamp + 100,
                endDate: block.timestamp + 10000,
                validateSignatures: false,
                isNFT: true
            })
        );

        address[] memory winners = new address[](2);
        winners[0] = 0x6fD12d4d7E8e1D3E5EE6B3A6e8c7DD426Bb24BF5;
        winners[1] = 0x59178bAc7A9BBfa287F39887EAA2826666f14A2a;

        bytes32[] memory gist = new bytes32[](1);
        gist[0] = keccak256(abi.encodePacked("pwollemi"));

        vm.roll(block.number + 1);
        campaigns.addCampWinners(0, winners, gist);
        campaigns.addCampWinners(1, winners, gist);

        vm.roll(block.number + 1);
        campaigns.addCampWinners(3, winners, gist);
        campaigns.addCampWinners(4, winners, gist);
        campaigns.addCampWinners(5, winners, gist);

        vm.roll(block.number + 1);
        campaigns.addCampWinners(7, winners, gist);
        campaigns.addCampWinners(6, winners, gist);

        console.log("Campaigns deployed at", address(campaigns));
        console.log("SBT deployed at", address(sbt));
        vm.stopBroadcast();
    }
}
