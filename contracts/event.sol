//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

error EventCreator__EventAlreadyExists();

contract EventCreator {
    //Event information like the price and start and end.
    struct EventInfo {
        uint256 eventDate;
        uint256 purchaseStartDate;
        uint256 purchaseEndDate;
        uint256 ticketPrice;
    }

    mapping(uint256 => address) private eventOwner; // To get and keep track of event creators

    uint256 public eventId; // An id to get an event creator

    string private s_eventName;
    string private s_eventDetails;

    modifier NotCreated(uint256 _eventId) {
        if (eventOwner[_eventId] != address(0)) {
            revert EventCreator__EventAlreadyExists();
        }
        _;
    }

    function createEvent(
        uint256 _eventDate,
        uint256 _purchaseStartDate,
        uint256 _ticketPrice,
        uint256 _purchaseEndDate,
        uint256 _eventId
    ) public NotCreated(_eventId) {
        EventInfo(
            _eventDate,
            _purchaseStartDate,
            _purchaseEndDate,
            _ticketPrice
        );
        eventOwner[_eventId] = msg.sender;
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
}
