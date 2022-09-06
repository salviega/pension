import './PensionRegister.scss';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';

import jsonPension from "../../blockchain/environment/contract-address.json";
import pensionContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/Pension.sol/Pension.json";
const pensionAddress = jsonPension.pensioncontract;

function PensionRegister() {
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const pensionContract = new ethers.Contract(
        pensionAddress,
        pensionContractAbi.abi,
        web3Signer
      );
      console.log(pensionContract)
  };

  //if (isVerified || !isRegisted) return <Navigate replace to="/" />;
  return (
    <React.Fragment>
      <h2>Get your pension</h2>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-half">
              <h4>Date of Birth</h4>
              <div className="input-group">
                <div className="col-third">
                  <input type="text" placeholder="DD" />
                </div>
                <div className="col-third">
                  <input type="text" placeholder="MM" />
                </div>
                <div className="col-third">
                  <input type="text" placeholder="YYYY" />
                </div>
              </div>
            </div>
            <div className="col-half">
              <h4>Gender</h4>
              <div className="input-group">
                <input id="gender-male" type="radio" name="gender" value="male" />
                <label htmlFor="gender-male">Male</label>
                <input id="gender-female" type="radio" name="gender" value="female" />
                <label htmlFor="gender-female">Female</label>
              </div>
            </div>
          </div>
          <div className="row">
            <h4>Insert your first deposite</h4>
            <div className="input-group input-group-icon">
              <input type="text" placeholder="Greater than or equal to $25 wei" />
            </div>
            <div className="input-group">
              <input id="terms" type="checkbox" />
              <label className="space" htmlFor="terms">
                Not your keys, not your coins
              </label>
            </div>
            <button type="submit" className="button-summit">
              Crear
            </button>
          </div>
        </form>
      </div>
    </ React.Fragment>
  );
}

export { PensionRegister };
