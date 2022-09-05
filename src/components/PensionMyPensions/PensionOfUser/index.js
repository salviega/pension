import { ethers } from "ethers";
import React from "react";

import jsonPension from "../../../blockchain/environment/contract-address.json";
import pensionContractAbi from "../../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/Pension.sol/Pension.json";
const pensionAddress = jsonPension.pensioncontract;

function PensionOfUser({ age, biologySex, bornAge, id, owner, pensionCreatedTime, retirentmentData, setLoading, totalAmount}) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const amount = event.target.value.value;
      const pensionContract = new ethers.Contract(
        pensionAddress,
        pensionContractAbi.abi,
        web3Signer
      );
      const response = await pensionContract.depositAmount(
        id,
        event.target.value.value,
        { value: amount.toString() }
      );
      web3Provider
        .waitForTransaction(response.hash)
        .then((_response) => {
          setLoading(false);
          alert("Successful transaction");
        })
        .catch((_error) => {
          setLoading(false);
          alert("Failed transaction");
        });
    } catch (error) {
      setLoading(false);
      alert("Failed transaction");
    }
  };
  return (
    <React.Fragment>
      <div className="pension-item__header">
        <div className="my-pensions-container__pensions-list__item">
          <span className="pension-item__header__pension-name">
            Token id: {id}
          </span>
          <a
            href={`https://rinkeby.etherscan.io/${owner}`}
            className="pension-item__header__pension-address"
          >
            Address: {owner}
          </a>
        <div>
          <span className="pension-item__title">Total pension: </span>
          <span className="pension-item__value">Eth {totalAmount}</span>
        </div>
        <div>
          <span className="pension-item__title">Age: </span>
          <span className="pension-item__value">{age}</span>
        </div>
        <div>
          <span className="pension-item__title">Biology sex: </span>
          <span className="pension-item__value">{biologySex}</span>
        </div>
        <div>
          <span className="pension-item__title">Year of bith: </span>
          <span className="pension-item__value">{bornAge}</span>
        </div>
        <div>
          <span className="pension-item__title">Mintend time: </span>
          <span className="pension-item__value">{pensionCreatedTime}</span>
        </div>
        <div>
          <span className="pension-item__title">retirentment data: </span>
          <span className="pension-item__value">{retirentmentData}</span>
        </div>
        <form className="pension-form" onSubmit={handleSubmit}>
          <input
            className="pension-form__deposit"
            name="value"
            type="number"
            min="25"
            placeholder="Greater than or equal to $25 wei"
            />
          <button className="pension-form__submit" type="submit">
            Deposit
          </button>
        </form>
            </div>
      </div>
    </React.Fragment>
  );
}

export { PensionOfUser };
