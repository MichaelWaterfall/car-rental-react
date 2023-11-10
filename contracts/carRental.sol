//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

//import "hardhat/console.sol";

contract CarRental {
    address public owner;
    //uint ownerBalance;
    uint public price;
    uint public counter;

    event Deposit(address _from, uint amount);

    constructor(uint _price) {
        owner = msg.sender;
        price = _price;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    struct Renter {
        address payable walletAddress;
        uint id;
        bool canRent;
        bool active;
        bool timer;
        //uint balance;
        uint due;
        uint start;
        uint end;
    }

    mapping(address => Renter) public renters;

    function addRenter() external {
        require(msg.sender != owner, "The owner cannot rent a car");
        counter += 1;
        renters[msg.sender] = Renter(payable(msg.sender), counter, true, false, false, 0, 0, 0);
    }

    function getRenterId() external view returns (uint) {
        return renters[msg.sender].id;
    }

    function changePrice(uint newPrice) public onlyOwner {
        require(newPrice > 0, "Price must be greater than zero");
        price = newPrice;
    }

    function changeOwner(address newOwner) public onlyOwner {
        require(newOwner != owner, "The new owner must be different to the orignal owner");
        require(renterExists(newOwner) == false, "Renter cannot become the owner");
        owner = newOwner;
    }

    // Get Contract Balance

    /*
    function balanceOf() public view returns (uint) {
        return address(this).balance;
    }
    */
    /*
    function getOwnerBalance() view public onlyOwner() returns (uint) {
        return ownerBalance;
    }

    function withdrawOwnerBalance() payable public onlyOwner() {
        payable(owner).transfer(ownerBalance);
    }
    */
    function checkOutCar() external {
        require(renterExists(msg.sender) == true, "Not a renter");
        require(renters[msg.sender].due == 0, "You have a pending balance");
        require(renters[msg.sender].canRent == true, "You cannot rent at this time");
        renters[msg.sender].active = true;
        renters[msg.sender].start = block.timestamp;
        renters[msg.sender].canRent = false;
        renters[msg.sender].timer = true;
    }

    function checkInCar() external {
        require(renters[msg.sender].active == true, "Please check out a car first");
        require(block.timestamp - renters[msg.sender].start > 60, "You must rent a car for a minimum of 1 minute");
        renters[msg.sender].active = false;
        renters[msg.sender].end = block.timestamp;
        renters[msg.sender].timer = false;
        setDue(msg.sender);
    }

    // Get total duration of car use
    function renterTimespan(uint start, uint end) internal pure returns (uint) {
        return end - start;
    }

    function getTotalDuration(address walletAddress) public view returns (uint) {
        uint timespan = renterTimespan(renters[walletAddress].start, renters[walletAddress].end);
        uint timespanInMinutes = timespan / 60;
        return timespanInMinutes;
    }

    // Get Renter's balance
    function balanceOfRenter() public view returns (uint) {
        return address(msg.sender).balance;
    }

    // Set Due amount
    function setDue(address walletAddress) internal {
        uint timespanMinutes = getTotalDuration(walletAddress);
        uint minuteIncrements = timespanMinutes / 1;
        renters[walletAddress].due = minuteIncrements * price;
    }

    function canRentCar(address walletAddress) external view returns (bool) {
        return renters[walletAddress].canRent;
    }

    /* Deposit
    function deposit() public payable {
        emit Deposit(msg.sender, msg.value);
        renters[msg.sender].balance += msg.value;
    }
    */
    // Make Payment
    function makePayment() public payable {
        //console.log("Msg.sender: ", msg.sender);
        require(msg.sender != owner, "Owner cannot make a payment");
        //require(renters[msg.sender].canRent = false, "Please rent a car");
        //require(renters[msg.sender].due > 0, "You do not have anything due at this time");
        uint balance = address(msg.sender).balance;
        require(
            balance >= renters[msg.sender].due,
            "You do not have enough funds to cover payment. Please make a deposit"
        );
        //renters[msg.sender].balance -= renters[msg.sender].due;
        uint payment = renters[msg.sender].due;
        require(msg.value == payment, "Please only send the amount due");
        renters[msg.sender].canRent = true;
        renters[msg.sender].due = 0;
        renters[msg.sender].start = 0;
        renters[msg.sender].end = 0;
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Ether failed to send");
    }

    function getDue(address walletAddress) external view returns (uint) {
        return renters[walletAddress].due;
    }

    function getRenter() external view returns (uint, bool, bool) {
        uint id = renters[msg.sender].id;
        bool canRent = renters[msg.sender].canRent;
        bool active = renters[msg.sender].active;
        return (id, canRent, active);
    }

    function renterExists(address walletAddress) public view returns (bool) {
        if (renters[walletAddress].walletAddress != address(0)) {
            return true;
        }
        return false;
    }

    function getTimer(address walletAddress) public view returns (bool) {
        return renters[walletAddress].timer;
    }
}