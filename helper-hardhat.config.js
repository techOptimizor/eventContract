const { ethers } = require("hardhat");

const networkConfig = {
    4: {
        name: "rinkeby",
        priceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e", // ETH / USD
    },
    80001: {
        name: "mumbai",
        priceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada" // MATIC / USD
    },
    31337: {
        name: "hardhat",
    }

}

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    DECIMALS,
    INITIAL_ANSWER
}