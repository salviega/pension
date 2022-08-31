// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <=0.8.14;

//import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./TokenStake.sol";

/**
 *  @title Pension
 *  This contract is a curated registry for people. The users are identified by their address and can be added or removed through the request-challenge protocol.
 *  In order to challenge a registration request the challenger must provide one of the four reasons.
 *  New registration requests firstly should gain sufficient amount of vouches from other registered users and only after that they can be accepted or challenged.
 *  The users who vouched for submission that lost the challenge with the reason Duplicate or DoesNotExist would be penalized with optional fine or ban period.
 *  NOTE: This contract trusts that the Arbitrator is honest and will not reenter or modify its costs during a call.
 *  The arbitrator must support appeal period.
 */

contract Pension is ERC721, TokenStake{
    using Counters for Counters.Counter;

    Counters.Counter public pensionIdCounter;

    /* Constants and immutable */
    uint256 constant private interval = 30 days;
    uint256 constant private mininumDeposit = 25 * 10 **18;
    uint256 constant private retirentmentAge = 365 days * 61;


    /* Struct */
    struct MonthlyQuote {
        address owner;
        bytes32 id;
        uint256 pensionId;
        uint256 contributionDate;
        uint256 savingAmount; 
        uint256 solidaryAmount; 
        uint256 totalAmount;
    }

    struct MonthlyRecord {
        uint256 totalAmount;
        MonthlyQuote[] monthlyQuotes;
    }

    struct retairedQuote {
        address owner;
        uint256 monthlyQuote;
        uint256 quantityQuotes;
        uint256 paidQuotestotal;
    }

    struct retairedRecord {
        uint256 totalAmount;
        retairedQuote[] retairedQuote;
    }

    /* Storage */
    MonthlyQuote[]  private monthlyQuotes;
    MonthlyRecord[] private monthlyRecords;
    uint256[] private withdrawPensionList;
    mapping(uint256 => uint256[]) public cutoffDateWithdrawPensionBalance;
    mapping(address => mapping(uint256 => uint256)) public savingsBalance;
    mapping(address => mapping(uint256 => uint256)) public solidaryBalance;
    mapping(uint256 => address) public pensions;
    mapping(address => bool) public addressesThatAlreadyMinted;
    mapping(uint256 => MonthlyRecord) public generalBalance;

    string  public biologySex;
    uint256 public age;
    uint256 public bornAge;
    uint256 public cutoffDate;
    uint256 public ExpectancyAfterRetirement;
    uint256 public pensionCreatedTime;
    uint256 public timeToUpdateAnnualAmount;

    /* Modifiers */

    // modifier onlyGovernor {require(msg.sender == governor, "The caller must be the governor"); _;}

    /* Events */

    /** @dev Emitted when a vouch is added.
      * @param _submissionID The submission that receives the vouch.
      * @param _voucher The address that vouched.
    */

    /** @dev Constructor
     *  
    */

    constructor(address _erc20Token) ERC721 ("Pension", "PNS") TokenStake(_erc20Token) {
        cutoffDate = block.timestamp;
        MonthlyRecord storage monthlyRecord = (monthlyRecords.push());
        generalBalance[cutoffDate] = monthlyRecord;
    }

    // ************************ //
    // *     Mint pension     * //
    // ************************ //
    
    // -- Docs
    // -- Testing --
    function safeMint(string memory _biologySex, uint256 _age,  uint256 _bornAge, uint256 _firstQuote) public {
        require(!verifyIfTheContributorAlreadyMint(), "Already generated his pension");
        require(_firstQuote >= mininumDeposit, "The amount doesn't reach the minimum required");
        //require(msg.value == _firstQuote, "You don't have this amount");
        require(_age >= 18, "You must be 18 years or older to generate a pension");

        // todo: 
        uint256 mintDate = block.timestamp; 
        biologySex = _biologySex;
        age = _age * 365 days; 
        bornAge = _bornAge;  

        uint256 pensionId = pensionIdCounter.current();
        pensionIdCounter.increment();
        _safeMint(msg.sender, pensionId);

        uint256 timeRetirentment = retirentmentAge - age; 
        uint256 retirentmentDate = mintDate + timeRetirentment; 
        uint256 retirentmentCutoffDate =  ((retirentmentDate - cutoffDate) / 30 days) + 30 days;
        cutoffDateWithdrawPensionBalance[retirentmentCutoffDate].push(pensionId);  
        
        addressesThatAlreadyMinted[msg.sender] = true;
        pensions[pensionId] = msg.sender; 

        depositAmount(pensionId, _firstQuote);
        determLifeExpectancyAfterRetirement();
    }


    // ************************ //
    // *       Quoutes        * //
    // ************************ //

    /** @dev depositar DAIs según la cantidad anual pactada en el minteo.
     *  @param _pensionId La pensión.
     *  @param _amount DAI a depositar.
    */
    // -- Testing --
    function depositAmount(uint256 _pensionId, uint256 _amount) public {
        require(msg.sender == pensions[_pensionId] && msg.sender == ownerOf(_pensionId), "You don't own this pension");
        //require(msg.value == _amount, "The amount isn't enough");
        require(_amount >= mininumDeposit, "The amount doesn't reach the minimum required");
        
        uint256 contributionDate = block.timestamp;
        uint256 savingsAmount = _amount * 23 / 100;
        uint256 solidaryAmount = _amount * 73 / 100;
    
        solidaryBalance[msg.sender][_pensionId] += solidaryAmount;
        savingsBalance[msg.sender][_pensionId] += savingsAmount;
        registerMonthlyQuote(_pensionId, _amount, contributionDate, savingsAmount, solidaryAmount);
        
        stakeTokens(_amount); // Stake the received DAIs
    }

    /* @dev Register quote deposit in the general balance
     * @param _pensionId La pensión
     * @param _contribution DAI a depositar
     * @param _contributionDate DAI a depositar
     * @param _savingsAmount DAI a depositar
     * @param _solidaryAmount
    */ 
    // -- Testing --
    function registerMonthlyQuote(uint256 _pensionId, uint256 _totalAmount, uint256 _contributionDate, uint256 _savingsAmount, uint256 _solidaryAmount) private {
        bytes32 id = keccak256(abi.encodePacked(_contributionDate));
        generalBalance[cutoffDate].totalAmount += _totalAmount;
        generalBalance[cutoffDate].monthlyQuotes.push(MonthlyQuote(msg.sender, id, _pensionId, _contributionDate, _savingsAmount, _solidaryAmount,  _totalAmount));
    }

    // function setAnnualAmount(uint256 newAnnualAmount, uint256 pensionId) payable public {
    //     // Rango para cotizar más
    //     // todo
    //     require(pensions[pensionId] == ownerOf(pensionId), "You don't own this pension"); // modificar
    //     uint currentTime = block.timestamp;
    //     uint beforeTimetoUpdateAnnualAmount = timeToUpdateAnnualAmount - 2 weeks;
    //     uint afterTimeToUpdateAnnualAmount = timeToUpdateAnnualAmount + 2 weeks;
    //     if(currentTime >= beforeTimetoUpdateAnnualAmount && currentTime <= afterTimeToUpdateAnnualAmount) {
    //         require(newAnnualAmount >= mininumDeposit, "The amount doesn't reach the minimum required");
    //         require(msg.value >= newAnnualAmount, "The amount doesn't reach the new minimum required");
    //         annualAmount = newAnnualAmount;
    //         timeToUpdateAnnualAmount = currentTime + 365 days;
    //     }
    // }

    // ************************ //
    // *   Solidary Regime    * //
    // ************************ //

    // -- Docs
    // -- Testing --


    // ************************ //
    // *   salvings Regime    * //
    // ************************ //

    // ************************ //
    // *   DEFI investment    * //
    // ************************ //

    // ************************ //
    // *    Overhead cost     * //
    // ************************ //

    // ************************ //
    // *       Keepers        * //
    // ************************ //

    // -- Docs
    // -- Testing --
    function generateNewRetirentment(uint256 _cutoffDate) private {
       uint256[] memory cutofDatePensions = cutoffDateWithdrawPensionBalance[_cutoffDate];
       for (uint256 index = 0; index > cutofDatePensions.length ; index++) {
           uint256 pension = cutofDatePensions[index];
           registerRetirentment(pension); //
       }
    
    }

    // -- Docs
    // -- Testing --
    function updateCutoffDate() private {
        if ((block.timestamp - cutoffDate) > interval) {
            cutoffDate = block.timestamp;
            MonthlyRecord storage monthlyRecord = (monthlyRecords.push());
            generalBalance[cutoffDate] = monthlyRecord;
        }
    }

    // -- Docs
    // -- Testing --
    function setAge() public {
        uint256 birthday = bornAge + age;
        uint256 dayBeforeBirthday = block.timestamp - 1 days;
        uint256 dayAfterBirthday =  block.timestamp + 1 days;
        require(birthday > dayBeforeBirthday && birthday < dayAfterBirthday, "Doesn't your birthday");
        age += 1;
    }

    function setTimeToUpdateAnnualAmount() public {
        //Todo
    }

    function withdraw(uint256 pensionId) public {
        // require(pensions[pensionId] == ownerOf(pensionId), "You don't own this pension"); // Verificar
        // require(age >= retirentment, "You don't yet of retirement age");

        // uint256 quote = quoteSolidaryRegimePension(pensionId);
        // require(quote < deposits[contributor][pensionId], "Cannot withdraw more that deposited");
        // msg.sender.transfer(quote);
        //bool output, bytes memory response) = msg.sender{value:quote, gas: 200000}("");
        // deposits[contributor][pensionId] -= quote;
        // return output;
        // // Incvompleto
        unstakeTokens();
    }

    // ************************ //
    // *        Utils         * //
    // ************************ //

    function registerRetirentment(uint256 _pension) private {
        /*
        Commented it's not compiling for errors in this function

        uint256 savingsMoneyTotal= savingsBalance[_pension];
        uint256 solidaryMoneyTotal = solidaryBalance[_pension];
        uint256 pensionMoneyTotal= savingsMoneyTotal + solidaryMoneyTotal;
        uint256 monthlyQuoteValue = ((pensionMoneyTotal/21)/12); 
        */
    }
    // -- Docs
    // -- Testing --
    function getmonthlyBalanceFromGeneralBalance(uint256 _cutoffDate) view public returns(MonthlyRecord memory) {
        return generalBalance[_cutoffDate];
    }
    // -- Docs
    // -- Testing --
    function totalAsserts() view public returns(uint256) {
        return address(this).balance;
    }
    // -- Docs
    // -- Testing --
    function verifyIfTheContributorAlreadyMint() public view returns(bool) {
        if(addressesThatAlreadyMinted[msg.sender]) { return true; }
        return false;
    }
    // -- Docs
    // -- Testing --
    function transferPension(address _to, uint256 _pensionId) public {
        require(msg.sender == pensions[_pensionId] && msg.sender == ownerOf(_pensionId), "You don't own this pension");
        transferFrom(msg.sender, _to, _pensionId);
        pensions[_pensionId] = _to;
    }
    // -- Docs
    // -- Testing --
    function determLifeExpectancyAfterRetirement() private returns(bool){
        if(compareStrings(biologySex, "male")) {
            ExpectancyAfterRetirement = 85 - 61;
            return true;
        }
        if(compareStrings(biologySex, "female")) {
            ExpectancyAfterRetirement = 80 - 61;
            return true;
        }
        return false;
    }
    // -- Docs
    // -- Testing --
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}