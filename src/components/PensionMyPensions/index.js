import './PensionMyPensions.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PensionMyPensions() {
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;
  return <h1>{':d'}</h1>;
}

export { PensionMyPensions };
