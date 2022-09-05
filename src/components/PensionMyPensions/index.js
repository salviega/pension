import './PensionMyPensions.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { PensionOfUser } from './PensionOfUser/index.js';
import { PensionStadistic } from './PensionStadistic/PensionStadistic.js';
import { getSubGraphData } from '../../middleware/getSubGraphData';

function PensionMyPensions() {
  const { getAllElementsByItem: getAllQuotesByAddress } = getSubGraphData();
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  const { wallet } = useSelector(({ auth }) => auth);

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
    },
  ];

  useEffect(() => {
    const getData = async () => {
      return await getAllQuotesByAddress(wallet);
    };

    getData().then((info) => {
      const infoLavel = [];
      const infoData = [];
      for (const item of info) {
        infoLavel.push(item.timeDeposit);
        infoData.push(item.contributorAmount);
      }
      setData(infoData);
      setLabels(infoLavel);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
    console.log({ labels, data });
  }, [labels, data]);

  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;

  return (
    <div className="my-pensions-container">
      <div className="my-pensions-container__pensions-list">
        {mockPension.map((pension) => (
          <PensionOfUser key={pension.pensionAddress} {...pension}></PensionOfUser>
        ))}
      </div>
      <PensionStadistic labels={labels} data={data} />
    </div>
  );
}

export { PensionMyPensions };
