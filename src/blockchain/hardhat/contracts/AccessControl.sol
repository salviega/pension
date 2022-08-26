// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <=0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AccessControl is ERC721 {
    using Counters for Counters.Counter;
    
    Counters.Counter public pensionIdCounter;
    
    mapping(address => bool) public addressesThatAlreadyMinted;
    mapping(address => mapping(uint256 => uint256)) public deposits;
    mapping(uint256 => address) public pensions;

    uint256 constant  public mininumDeposit = 25;
    uint256 constant public retirentment = 61;
    
    string  public biologySex;
    address public contributor;
    uint256 public lifeExpectancy;
    uint256 public age;
    uint256 public annualAmount;
    uint256 public savingsRegimeAmount;
    uint256 public solidaryRegimeAmount;
    uint256 public bornAge;
    uint256 public pensionCreatedTime;
    uint256 public timeToUpdateAnnualAmount;
    
    constructor(uint256 _age, uint256 _annualAmount, string memory _biologySex, uint256 _bornAge) ERC721 ("Pension", "PNS") { 
        age = _age;
        annualAmount = _annualAmount;
        savingsRegimeAmount = _annualAmount * 27 / 100; // 73%
        solidaryRegimeAmount = _annualAmount * 23 / 100; // 23%
        biologySex = _biologySex;
        bornAge = _bornAge;
        contributor = msg.sender;
    }

    function safeMint(address newContributor) payable public {
        require(!verifyIfTheContributorAlreadyMint(newContributor), "Already generated his pension");
        require(age >= 18, "You must be 18 years or older to generate a pension");
        require(msg.value == annualAmount, "The deposit you want to make does not match the agreed amount");
        require(msg.value >= mininumDeposit, "The amount doesn't reach the minimum required");
        
        uint256 pensionId = pensionIdCounter.current();
        pensionIdCounter.increment();
        _safeMint(newContributor, pensionId);
        
        deposits[newContributor][pensionId] += msg.value;
        
        determLifeExpectancy();
        pensionCreatedTime = block.timestamp;
        timeToUpdateAnnualAmount = pensionCreatedTime + 365 days; 
        pensions[pensionId] = newContributor;
        addressesThatAlreadyMinted[newContributor] = true;
    }

    // keepers
    function setAge() public {
        uint256 birthday = bornAge + age;
        uint256 dayBeforeBirthday = block.timestamp - 1 days;
        uint256 dayAfterBirthday =  block.timestamp + 1 days;
        require(birthday > dayBeforeBirthday && birthday < dayAfterBirthday, "Doesn't your birthday");
        age += 1; 
    }

    // keepers
    function setTimeToUpdateAnnualAmount() public {
        //Todo
    }

    function setAnnualAmount(uint256 newAnnualAmount, uint256 pensionId) payable public {
        require(pensions[pensionId] == ownerOf(pensionId), "You don't own this pension"); // modificar 
        uint currentTime = block.timestamp;
        uint beforeTimetoUpdateAnnualAmount = timeToUpdateAnnualAmount - 2 weeks;
        uint afterTimeToUpdateAnnualAmount = timeToUpdateAnnualAmount + 2 weeks;
        if(currentTime >= beforeTimetoUpdateAnnualAmount && currentTime <= afterTimeToUpdateAnnualAmount) { 
            require(newAnnualAmount >= mininumDeposit, "The amount doesn't reach the minimum required");
            require(msg.value >= newAnnualAmount, "The amount doesn't reach the new minimum required");
            annualAmount = newAnnualAmount; 
            deposit(pensionId);
            timeToUpdateAnnualAmount = currentTime + 365 days;
        }       
    }
    
    // falta validar
    function transferPension(address from, address to, uint256 pensionId) public {
        transferFrom(from, to, pensionId);
        pensions[pensionId] = to;
    }

    function deposit(uint256 pensionId) payable public {
        require(pensions[pensionId] == ownerOf(pensionId), "You don't own this pension"); // Vlaidar
        require(msg.value == annualAmount, "The deposit you want to make does not match the agreed amount");
        require(msg.value >= mininumDeposit, "The amount doesn't reach the minimum required");
        deposits[contributor][pensionId] += msg.value;
    }

    //keepers
    function withdraw(uint256 pensionId) payable public {
        require(pensions[pensionId] == ownerOf(pensionId), "You don't own this pension"); // Verificar
        require(age >= retirentment, "You don't yet of retirement age");
        
        uint256 quote = quoteSolidaryRegimePension(pensionId);
        require(quote < deposits[contributor][pensionId], "Cannot withdraw more that deposited");
        deposits[contributor][pensionId] -= quote;
        payable(contributor).transfer(quote)


    }
    
    function quoteSolidaryRegimePension(uint256 pensionId) public view returns (uint256) {
        require(age >= retirentment, "You must be 61 years or older");
        require(pensions[pensionId] == contributor, "You can only quote yours pensions");
        require(deposits[contributor][pensionId] > 0, "You have no money deposited");
        return deposits[contributor][pensionId]/lifeExpectancy/12;   
    }

    function verifyIfTheContributorAlreadyMint(address account) public view returns(bool) {
        if(addressesThatAlreadyMinted[account]) { return true; }
        return false;
    }

    function determLifeExpectancy() internal returns(bool){
        if(compareStrings(biologySex, "male")) {
            lifeExpectancy = 85 - 61;
            return true;
        }
        if(compareStrings(biologySex, "female")) {
            lifeExpectancy = 80 - 61;
            return true;
        }
        return false;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}