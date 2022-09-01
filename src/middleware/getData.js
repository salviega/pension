import { ethers } from 'ethers'

import pensionContractAbi from '../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/Pension.sol/Pension.json';
import addresses from '../blockchain/environment/contract-address.json';
const pensionAddress = addresses.pensioncontract;

function getData() {
  const web3Provider = ethers.providers.getDefaultProvider('rinkeby');
  const pensionContract = new ethers.Contract(pensionAddress, pensionContractAbi.abi, web3Provider);
  
  const getAllItems = async () => {
    return await pensionContract.getGeneralRecord();
  }
  return { getAllItems }
}

export { getData }
