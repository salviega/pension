import './PensionMyPensions.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { PensionOfUser } from './PensionOfUser/index.js'
import { PensionStadistic } from './PensionStadistic/PensionStadistic.js'
import { getSubGraphData } from '../../middleware/getSubGraphData';

function PensionMyPensions() {
  const { getAllElementsByItem: getAllQuotesByAddress } = getSubGraphData();
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  const mockPension = [
    {
      pensionAddress: '0x8f3ab4c0d4d41694fea84e30b1309b0628abdb99',
      PensionName: 'Pension 1',
      totalContributions: 100000,
      totalReturns: 1300,
    },
    {
      pensionAddress: '0xf0a3b9f19afc040c39a50001760ca1659fb7871b',
      PensionName: 'Pension 2',
      totalContributions: 300000,
      totalReturns: 3600,
    }
  ]

  React.useEffect(() => {
    const data = async (address) => {
      console.log( await getAllQuotesByAddress(address))
    }
    //data(address);
  }, [])
  
  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;
  
  return (
    <div className="my-pensions-container">
      <div className='my-pensions-container__pensions-list'>
        {mockPension.map(pension => (
          <PensionOfUser key={pension.pensionAddress} {...pension} ></PensionOfUser>
        ))}
      </div>
      <PensionStadistic />

    </div>
  );
}

export { PensionMyPensions };
