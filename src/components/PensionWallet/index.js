import './PensionWallet.scss'
import React from 'react';
import { ethers } from 'ethers'
import { PensionLoading } from '../PensionLoading';
import abiProofOfHumanity from '../../blockchain/environment/ProofOfHumanity/abi-proof-of-humanity.json'
import addressProofOfHumanity from '../../blockchain/environment/ProofOfHumanity/address-proof-of-humanity.json'

function PensionWallet() {
  const [walletDesconected, setWalletDesconected] = React.useState(true)
  const [addressWallet, setAdressWallet] = React.useState('')

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await web3Provider.send('eth_requestAccounts', [])
      const wallet = accounts[0]
      
      const verification = await verifyInProofOfHumanity(wallet)
      console.log('verify :', verification)
      if (verification) {
        const web3Signer = web3Provider.getSigner()
        const chanId = await web3Signer.getChainId()
        if (chanId !== 4) {
          alert("Change your network to Rinkeby's testnet!")
          return
        }
        setWalletDesconected(false)
        setAdressWallet('...' + String(wallet).slice(38))
        //setDisable(false)
      } else {
        alert('Your wallet is not registed in Proof of Humanity')
      }
    } else {
      alert('Install Metamask in your browser')
    }
  }

  const verifyInProofOfHumanity = async (wallet) => {
    const provider = ethers.providers.getDefaultProvider('mainnet')
    const proofOfHumanityContract = new ethers.Contract(addressProofOfHumanity.proofofhumanity, abiProofOfHumanity, provider)
    return await proofOfHumanityContract.isRegistered(wallet) //'0x918BD890FF76D2da0089Dbb086d258Da75960119'
  }

  return (
    <button onClick={connectWallet}>
      {walletDesconected ? 'Connect your wallet' : addressWallet}
    </button>
  )
}

export { PensionWallet }