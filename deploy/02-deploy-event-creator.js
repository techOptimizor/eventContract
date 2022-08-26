const { getNamedAccounts, deployments, network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    log("Await deployments .............")
    const EventCreator = await deploy("EventCreator", {
        from: deployer,
        log: true,
    })
    log(`Contract deployed to ${EventCreator.address} 🥳🥳`)
}
module.exports.tags = ["all", "eventCreator"]
