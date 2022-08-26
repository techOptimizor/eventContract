const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {developmentChains, networkConfig} = require("../../helper-hardhat.config");

!developmentChains.includes(network.name) ? describe.skip : describe("Event Unit Tests", async function () {
    let event, deployer, mockV3Aggregator;
    const chainId = network.config.chainId;


    beforeEach(async function () {
        deployer= (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        event = await ethers.getContract("Event", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer);
    })

    describe("constructor", function () {
        it("initializes Event correctly", async function () {
            const eventState = await event.getEventState();

            const eventDate = await event.getEventDate();
            const purchaseStartDate = await event.getPurchaseStartDate();
            const purchaseEndDate = await event.getPurchaseEndDate();
            
            const ticketPrice = await event.getTicketPrice();
            const ticketPurchased = await event.getTicketPurchased();

            const eventCreator = await event.getEventCreator();
            const service = await event.getService();

            const eventName = await event.getEventName();
            const eventDetails = await event.getEventDetails();

            const priceFeed = await event.getPriceFeed();

            assert.equal(eventState.toString(), '0');

            // make sure all are conforming with deploy script
            assert(purchaseEndDate > purchaseStartDate);
            assert(eventDate > purchaseStartDate && eventDate > purchaseEndDate);
            assert.deepEqual(ticketPrice, ethers.utils.parseEther("100")); // make sure it conforms with deploy script
            assert.equal(ticketPurchased, 0);
            assert.equal(eventCreator, deployer);
            assert.equal(service, deployer);
            assert.equal(eventName, "EVENT NAME");
            assert.equal(eventDetails, "random event details");
            assert.equal(priceFeed, mockV3Aggregator.address);
        })
    })

    describe("update Functions", function () {
        
        const now = new Date();
        var yesterday = new Date(now);
        var inThreeDays = new Date(now);
        var fortnight = new Date(now);
        
        yesterday.setDate(now.getDate() - 1);
        inThreeDays.setDate(now.getDate() + 3)
        fortnight.setDate(now.getDate() +14);
        it("only owner can call update functions", async function () {
            const accounts = await ethers.getSigners();
            const notOwner = accounts[1];
            const notOwnerConnectedEventContract = await event.connect(notOwner);
            await expect(notOwnerConnectedEventContract.updateEventDate(1)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(notOwnerConnectedEventContract.updatePurchaseStartDate(1)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(notOwnerConnectedEventContract.updatePurchaseEndDate(1)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(notOwnerConnectedEventContract.updateTicketPrice(1)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(notOwnerConnectedEventContract.updateEventName("fake name")).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(notOwnerConnectedEventContract.updateEventDetails("fake details")).to.be.revertedWith("Ownable: caller is not the owner");

        })
        it("does not update eventDate when not after purchaseEndDate", async function () {
            await expect(event.updateEventDate(Math.floor(inThreeDays.getTime() / 1000))).to.be.revertedWith("must be after purchaseEndDate");
        })
        it("correctly updates eventDate", async function () {
            
        })
    })

    // describe("purchaseTicket", function () {
    //     it("reverts when not enough sent", async function () {
    //     })
    //     it("reverts when purchase date has passed", async function () {
            
    //     })
    //     it("reverts when purchase date has not started", async function () {
            
    //     })
    // })
});