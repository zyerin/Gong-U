// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract PayContract {
    event PaymentSent(address indexed from, address indexed to, uint256 value);
    event ReservationMade(address indexed user, address indexed host, uint256 checkInDate, uint256 checkOutDate, uint256 totalPrice, string terms, bool confidentialityAgreement);

    struct Reservation {
        address user;
        address host;
        uint256 checkInDate;
        uint256 checkOutDate;
        uint256 totalPrice;
        string terms;
        bool confidentialityAgreement;
    }

    Reservation[] public reservations;

    // Function to reserve and pay
    function ReserveAndPay(
        address payable hostContractAddress,
        uint256 checkInDate,
        uint256 checkOutDate,
        string memory terms,
        bool confidentialityAgreement
    ) public payable {
        require(msg.value > 0, "Value must be greater than 0");
        require(hostContractAddress != address(0), "Invalid host contract address");

        hostContractAddress.transfer(msg.value);

        reservations.push(Reservation({
            user: msg.sender,
            host: hostContractAddress,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            totalPrice: msg.value,
            terms: terms,
            confidentialityAgreement: confidentialityAgreement
        }));

        emit PaymentSent(msg.sender, hostContractAddress, msg.value);
        emit ReservationMade(msg.sender, hostContractAddress, checkInDate, checkOutDate, msg.value, terms, confidentialityAgreement);
    }


    function RefundAndPay(address payable ContractAddress) public payable {
        //require(msg.value > 0, "Value must be greater than 0");
        //require(hostContractAddress != address(0), "Invalid host contract address");

        ContractAddress.transfer(msg.value);

        emit PaymentSent(msg.sender, ContractAddress, msg.value);
    }


    function withdraw() public {
        address payable owner = payable(msg.sender);
        owner.transfer(address(this).balance);
    }

    function getReservations() public view returns (Reservation[] memory) {
        return reservations;
    }
}
