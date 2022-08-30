import './PensionMyPension.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PensionMyPension() {
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;
  return (
    <article className="pension">
      <div className="pension__header">
        <h3 className="pension__title">UBI-ETH</h3>
        <button className="pension__btn">Deposit</button>
      </div>
      <div className="pension__body">
        <div className="pension__description">
          <p>Total deposited</p>
          <p>$25,853</p>
        </div>
        <div className="pension__description">
          <p>Pool rate</p>
          <p>0 UBI / week</p>
        </div>
      </div>
    </article>
  );
}

export { PensionMyPension };
