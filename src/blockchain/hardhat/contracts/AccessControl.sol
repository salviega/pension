// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <=0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AccessControl is ERC721 {
    using Counters for Counters.Counter;
    
    Counters.Counter public tokenIdCounter;
    
    mapping(address => bool) public addressesThatAlreadyMinted;
    mapping(address => uint256) public deposits;
    mapping(uint256 => address) public pensions;

    uint256 constant  public mininumDeposit = 25;
    int constant public retirentment = 61;
    
    address public contributor;
    uint256 public age;
    uint256 public bornAge;
    uint256 public pensionCreatedTime;
    uint256 public timeToUpdateAnnualAmount;
    uint256 public annualAmount;
    
    constructor(uint256 _bornAge, uint256 _age, uint256 _annualAmount) ERC721 ("Pension", "PNS") { 
        contributor = msg.sender;
        bornAge = _bornAge;
        age = _age;
        annualAmount = _annualAmount;
    }

    // keepers
    function setAge() public {
        uint256 birthday = bornAge + age;
        uint256 dayBeforeBirthday = block.timestamp - 1 days;
        uint256 dayAfterBirthday =  block.timestamp + 1 days;
        if(birthday > dayBeforeBirthday && birthday < dayAfterBirthday) { 
            age += 1; 
        }
    }

    // keepers
    function setTimeToUpdateAnnualAmount() public {
        //Todo
    }

    function setAnnualAmount(uint256 newAnnualAmount, uint256 pensionId) payable public {
        require(pensions[pensionId] == ownerOf(pensionId), "You don't own this pension");
        uint currentTime = block.timestamp;
        uint beforeTimetoUpdateAnnualAmount = timeToUpdateAnnualAmount - 2 weeks;
        uint afterTimeToUpdateAnnualAmount = timeToUpdateAnnualAmount + 2 weeks;
        if(currentTime >= beforeTimetoUpdateAnnualAmount && currentTime <= afterTimeToUpdateAnnualAmount) { 
            require(newAnnualAmount >= mininumDeposit, "The amount doesn't reach the minimum required");
            require(msg.value >= newAnnualAmount, "The amount doesn't reach the new minimum required");
            annualAmount = newAnnualAmount; 
            deposit(pensionId);
            timeToUpdateAnnualAmount = currentTime + currentTime;
            return;
        }       
    }
    
    function verifyIfTheContributorAlreadyMint(address account) public view returns(bool) {
        if(addressesThatAlreadyMinted[account]) { return true; }
        return false;
    }

    function transferPension(address from, address to, uint256 pensionId) public {
        transferFrom(from, to, pensionId);
        pensions[pensionId] = to;
    }

    function deposit(uint256 pensionId) payable public {
        require(pensions[pensionId] == ownerOf(pensionId), "You don't own this pension");
        require(msg.value == annualAmount, "The deposit you want to make does not match the agreed amount");
        require(msg.value >= mininumDeposit, "The amount doesn't reach the minimum required");
        deposits[ownerOf(pensionId)] += msg.value;
    }

    function withdraw(uint256 pensionId) payable public {
        require(pensions[pensionId] == ownerOf(pensionId), "You don't own this pension");

        // Todo

    }
    
    function safeMint(address newContributor) payable public {
        require(!verifyIfTheContributorAlreadyMint(newContributor), "Already generated his pension");
        require(age >= 18, "You must be 18 years or older to generate a pension");
        require(msg.value == annualAmount, "The deposit you want to make does not match the agreed amount");
        require(msg.value >= mininumDeposit, "The amount doesn't reach the minimum required");
        
        deposits[newContributor] += msg.value;
        
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(newContributor, tokenId);
        pensionCreatedTime = block.timestamp;
        timeToUpdateAnnualAmount = pensionCreatedTime + pensionCreatedTime;
        pensions[tokenId] = newContributor;
        addressesThatAlreadyMinted[newContributor] = true;
    }
}