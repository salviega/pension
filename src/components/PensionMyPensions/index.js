import './PensionMyPensions.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PensionOfUser } from './PensionOfUser/index.js';
import { PensionStadistic } from './PensionStadistic/PensionStadistic.js';
import { getSubGraphData } from '../../middleware/getSubGraphData';
import { PensionLoading } from '../PensionLoading';
import { ethers } from 'ethers';

function PensionMyPensions() {
  const { getPensionByAddress, getAllQuotesByAddress } = getSubGraphData();
  
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);
  const { wallet } = useSelector(({ auth }) => auth);
  
  const [ data, setData] = React.useState([]);
  const [ labels, setLabels] = React.useState([]);
  const [ pensions, setPensions ] = React.useState([])
  const [ totalAmount, setTotalAmount] = React.useState('');
  const [ loading, setLoading] = React.useState(true)


  React.useEffect(() => {
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
        getQuotes().then((response) => {
          console.log(response)
          const infoLavel = [];
          const infoData = [];
          let amount = 0;
          
          for (const item of response) {
            infoLavel.push(item.contributionDate);
            infoData.push(item.totalAmount);
            amount += item.totalAmount
          }
          setTotalAmount(Math.round(ethers.utils.formatEther(amount), 2))
          setData(infoData);
          setLabels(infoLavel);
        });
        setLoading(false);
        return;
      }
      setPensions()
    })
  }, []);

  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;

  return (
    <React.Fragment>
    {loading && <PensionLoading/>}
    <div className="my-pensions-container">
      <div className="my-pensions-container__pensions-list">
        {loading ? <PensionLoading/> : pensions.map((pension, index) => (
          <PensionOfUser key={index} {...pension}  totalAmount={totalAmount} setLoading={setLoading} ></PensionOfUser>
        ))}
      </div>
      {loading ? <PensionLoading/> : <PensionStadistic labels={labels} data={data} />}
    </div>
    </React.Fragment>
  );
}

export { PensionMyPensions };
