import "./PensionMyPensions.scss";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { PensionOfUser } from "./PensionOfUser/index.js";
import { PensionStadistic } from "./PensionStadistic/PensionStadistic.js";
import { getSubGraphData } from "../../middleware/getSubGraphData";
import { PensionLoading } from "../PensionLoading";
import { ethers } from "ethers";

function PensionMyPensions() {
  const { getPensionByAddress, getAllQuotesByAddress } = getSubGraphData();

  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);
  const { wallet } = useSelector(({ auth }) => auth);

  const [data, setData] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const [pensions, setPensions] = React.useState([]);
  const [totalAmount, setTotalAmount] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getPension = async () => {
      return await getPensionByAddress(wallet);
    };

    const getQuotes = async () => {
      return await getAllQuotesByAddress(wallet);
    };

    getPension().then((info) => {
      let arr = [];
      if (typeof info !== Array) {
        let newInfo = { ...info };

        let milliseconds = info.pensionCreatedTime * 1000;
        let dateObject = new Date(milliseconds);
        let humanDateFormat = dateObject.toLocaleString([], {
          hour12: false,
        });
        newInfo.pensionCreatedTime = humanDateFormat;
        milliseconds = info.retirentmentData * 1000;
        dateObject = new Date(milliseconds);
        humanDateFormat = dateObject.toLocaleString([], {
          hour12: false,
        });
        newInfo.retirentmentData = humanDateFormat;
        arr.push(newInfo);
        setPensions(arr);
        getQuotes().then((response) => {
          const infoData = [];
          const infolabel = [];
          let amount = 0;
          for (const item of response) {
            const milliseconds = item.contributionDate * 1000;
            const dateObject = new Date(milliseconds);
            const humanDateFormat = dateObject.toLocaleString([], {
              hour12: false,
            });
            infoData.push(item.totalAmount);
            infolabel.push(humanDateFormat);
            amount += item.totalAmount;
          }

          //1) combine the arrays:
          var list = [];
          for (var j = 0; j < infoData.length; j++)
            list.push({ name: infoData[j], age: infolabel[j] });

          //2) sort:
          list.sort(function (a, b) {
            return a.age < b.age ? -1 : a.age === b.age ? 0 : 1;
            //Sort could be modified to, for example, sort on the age
            // if the name is the same.
          });

          //3) separate them back out:
          for (var k = 0; k < list.length; k++) {
            infolabel[k] = list[k].name;
            infoData[k] = list[k].age;
          }
          setTotalAmount(Math.round(ethers.utils.formatEther(amount), 2));
          setData(infolabel);
          setLabels(infoData);
        });
        setLoading(false);
        return;
      }
      setPensions();
    });
  }, []);

  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;

  return (
    <React.Fragment>
      {loading && <PensionLoading />}
      <div className="my-pensions-container">
        <div className="my-pensions-container__pensions-list">
          {loading ? (
            <PensionLoading />
          ) : (
            pensions.map((pension, index) => (
              <PensionOfUser
                key={index}
                {...pension}
                totalAmount={totalAmount}
                setLoading={setLoading}
              ></PensionOfUser>
            ))
          )}
        </div>
        {loading ? (
          <PensionLoading />
        ) : (
          <PensionStadistic labels={labels} data={data} />
        )}
      </div>
    </React.Fragment>
  );
}

export { PensionMyPensions };
