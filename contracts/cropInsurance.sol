// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CropInsurance {
    address public owner;

    struct Policy {
        address farmer;
        string farmName;
        uint256 lat;              // Latitude (multiplied by 1e6 for precision)
        uint256 lng;              // Longitude (multiplied by 1e6 for precision)
        uint256 acreage;
        string riskType;
        uint256 rainfallThreshold;
        uint256 startDate;
        uint256 endDate;
        uint256 premiumPaid;
        uint256 payout;           // Payout amount (multiplied by 30)
        uint8 status;             // 0: active, 1: claimed, 2: inactive
    }

    uint256 public policyCounter;
    mapping(uint256 => Policy) public policies;
    mapping(address => uint256[]) private farmerPolicies; // Tracks farmer's policy IDs

    event PolicyCreated(uint256 indexed policyId, address indexed farmer, uint256 premiumPaid);
    event PayoutIssued(uint256 indexed policyId, address indexed farmer, uint256 payoutAmount);
    event Deposit(address indexed sender, uint256 amount); // 👈 New event for deposit

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this");
        _;
    }

    function createPolicy(
        string memory farmName,
        uint256 lat,
        uint256 lng,
        uint256 acreage,
        string memory riskType,
        uint256 rainfallThreshold,
        uint256 startDate,
        uint256 endDate,
        uint256 premiumPaid
    ) public payable {
        require(msg.value >= premiumPaid, "Insufficient premium sent");

        policyCounter++;
        policies[policyCounter] = Policy({
            farmer: msg.sender,
            farmName: farmName,
            lat: lat,
            lng: lng,
            acreage: acreage,
            riskType: riskType,
            rainfallThreshold: rainfallThreshold,
            startDate: startDate,
            endDate: endDate,
            premiumPaid: premiumPaid,
            payout: 0,
            status: 0 // 0 = active
        });

        farmerPolicies[msg.sender].push(policyCounter); // Store policy ID for the farmer

        emit PolicyCreated(policyCounter, msg.sender, premiumPaid);
    }

    function issuePayout(uint256 policyId, uint256 damagePercent) external onlyOwner {
        Policy storage policy = policies[policyId];
        require(policy.status == 0, "Policy is not active or already claimed");
        require(damagePercent <= 100, "Damage percent must be <= 100");

        uint256 insuredAmount = policy.acreage * 5000; // Rs. 5000 per acre
        uint256 payout = (insuredAmount * damagePercent) / 100;

        policy.status = 1; // 1 = claimed
        policy.payout = payout * 30;

        payable(policy.farmer).transfer(payout);
        emit PayoutIssued(policyId, policy.farmer, payout);
    }

    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        return policies[policyId];
    }

    function getFarmerPolicies(address farmer) external view returns (uint256[] memory) {
        return farmerPolicies[farmer];
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // 👇 New deposit function for native tokens
    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than zero");
        emit Deposit(msg.sender, msg.value);
    }

    receive() external payable {}
}
