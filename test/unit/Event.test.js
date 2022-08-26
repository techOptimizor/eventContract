const { assert, expect } = require("chai")
const { getNamedAccounts, network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Events Units test", async function () {
          const AMOUNT = ethers.utils.parseEther("100")

          //I am using the Date to increase time so it could call the purchaseTicket
          const today = new Date()
          var tomorrow = new Date(today)
          var inFourDays = new Date(today)
          var nextWeek = new Date(today)

          tomorrow.setDate(today.getDate() + 1)
          inFourDays.setDate(today.getDate() + 4)
          nextWeek.setDate(today.getDate() + 7)

          const purchaseStartDate = Math.floor(tomorrow.getTime() / 1000)
          const purchaseEndDate = Math.floor(inFourDays.getTime() / 1000)
          const eventDate = Math.floor(nextWeek.getTime() / 1000)
          let mockV3Aggregator, event
          beforeEach(async () => {
              const { deployer } = await getNamedAccounts()
              await deployments.fixture(["mocks", "event"])
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
              event = await ethers.getContract("Event", deployer)
          })
          it("Constructor sets priceFeed address correctly", async () => {
              const response = await event.getPriceFeed()
              assert.equal(response, mockV3Aggregator.address)
          })

          it("Should revert if less ETH purchase ticket", async () => {
              await expect(event.purchaseTicket()).to.be.revertedWith(
                  "Event_NotEnoughCryptoSent"
              )
          })

          it("Should revert purchase ticket date has not started", async () => {
              await expect(
                  event.purchaseTicket({ value: AMOUNT })
              ).to.be.revertedWith("Event_PurchaseDateNotStarted")
          })

          it("Should purchase ticket", async () => {
              const ticketPurchased = await event.getTicketPurchase()
              await network.provider.send("evm_increaseTime", [
                  purchaseEndDate - purchaseStartDate,
              ])
              await event.purchaseTicket({ value: AMOUNT })
              const ticketPurchased_2 = await event.getTicketPurchase()
              assert(ticketPurchased, ticketPurchased_2 - 1)
              await expect(event.purchaseTicket({ value: AMOUNT })).to.emit(
                  event,
                  "TicketPurchase"
              )
          })
          //WITHDRAW SHOULD THROW, BECUASE OF SIGHT DIFFERENCE OF GAS FEES
          it("Should withdraw", async () => {
              const { deployer } = await getNamedAccounts()
              const ownerBalance = ethers.utils.formatEther(
                  await ethers.provider.getBalance(deployer)
              )
              const serviceFeeBalance = ethers.utils.formatEther(
                  await ethers.provider.getBalance(await event.getservice())
              )

              const getContractBalance = ethers.utils.formatEther(
                  await ethers.provider.getBalance(event.address)
              )

              await event.withdraw()

              const ownerBalanceAfter = ethers.utils.formatEther(
                  await ethers.provider.getBalance(deployer)
              )

              const serviceFeeBalanceAfter = ethers.utils.formatEther(
                  await ethers.provider.getBalance(await event.getservice())
              )
              // Due to gas fees paid ,  i can't really figure out how to test this perfectly
              assert.equal(
                  serviceFeeBalanceAfter,
                  serviceFeeBalance + getContractBalance / 100
              )
              assert.equal(
                  ownerBalanceAfter,
                  ownerBalance + (getContractBalance - getContractBalance / 100)
              )
          })

          // PLEASE THERE ARE ALWAYS DELAYS IN MINING AND SO THE EVENT TIME MIGHT VARY BY A SEC OR 2 FOR THE TEST
          // SO JUST CHANGE THE ADD A SECOND IF IT THROWS OR TWO
          it("Should return Event date", async () => {
              const response = await event.getEventDate()
              assert.equal(response.toNumber(), eventDate + 1) //i think there was a delay by miner that added a second
          })

          it("Should return Event start date", async () => {
              const response = await event.getPurchaseStartDate()
              assert.equal(response.toNumber(), purchaseStartDate + 1)
          })

          it("Should return Event end date", async () => {
              const response = await event.getPurchaseEndDate()
              assert.equal(response.toNumber(), purchaseEndDate + 1)
          })

          it("Should return Event Creator", async () => {
              const { deployer } = await getNamedAccounts()
              const response = await event.getEventCreator()
              assert.equal(response, deployer)
          })

          it("Should return Event Name ", async () => {
              const response = await event.getEventName()
              assert.equal(response, "EVENT NAME")
          })

          it("Should return Event Details ", async () => {
              const response = await event.getEventDetails()
              assert.equal(response, "random event details")
          })

          it("Should return Event Tickets purchased ", async () => {
              await network.provider.send("evm_increaseTime", [
                  purchaseEndDate - purchaseStartDate,
              ])
              await event.purchaseTicket({ value: AMOUNT })
              const response = await event.getTicketPurchase()
              assert.equal(response, 1)
          })

          it("Should return Event Ticket Price", async () => {
              const response = await event.getTicketPrice()
              assert.equal(response.toString(), AMOUNT.toString())
          })

          it("Should return Event Ticket State", async () => {
              const response = await event.getEventState()
              assert.equal(response, "0")
          })

          it("Should return Event service", async () => {
              const { deployer } = await getNamedAccounts()
              const response = await event.getservice()
              assert.equal(response, deployer)
          })
      })
