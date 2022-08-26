const { getNamedAccounts, deployments, network, ethers } = require("hardhat");
const { developmentChains, networkConfig, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat.config");
const { verify } = require("../utils/verify")

// hre.deployments
module.exports = async ({getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    var priceFeedAddress;
    if (developmentChains.includes(network.name)){
        const aggregator = await deployments.get("MockV3Aggregator");
        priceFeedAddress = aggregator.address;
    }
    else {
        priceFeedAddress = networkConfig[chainId]["priceFeed"]
    }

    const today = new Date();
    var tomorrow = new Date(today);
    var inFourDays = new Date(today);
    var nextWeek = new Date(today);

    tomorrow.setDate(today.getDate() + 1)
    inFourDays.setDate(today.getDate() + 4)
    nextWeek.setDate(today.getDate() +7)

    const eventDate = Math.floor(nextWeek.getTime() / 1000);
    const purchaseStartDate = Math.floor(tomorrow.getTime() / 1000);
    const purchaseEndDate = Math.floor(inFourDays.getTime() / 1000);
    const ticketPrice = ethers.utils.parseEther("100"); //100usd i.e 100 * 1e18
    const eventCreator = deployer;
    // IMPORTANT DON'T FORGET TO CHANGE SERVICE ADDRESS WHEN DOING REAL NET
    const service = developmentChains.includes(network.name) ? deployer : deployer
    const eventName = "EVENT NAME";
    const eventDetails = "random event details";
    const args = [eventDate, purchaseStartDate, purchaseEndDate, ticketPrice, eventCreator, service, priceFeedAddress, eventName, eventDetails]
    console.log("Deploying contract")
    const event = await deploy("Event", {
        from: deployer,
        args:args,
        log:true,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS,
    });

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(event.address, args)
    }
    console.log("------------------------------------")
}

module.exports.tags = ["all", "event"]