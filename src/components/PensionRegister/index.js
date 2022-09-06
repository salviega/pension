import './PensionRegister.scss';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
import { validateRegisterForm, verifyform } from './validateRegisterForm';

import jsonPension from '../../blockchain/environment/contract-address.json';
import pensionContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/Pension.sol/Pension.json';
import { PensionLoading } from '../PensionLoading';
import { authRegistedAction, authVerifiedAction } from '../../store/actions/authAction';
const pensionAddress = jsonPension.pensioncontract;

function PensionRegister({ loading, setLoading }) {
  const dispatch = useDispatch();
  const { isVerified, isRegisted } = useSelector(({ auth }) => auth);
  const [values, handleInputChange] = useForm({
    birthDate: '',
    gender: '',
    firstDeposite: 25,
    check: false,
  });
  const [validate, setValidate] = useState({
    birthDate: true,
    gender: true,
    firstDeposite: true,
    check: true,
  });
  const { birthDate } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verifyform(validate)) {
      console.log('form invalid');
      return;
    }
    //dispatch(authRegistedAction());

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const web3Signer = web3Provider.getSigner();
    const pensionContract = new ethers.Contract(pensionAddress, pensionContractAbi.abi, web3Signer);

    const biologySex = values.gender;
    let date = new Date();
    let now = date.getFullYear();
    const age = now - values.birthDate.split('-')[0];
    let datum = new Date(
      Date.UTC(values.birthDate.split('-')[0], values.birthDate.split('-')[1], values.birthDate.split('-')[2])
    );
    datum = datum.getTime() / 1000;
    const bornAge = datum;
    const firstQuote = values.firstDeposite;

    try {
      const response = await pensionContract.safeMint(biologySex, age, bornAge, firstQuote, { value: firstQuote.toString() });
      setLoading(true);

      web3Provider
        .waitForTransaction(response.hash)
        .then((_response) => {
          alert('Successful transaction');
          alert('You will return to the home page');
          dispatch(authRegistedAction());
          dispatch(authVerifiedAction());
          setLoading(false);
          <Navigate replace to="/" />;
        })
        .catch((_error) => {
          setLoading(false);
          alert('Failed transaction');
        });
    } catch (error) {
      setLoading(false);
      alert('Failed transaction');
    }
  };

  if (!isVerified || isRegisted) return <Navigate replace to="/" />;

  return (
    <React.Fragment>
      <h2>Get your pension</h2>
      {loading ? (
        <PensionLoading />
      ) : (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-half">
                <h4>Date of Birth</h4>
                <div className="input-group">
                  <div className="col-third">
                    <input type="date" name="birthDate" id="birthDate" value={birthDate} onChange={handleInputChange} />
                    <p className={`error-msg ${validate.birthDate && 'error-msg--hidde'}`}>
                      required field, minimum age 18 years
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-half">
                <h4>Gender</h4>
                <div className="input-group">
                  <input id="gender-male" type="radio" name="gender" value="male" onChange={handleInputChange} />
                  <label htmlFor="gender-male">Male</label>
                  <input id="gender-female" type="radio" name="gender" value="female" onChange={handleInputChange} />
                  <label htmlFor="gender-female">Female</label>
                </div>
                <p className={`error-msg ${validate.gender && 'error-msg--hidde'}`} style={{ marginTop: '6.5rem' }}>
                  required field
                </p>
              </div>
            </div>
            <div className="row">
              <h4>
                Insert your first deposite <span>(min values: $25 wei)</span>
              </h4>
              <div className="input-group input-group-icon">
                <input
                  type="number"
                  min={25}
                  placeholder="Greater than or equal to $25 wei"
                  name="firstDeposite"
                  onChange={handleInputChange}
                />
                <p className={`error-msg ${validate.firstDeposite && 'error-msg--hidde'}`}>required field</p>
              </div>
              <div className="input-group">
                <input id="terms" type="checkbox" name="check" onChange={handleInputChange} />
                <label className="space" htmlFor="terms">
                  Not your keys, not your coins
                </label>
                <p className={`error-msg ${validate.check && 'error-msg--hidde'}`}>required check</p>
              </div>
              <button
                type="submit"
                className="button-summit"
                onClick={() => {
                  setValidate({ ...validate, ...validateRegisterForm(values) });
                }}
              >
                Mint
              </button>
            </div>
          </form>
        </div>
      )}
    </React.Fragment>
  );
}

export { PensionRegister };
