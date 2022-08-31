//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenStake {
    IERC20 private _token;
    address owner;
    mapping(address => uint) public stakingBalance;

    /*
       ! Important. When deploying the contract, pass the proper DAI address
       MAINNET:     0x6B175474E89094C44Da98b954EedeAC495271d0F
       Kovan DAI:   0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa
       Rinkeby DAI: 0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C
    */
    constructor(address _erc20Token) {
        _token = IERC20(_erc20Token);
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) internal {

        // amount should be > 0
        require(_amount > 0, "amount should be > 0");

        // transfer Dai to this contract for staking
        _token.transferFrom(msg.sender, address(this), _amount);
        
        // update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() internal {
        
        uint balance = stakingBalance[msg.sender];

        unstakePartialTokens(balance);
    }


    // Unstaking Tokens (Withdraw)
    function unstakePartialTokens(uint _amount) internal {

        uint balance = stakingBalance[msg.sender];

        // balance should be > 0
        require (_amount <= balance, "unstaking balance cannot be more than balance");

        // Transfer Mock Dai tokens to this contract for staking
        _token.transfer(msg.sender, _amount);

        // reset staking balance to 0
        stakingBalance[msg.sender] = balance - _amount;
    }


}