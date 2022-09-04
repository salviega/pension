// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <=0.8.14;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 *  @title Pension
 *  
 *  NOTE: 
 *  
 */

contract Pension is ERC721, KeeperCompatibleInterface {
    using Counters for Counters.Counter;

    Counters.Counter public pensionIdCounter;

    /* Constants and immutable */
    uint256 constant private femaleExpectancyLife = 365 days * 80;
    uint256 constant private interval = 30 days; //MVP
    uint256 constant private majorityAge = 18;
    uint256 constant private maleExpectancyLife = 365 days * 85;
    uint256 constant private mininumDeposit = 25; // wai
    uint256 constant public retirentmentAge = 365 days * 61;

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
        uint256 retirentmentDate;
        uint256 pensionCreatedTime;
        uint256 pensionId;
        uint256 totalSavings;
        uint256 totalSolidary;
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
    DataPension[] private pensions;
    RetairedQuote[] private retairedQuotes;
    RetairedRecord[] private retairedRecords;

    mapping(address => bool) private addressesThatAlreadyMinted;
    mapping(address => mapping(uint256 => uint256)) private savingsBalance;
    mapping(address => mapping(uint256 => uint256)) private solidaryBalance;
    mapping(address => mapping(uint256 => DataPension)) private ownerPensionsBalance;
    mapping(uint256 => DataPension[]) private cutoffDateWithdrawPensionBalance;
    mapping(uint256 => MonthlyRecord) private monthlyGeneralBalance;
    mapping(uint256 => RetairedRecord) private retairedBalance;

    uint256 public cutoffDate;
    uint256[] private withdrawPensionList;

    /* Modifiers */

    /** @dev Only owners can intetactive with the contract.
     * @param _owner Pension owner.
     * @param _pensionId Pension Id.
    */
    modifier onlyOwner(address _owner, uint256 _pensionId) {
       require(payable(_owner) == ownerPensionsBalance[_owner][_pensionId].owner && _owner == ownerOf(_pensionId), "You don't own this pension"); 
        _;}

    /** @dev Check for founds.
     * @param _callvalue money to deposit.
    */
    modifier validAmount(uint256 _callvalue) {
        require(_callvalue >= mininumDeposit, "The amount doesn't reach the minimum required");
        _;
    }

    /* Events */

    /** @dev RegisterQuote Emited when it is created a pension.
     * @param _owner contributor address.
     * @param _biologySex Gamete production of the contributor.
     * @param _age Contributor age.
     * @param _bornAge birth of date.
     * @param _retirentmentDate Retairment date of the contributor.
     * @param _pensionCreatedTime Mintend pension date.
     * @param _pensionId Pension ID.
    */
    event RegisterPension(address indexed _owner, string _biologySex, uint256 _age, uint256 _bornAge, uint256 _retirentmentDate, uint256 _pensionCreatedTime, uint256 indexed _pensionId); 
    
    /** @dev RegisterQuote Emited when a contribuitor does to deposit
     * @param _owner contributor address.
     * @param _id Id that identify the transaction.
     * @param _contributionDate Contribution date.
     * @param _savingAmount Salving Regime's deposit.
     * @param _solidaryAmount Solidary Regime's deposit.
     * @param _totalAmount Total deposit. 
    */
    event RegisterQuote(address indexed _owner, bytes32 indexed _id, DataPension _dataPension, uint256 _contributionDate, uint256 _savingAmount, uint256 _solidaryAmount, uint256 _totalAmount);


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
    
    /** @dev Generate a pension.
     * @param _biologySex Gamete generation.
     * @param _age Contributor's age.
     * @param _bornAge Contributor's age birth.
     * @param _firstQuote first contribution.
    */
    function safeMint(string memory _biologySex, uint256 _age,  uint256 _bornAge, uint256 _firstQuote) payable public validAmount(msg.value) {
        require(!verifyIfTheContributorAlreadyMinted(msg.sender), "Already generated his pension");
        require(_age >= majorityAge, "You must be 18 years or older to generate a pension");
        uint256 age = _age * 365 days; 
        uint256 mintDate = block.timestamp; 

        uint256 pensionId = pensionIdCounter.current();
        pensionIdCounter.increment();
        _safeMint(msg.sender, pensionId);

        uint256 quoteTime = retirentmentAge - age; 
        uint256 retirentmentDate = mintDate + quoteTime; 
        uint256 retirentmentCutoffDate = ((retirentmentDate - cutoffDate) / 30 days) + 30 days;
        
        DataPension memory newPension = DataPension(payable(msg.sender), _biologySex, _age, _bornAge, retirentmentDate, mintDate, pensionId, 0, 0);       
        
        ownerPensionsBalance[msg.sender][pensionId] = newPension;
        firstDeposit(newPension, _firstQuote);
        cutoffDateWithdrawPensionBalance[retirentmentCutoffDate].push(newPension);  
        addressesThatAlreadyMinted[msg.sender] = true;

        emit RegisterPension(msg.sender, _biologySex, _age, _bornAge, retirentmentDate, mintDate, pensionId);
    }

    /** @dev Verify if the contributor already minted your pension.
     * @param _owner Who interacts with the contract.
    */
    function verifyIfTheContributorAlreadyMinted(address _owner) public view returns(bool) {
        if(addressesThatAlreadyMinted[_owner]) { return true; }
        return false;
    }

    // ************************ //
    // *       Quoutes        * //
    // ************************ //

    // -- Testing --
    /** @dev Generate first contribution.
     * @param _pension Pension id.
     * @param _firstQuote first contribution.
    */
    function firstDeposit(DataPension memory _pension, uint256 _firstQuote) private {
        uint256 contributionDate = block.timestamp;
        uint256 savingsAmount = _firstQuote * 24 / 100;
        uint256 solidaryAmount = _firstQuote - savingsAmount; // 76 % 
        _pension.totalSavings += savingsAmount;
        _pension.totalSolidary += solidaryAmount;
        solidaryBalance[msg.sender][_pension.pensionId] += solidaryAmount;
        savingsBalance[msg.sender][_pension.pensionId] += savingsAmount;
        registerMonthlyQuote(ownerPensionsBalance[msg.sender][_pension.pensionId], _firstQuote, contributionDate, savingsAmount, solidaryAmount);
    }

    // -- Testing --
    /** @dev Do deposit.
     * @param _pensionId Pension id.
     * @param _amount amount to deposit.
    */
    function depositAmount(uint256 _pensionId, uint256 _amount) payable public onlyOwner(msg.sender, _pensionId) validAmount(msg.value) {
        uint256 contributionDate = block.timestamp;
        uint256 savingsAmount = _amount * 24 / 100;
        uint256 solidaryAmount = _amount - savingsAmount;

        ownerPensionsBalance[msg.sender][_pensionId].totalSavings += savingsAmount;
        ownerPensionsBalance[msg.sender][_pensionId].totalSolidary += solidaryAmount;
        solidaryBalance[msg.sender][_pensionId] += solidaryAmount;
        savingsBalance[msg.sender][_pensionId] += savingsAmount;
        registerMonthlyQuote(ownerPensionsBalance[msg.sender][_pensionId], _amount, contributionDate, savingsAmount, solidaryAmount);
    }

    // -- Testing --
    /** @dev Register monthly deposit of contributors.
     * @param _pension The pension to register.
     * @param _totalAmount Total to deposit in the mouth.
     * @param _contributionDate Deposit date.
     * @param _savingsAmount Amount for the saving regime.
     * @param _solidaryAmount Amount for the solidary regime.
    */ 
    function registerMonthlyQuote(DataPension memory _pension, uint256 _totalAmount, uint256 _contributionDate, uint256 _savingsAmount, uint256 _solidaryAmount) private {
        bytes32 id = keccak256(abi.encodePacked(_contributionDate));
        monthlyGeneralBalance[cutoffDate].totalAmount += _totalAmount;
        monthlyGeneralBalance[cutoffDate].monthlyQuotes.push(MonthlyQuote(payable(_pension.owner), id, _pension, _contributionDate, _savingsAmount, _solidaryAmount,  _totalAmount));
        
        emit RegisterQuote(_pension.owner, id, _pension, _contributionDate, _savingsAmount, _solidaryAmount,  _totalAmount);

    }

    // -- Testing --
    /** @dev Update cutoff date.
     * 
    */ 
    function updateCutoffDate() public { //MVP public for testing purposes
            generalRecord.monthlyRecords.push(monthlyGeneralBalance[cutoffDate]);
            generalRecord.totalAmount += monthlyGeneralBalance[cutoffDate].totalAmount;
            generalRecord.totalToPay += retairedBalance[cutoffDate].totalToPay;
            int moneyDifference = int(generalRecord.totalAmount) - int(generalRecord.totalToPay);

            if (moneyDifference < 0) {
                generalRecord.solvent -= -moneyDifference;
                generalRecord.totalAmount += uint256(-moneyDifference);
                sendMoneyToRetaired();
            } else if (moneyDifference > 0) {
                sendMoneyToRetaired();
                generalRecord.solvent += int(moneyDifference);
            } else {
                sendMoneyToRetaired();
            } 

            cutoffDate = block.timestamp;
            generateNewRetirentments(cutoffDate);
            MonthlyRecord storage monthlyRecord = (monthlyRecords.push());
            monthlyGeneralBalance[cutoffDate] = monthlyRecord;
    }

    // -- Testing --
    /** @dev Send money to retirees.
     * 
    */ 
    function sendMoneyToRetaired() private {
        RetairedRecord[] memory retairedRecordList =  generalRecord.retairedRecords;
        for (uint256 x = 0; x > retairedRecordList.length; x ++) {
            RetairedQuote[] memory retairedQuotelist = retairedRecordList[x].retairedQuotes;
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
                        delete retairedRecordList[x];
                    }
                }
            }
        }
    }

    // -- Testing --
    /** @dev Generate new retirees.
     * @param _cutoffDate Cutt of date.
    */ 
    function generateNewRetirentments(uint256 _cutoffDate) private {
       DataPension[] memory cutoffDatePensionList = cutoffDateWithdrawPensionBalance[_cutoffDate];
       for (uint256 index = 0; index > cutoffDatePensionList.length ; index++) {
           DataPension memory retairedPension = cutoffDatePensionList[index];
           registerRetirentment(retairedPension, _cutoffDate); 
       }
    }

    // -- Testing --
    /** @dev Register new retirees.
     * @param _pension The pension that will be for the retaired.
     * @param _retirentmentDate Retirentment date.
    */
    function registerRetirentment(DataPension memory _pension, uint256 _retirentmentDate) private {
        uint256 totalSavingsMoney = savingsBalance[_pension.owner][_pension.pensionId];
        uint256 totalSolidaryMoney = solidaryBalance[_pension.owner][_pension.pensionId];
        uint256 totalPensionMoney = totalSavingsMoney + totalSolidaryMoney;
        uint256 monthlyQuoteValue = ((totalPensionMoney/21)/12); 
        uint256 quantityQuotes = calculateQuantityQuotes(_pension.biologySex);
        RetairedQuote memory newRetaired = RetairedQuote(_pension.owner, monthlyQuoteValue, quantityQuotes, 0, totalPensionMoney);
        retairedBalance[_retirentmentDate].totalAmount += newRetaired.totalPensionValue;
        retairedBalance[_retirentmentDate].totalToPay += newRetaired.monthlyQuote;
        retairedBalance[_retirentmentDate].retairedQuotes.push(newRetaired);
    }

    // -- MVP
    // -- Testing
    // -- Docs
    // function transferPension(address _to, uint256 _pensionId) public onlyOwner(_pensionId) {
    //     transferFrom(msg.sender, _to, _pensionId);
    //     ownerPensionsBalance[payable(msg.sender)][_pensionId].owner = payable(_to);
    // }

    // -- Testing --
    /** @dev Calculate quantity quotes.
     * @param _biologySex Gamete generate.
    */
    function calculateQuantityQuotes(string memory _biologySex) private pure returns(uint256){
        if(compareStrings(_biologySex, "male")) {
            return (maleExpectancyLife - retirentmentAge) / 12;
        } 
        if(compareStrings(_biologySex, "female")) {
            return (femaleExpectancyLife - retirentmentAge) / 12;
        }
        return 0;
    }

    // ************************ //
    // *       Keepers        * //
    // ************************ //

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        bool done;
        upkeepNeeded = !done && ((block.timestamp - cutoffDate) > interval);
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        if ((block.timestamp - cutoffDate) > interval) {
            updateCutoffDate();
        }
    }

    
    // ************************ //
    // *   Getters & Setters  * //
    // ************************ //
    
    /** @dev Get general record.
     * 
    */
    function getGeneralRecord() view public returns(GeneralRecord memory) {
        return generalRecord;
    }
    
    /** @dev Get total money in the contract.
     * 
    */
    function totalAsserts() view public returns(uint256) {
        return address(this).balance;
    }

    /** @dev Get monthly balance from monthly general balance.
     * @param _cutoffDate Monthly cut off date 
    */
    function getMonthlyBalanceFromMonthlyGeneralBalance(uint256 _cutoffDate) view public returns(MonthlyRecord memory) {
        return monthlyGeneralBalance[_cutoffDate];
    }

    /** @dev Get the pensions balance of msg.sender.
     * @param _pensionId Id of pension
    */
    function getOwnerPensionsBalance(uint256 _pensionId) view public returns(DataPension memory) {
        return ownerPensionsBalance[msg.sender][_pensionId];
    }


    // ************************ //
    // *        Utils         * //
    // ************************ //
    
    /** @dev Compare strings.
     * @param a First string to compare.
     * @param b Second string to compare.
    */
    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}