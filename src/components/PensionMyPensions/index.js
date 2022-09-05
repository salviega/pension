import './PensionMyPensions.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { PensionOfUser } from './PensionOfUser/index.js';
import { PensionStadistic } from './PensionStadistic/PensionStadistic.js';
import { getSubGraphData } from '../../middleware/getSubGraphData';

function PensionMyPensions() {
  const { getPensionByAddress, getAllQuotesByAddress } = getSubGraphData();
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);
  
  const [ data, setData] = useState([]);
  const [ labels, setLabels] = useState([]);
  const [ pensions, setPensions ] = useState([])

  const { wallet } = useSelector(({ auth }) => auth);

  useEffect(() => {

    const getPension = async () => {
      return await getPensionByAddress(wallet);
    }; 

    const getQuotes = async () => {
      return await getAllQuotesByAddress(wallet);
    };

    getPension().then((info) => {
      let arr = []
      if (typeof info !== Array) {
        arr.push(info)
        setPensions(arr)
        return;
      }
      setPensions(info)
    })

    getQuotes().then((info) => {
      const infoLavel = [];
      const infoData = [];
      for (const item of info) {
        infoLavel.push(item.contributionDate);
        infoData.push(item.totalAmount);
      }
      setData(infoData);
      setLabels(infoLavel);
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;

  return (
    <div className="my-pensions-container">
      <div className="my-pensions-container__pensions-list">
        {pensions.map((pension, index) => (
          <PensionOfUser key={index} {...pension}></PensionOfUser>
        ))}
      </div>
      <PensionStadistic labels={labels} data={data} />
    </div>
  );
}

export { PensionMyPensions };
