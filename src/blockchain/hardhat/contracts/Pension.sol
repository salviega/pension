// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <=0.8.14;

//import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 *  @title Pension
 *  This contract is a curated registry for people. The users are identified by their address and can be added or removed through the request-challenge protocol.
 *  In order to challenge a registration request the challenger must provide one of the four reasons.
 *  New registration requests firstly should gain sufficient amount of vouches from other registered users and only after that they can be accepted or challenged.
 *  The users who vouched for submission that lost the challenge with the reason Duplicate or DoesNotExist would be penalized with optional fine or ban period.
 *  NOTE: This contract trusts that the Arbitrator is honest and will not reenter or modify its costs during a call.
 *  The arbitrator must support appeal period.
 */

contract Pension is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter public pensionIdCounter;

    /* Constants and immutable */
    uint256 constant private femaleExpectancyLife = 365 days * 80;
    uint256 constant private interval = 30 days; //MVP
    uint256 constant private majorityAge = 18;
    uint256 constant private maleExpectancyLife = 365 days * 85;
    uint256 constant private mininumDeposit = 25 * 10 ** 18;
    uint256 constant private retirentmentAge = 365 days * 61;


    /* Struct */

    struct GeneralRecord {
        int solvent;
        uint256 totalAmount;
        uint256 totalToPay;
        RetairedRecord[] retairedRecords;
        MonthlyRecord[] monthlyRecords;
    }

    struct MonthlyQuote {
        address payable owner;
        bytes32 id;
        DataPension dataPension;
        uint256 contributionDate;
        uint256 savingAmount; 
        uint256 solidaryAmount; 
        uint256 totalAmount;
    }
    struct MonthlyRecord {
        uint256 totalAmount;
        MonthlyQuote[] monthlyQuotes;
    }

    struct DataPension {
        address payable owner;
        string biologySex;
        uint256 age;
        uint256 bornAge;
        uint256 pensionCreatedTime;
        uint256 pensionId;
    }

    struct RetairedQuote {
        address payable owner;
        uint256 monthlyQuote;
        uint256 quantityQuotes;
        uint256 totalPaidQuotes;
        uint256 totalPensionValue;
    }

    struct RetairedRecord {
        uint256 totalAmount;
        uint256 totalToPay;
        RetairedQuote[] retairedQuotes;
    }

    /* Storage */
    GeneralRecord private  generalRecord;
    
    GeneralRecord[] private generalRecords;
    MonthlyQuote[]  private monthlyQuotes;
    MonthlyRecord[] private monthlyRecords;
    Pension[] private pensions;
    RetairedQuote[] private retairedQuotes;
    RetairedRecord[] private retairedRecords;

    mapping(address => bool) public addressesThatAlreadyMinted;
    mapping(address => mapping(uint256 => uint256)) public savingsBalance;
    mapping(address => mapping(uint256 => uint256)) public solidaryBalance;
    mapping(address => mapping(uint256 => DataPension)) public ownerPensionsBalance;
    mapping(uint256 => DataPension[]) public cutoffDateWithdrawPensionBalance;
    mapping(uint256 => MonthlyRecord) public monthlyGeneralBalance;
    mapping(uint256 => RetairedRecord) public retairedBalance;

    uint256 public cutoffDate;
    uint256[] private withdrawPensionList;

    /* Modifiers */

    // -- Docs
    // -- Testing --
    modifier onlyOwner(uint256 _pension) {
       require(msg.sender == ownerPensionsBalance[msg.sender][_pension].owner && msg.sender == ownerOf(_pension), "You don't own this pension"); 
        _;}

    // -- Docs
    // -- Testing --
    modifier validAmount(uint256 _callvalue, uint256 _amount) {
        require(_callvalue >= mininumDeposit, "The amount doesn't reach the minimum required");
        require(_callvalue == _amount, "You don't have this amount");
        _;
    }

    /* Events */

    /** @dev Emitted when a vouch is added.
      * @param _submissionID The submission that receives the vouch.
      * @param _voucher The address that vouched.
    */

    /** @dev Constructor
     *  
    */
    constructor() ERC721 ("Pension", "PNS") {
        cutoffDate = block.timestamp;
        MonthlyRecord storage monthlyRecord = (monthlyRecords.push());
        monthlyGeneralBalance[cutoffDate] = monthlyRecord;
        GeneralRecord storage generalRecordGenesis = (generalRecords.push());
        generalRecord = generalRecordGenesis;
    }

    // ************************ //
    // *     Mint pension     * //
    // ************************ //
    
    // -- Docs
    // -- Testing --
    function safeMint(string memory _biologySex, uint256 _age,  uint256 _bornAge, uint256 _firstQuote) validAmount(msg.value, _firstQuote) payable public {
        require(!verifyIfTheContributorAlreadyMint(msg.sender), "Already generated his pension");
        require(_age >= majorityAge, "You must be 18 years or older to generate a pension");
        uint256 age = _age * 365 days; 
        uint256 mintDate = block.timestamp; 

        uint256 pensionId = pensionIdCounter.current();
        pensionIdCounter.increment();
        _safeMint(msg.sender, pensionId);

        DataPension memory newPension = DataPension(payable(msg.sender), _biologySex, age, _bornAge,  pensionId, mintDate);       

        uint256 timeRetirentment = retirentmentAge - age; 
        uint256 retirentmentDate = mintDate + timeRetirentment; 
        uint256 retirentmentCutoffDate = ((retirentmentDate - cutoffDate) / 30 days) + 30 days;
        cutoffDateWithdrawPensionBalance[retirentmentCutoffDate].push(newPension);  
        
        ownerPensionsBalance[msg.sender][pensionId] = newPension;
        depositAmount(newPension.pensionId, _firstQuote);
        addressesThatAlreadyMinted[msg.sender] = true;
    }


    // ************************ //
    // *       Quoutes        * //
    // ************************ //

    /*
      * @dev depositar DAIs según la cantidad anual pactada en el minteo.
      *  @param _pensionId La pensión.
      *  @param _amount DAI a depositar.
    */
    // -- Testing --

    function depositAmount(uint256 _pensionId, uint256 _amount) payable public onlyOwner(_pensionId) validAmount(msg.value, _amount) {
        uint256 contributionDate = block.timestamp;
        uint256 savingsAmount = _amount * 23 / 100;
        uint256 solidaryAmount = _amount * 73 / 100;
        solidaryBalance[msg.sender][_pensionId] += solidaryAmount;
        savingsBalance[msg.sender][_pensionId] += savingsAmount;
        registerMonthlyQuote(ownerPensionsBalance[msg.sender][_pensionId], _amount, contributionDate, savingsAmount, solidaryAmount);
    }

    /* @dev Register quote deposit in the general balance
     * @param _pensionId La pensión
     * @param _contribution DAI a depositar
     * @param _contributionDate DAI a depositar
     * @param _savingsAmount DAI a depositar
     * @param _solidaryAmount
    */ 
    // -- Testing --
    function registerMonthlyQuote(DataPension memory _pension, uint256 _totalAmount, uint256 _contributionDate, uint256 _savingsAmount, uint256 _solidaryAmount) private {
        bytes32 id = keccak256(abi.encodePacked(_contributionDate));
        monthlyGeneralBalance[cutoffDate].totalAmount += _totalAmount;
        monthlyGeneralBalance[cutoffDate].monthlyQuotes.push(MonthlyQuote(payable(_pension.owner), id, _pension, _contributionDate, _savingsAmount, _solidaryAmount,  _totalAmount));
    }

    // ************************ //
    // *   Solidary Regime    * //
    // ************************ //

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
    function updateCutoffDate() private {
        if ((block.timestamp - cutoffDate) > interval) {
            generalRecord.monthlyRecords.push(monthlyGeneralBalance[cutoffDate]);
            generalRecord.totalAmount += monthlyGeneralBalance[cutoffDate].totalAmount;
            generalRecord.totalToPay += retairedBalance[cutoffDate].totalToPay;
            int moneyDifference = int(generalRecord.totalAmount) - int(generalRecord.totalToPay);

            if (moneyDifference == 0) {
                sendMoneyToRetired();
            }
            if (moneyDifference > 0) {
                sendMoneyToRetired();
                generalRecord.solvent += int(moneyDifference);
            }
            if (moneyDifference < 0) {
                 generalRecord.solvent -= -moneyDifference;
                 generalRecord.totalAmount += uint256(-moneyDifference);
                 sendMoneyToRetired();
            }
                        
            cutoffDate = block.timestamp;
            generateNewRetirentments(cutoffDate);
            MonthlyRecord storage monthlyRecord = (monthlyRecords.push());
            monthlyGeneralBalance[cutoffDate] = monthlyRecord;
        }
    }

    // -- Docs
    // -- Testing --
    function sendMoneyToRetired() private {
        RetairedRecord[] memory retiredRecordList =  generalRecord.retairedRecords;
        for (uint256 x = 0; x > retiredRecordList.length; x ++) {
            RetairedQuote[] memory retairedQuotelist = retiredRecordList[x].retairedQuotes;
            for (uint256 y = 0; y > retairedQuotelist.length; y ++) {
                RetairedQuote memory retairedQuote = retairedQuotelist[y];
                retairedQuote.owner.transfer(retairedQuote.monthlyQuote);
                generalRecord.totalToPay -= retairedQuote.monthlyQuote;
                generalRecord.totalAmount -= retairedQuote.monthlyQuote;
                retairedQuote.owner.transfer(retairedQuote.monthlyQuote);
                //(bool output, bytes memory response) = retairedQuote.owner.call{value:retairedQuote.monthlyQuote, gas: 200000}(""); -- MVP
                retairedQuote.totalPaidQuotes += retairedQuote.monthlyQuote;
                if (retairedQuote.totalPaidQuotes >= retairedQuote.totalPensionValue) {
                    delete retairedQuotelist[y];
                    // _burn(retairedQuote.idToken); -- MVP
                    if (retairedQuotelist.length == 0) {
                        delete retiredRecordList[x];
                    }
                }
            }
        }
    }

    // ************************ //
    // *        Utils         * //
    // ************************ //

    // -- Docs
    // -- Testing --
    function generateNewRetirentments(uint256 _cutoffDate) private {
       DataPension[] memory cutoffDatePensionList = cutoffDateWithdrawPensionBalance[_cutoffDate];
       for (uint256 index = 0; index > cutoffDatePensionList.length ; index++) {
           DataPension memory retiredPension = cutoffDatePensionList[index];
           registerRetirentment(retiredPension, _cutoffDate); 
       }
    }

    // -- Docs
    // -- Testing --
    function registerRetirentment(DataPension memory _pension, uint256 retirentmentDate) private {
        uint256 totalSavingsMoney = savingsBalance[_pension.owner][_pension.pensionId];
        uint256 totalSolidaryMoney = solidaryBalance[_pension.owner][_pension.pensionId];
        uint256 totalPensionMoney = totalSavingsMoney + totalSolidaryMoney;
        uint256 monthlyQuoteValue = ((totalPensionMoney/21)/12); 
        uint256 quantityQuotes = getQuantityQuotes(_pension.biologySex);
        RetairedQuote memory newRetaired = RetairedQuote(_pension.owner, monthlyQuoteValue, quantityQuotes, 0, totalPensionMoney);
        retairedBalance[retirentmentDate].totalAmount += newRetaired.totalPensionValue;
        retairedBalance[retirentmentDate].totalToPay += newRetaired.monthlyQuote;
        retairedBalance[retirentmentDate].retairedQuotes.push(newRetaired);
    }

    // -- Docs
    // -- Testing --
    function getGeneralRecord() view public returns(GeneralRecord memory) {
        return generalRecord;
    }
    
    function getmonthlyBalanceFrommonthlyGeneralBalance(uint256 _cutoffDate) view public returns(MonthlyRecord memory) {
        return monthlyGeneralBalance[_cutoffDate];
    }

    // -- Docs
    // -- Testing --
    function totalAsserts() view public returns(uint256) {
        return address(this).balance;
    }

    // -- Docs
    // -- Testing --
    function verifyIfTheContributorAlreadyMint(address _owner) public view returns(bool) {
        if(addressesThatAlreadyMinted[_owner]) { return true; }
        return false;
    }

    // -- Docs
    // -- Testing --
    // -- MVP
    // function transferPension(address _to, uint256 _pensionId) public onlyOwner(_pensionId) {
    //     transferFrom(msg.sender, _to, _pensionId);
    //     ownerPensionsBalance[payable(msg.sender)][_pensionId].owner = payable(_to);
    // }

    // -- Docs
    // -- Testing --
    function getQuantityQuotes(string memory _biologySex) private pure returns(uint256){
        if(compareStrings(_biologySex, "male")) {
            return (maleExpectancyLife - retirentmentAge) / 12;
        } 
        if(compareStrings(_biologySex, "female")) {
            return (femaleExpectancyLife - retirentmentAge) / 12;
        }
        return 0;
    }
    
    // -- Docs
    // -- Testing --
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}