import './PensionMyPensions.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { PensionMyPension } from '../PensionMyPension';

function PensionMyPensions() {
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;

  const arr = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];

  return (
    <div className="pensions">
      {arr.map((id) => (
        <PensionMyPension key={id} />
      ))}
    </div>
  );
}

export { PensionMyPensions };
