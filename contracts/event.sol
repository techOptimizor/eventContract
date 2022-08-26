//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

error EventCreator__EventAlreadyExists();
error EventCreator__EndDateMustBeGreaterThanStartDate();
error EventCreator__EventDateMustBeGreaterThanNow();
error EventCreator__EventDateMustBeGreaterThanPurchaseEndDate();

contract EventCreator {
    //Event information like the price and start and end.
    struct EventInfo {
        uint256 eventDate;
        uint256 purchaseStartDate;
        uint256 purchaseEndDate;
        uint256 ticketPrice;
    }

    mapping(uint256 => address) private eventOwner; // To get and keep track of event creators
    mapping(uint256 => EventInfo) private eventInfo;

    uint256 public eventId; // An id to get an event creator

    string private s_eventName;
    string private s_eventDetails; // Making these offchain would be better to avoid much cost.

    modifier NotCreated() {
        if (eventOwner[eventId] != address(0)) {
            revert EventCreator__EventAlreadyExists();
        }
        _;
    }

    function createEvent(
        uint256 _eventDate,
        uint256 _purchaseStartDate,
        uint256 _ticketPrice,
        uint256 _purchaseEndDate
    ) public NotCreated {
        if (_eventDate < block.timestamp) {
            revert EventCreator__EventDateMustBeGreaterThanNow();
        }
        if (_purchaseStartDate > _purchaseEndDate) {
            revert EventCreator__EndDateMustBeGreaterThanStartDate();
        }
        if (_purchaseEndDate > _eventDate) {
            revert EventCreator__EventDateMustBeGreaterThanPurchaseEndDate();
        }

        eventId++;

        eventInfo[eventId] = EventInfo(
            _eventDate,
            _purchaseStartDate,
            _purchaseEndDate,
            _ticketPrice
        );
        eventOwner[eventId] = msg.sender;
    }

    function getEventName() public view returns (string memory) {
        return s_eventName;
    }

    function getEventDetails() public view returns (string memory) {
        return s_eventDetails;
    }

    function getEventOwner(uint256 _eventId) public view returns (address) {
        return eventOwner[_eventId];
    }

    function getEventInfo(uint256 _eventId)
        public
        view
        returns (EventInfo memory)
    {
        return eventInfo[_eventId];
    }
}
