import './PensionWallet.scss';
import React from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';

import {
  authRegistedAction,
  authUnregistedAction,
  authUnverifiedAction,
  authVerifiedAction,
} from '../../store/actions/authAction';

import { activeSpinnerAction, desactiveSpinnerAction } from '../../store/actions/uiAction';

import proofOfHumanityAbi from '../../blockchain/environment/proof-of-humanity/proof-of-humanity-abi-.json';
import jsonProofOfHumanityAddress from '../../blockchain/environment/proof-of-humanity/proof-of-humanity-address.json';
import pensionContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/Pension.sol/Pension.json';
import jsonPension from '../../blockchain/environment/contract-address.json';
const pensionAddress = jsonPension.pensioncontract;
const proofOfHumanityAddress = jsonProofOfHumanityAddress.proofofhumanity;

function PensionWallet() {
  const [addressWallet, setAdressWallet] = React.useState('Connect your Wallet');
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();
  const { spinner } = useSelector(({ ui }) => ui);

  const connectWallet = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      if (addressWallet === 'Connect your Wallet') {
        setLoading(true);
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await web3Provider.send('eth_requestAccounts', []);
        const wallet = accounts[0];

        const verification = await verifyInProofOfHumanity(wallet);
        if (verification) {
          const web3Signer = web3Provider.getSigner();
          const chainId = await web3Signer.getChainId();
          if (chainId !== 4) {
            alert("Change your network to Rinkeby's testnet!");
            setLoading(false);
            return;
          }
          setLoading(false);
          setAdressWallet('...' + String(wallet).slice(38));
          dispatch(authRegistedAction());
          dispatch(authVerifiedAction());
        } else {
          alert('Your wallet is not registed in Proof of Humanity');
          dispatch(desactiveSpinnerAction());
        }
      } else {
        if (window.location.href.includes('mypensions') || window.location.href.includes('register')) {
          setLoading(true);
          dispatch(authUnregistedAction());
          dispatch(authUnverifiedAction());
          alert('Disconnected your wallet');
          setAdressWallet('Connect your Wallet')
          setLoading(false);
        } else {
          setLoading(true);
          dispatch(authUnregistedAction());
          dispatch(authUnverifiedAction());
          setAdressWallet('Connect your Wallet');
          setLoading(false)
        }
      }
    } else {
      alert("Metamask wasn't detected, please install metamask extension");
    }
  };

  const verifyInProofOfHumanity = async (wallet) => {
    const provider = ethers.providers.getDefaultProvider('mainnet');
    const proofOfHumanityContract = new ethers.Contract(proofOfHumanityAddress, proofOfHumanityAbi, provider);
    return await proofOfHumanityContract.isRegistered('0x1ddd73d60f92f4440377e27e9eecf8ea4c275ef6'); //'0x918BD890FF76D2da0089Dbb086d258Da75960119'
  };

  return (
    <button className="wallet" onClick={connectWallet}>
      {loading ? 'Loading...' : addressWallet}
    </button>
  );
}

export { PensionWallet };
