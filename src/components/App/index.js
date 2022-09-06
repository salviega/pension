import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from '../../shared/Header';
import { Footer } from '../../shared/Footer';
import { PensionLoading } from '../PensionLoading';
import { PensionWallet } from '../PensionWallet';
import { PensionHome } from '../PensionHome';
import { PensionAbout } from '../PensionAbout';
import { PensionMyPensions } from '../PensionMyPensions';
import { PensionRegister } from '../PensionRegister';

import './App.scss';
import { Modal } from '../../shared/Modal';
import { PensionContext } from '../PensionContext';
import { PensionError } from '../PensionError';
import { authLoguotAction } from '../../store/actions/authAction';

function App() {
  const dispatch = useDispatch();

  const { loading, setLoading, error } = React.useContext(PensionContext);
  const { modal } = useSelector((e) => e.ui);

  React.useEffect(() => {
    const currentNetwork = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const chainId = await web3Signer.getChainId();
      return chainId;
    };
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        currentNetwork().then((response) => {
          if (response !== 4) {
            dispatch(authLoguotAction());
            //window.location.reload();
          }
        });
      });
      window.ethereum.on('accountsChanged', () => {
        dispatch(authLoguotAction());
        //window.location.reload();
      });
    }
  }, [dispatch]);
  
  return (
    <HashRouter>
      <div className="App__container">
        <Header>
          <PensionWallet />
        </Header>
        <main>
          {error && <PensionError />}
          {loading && <PensionLoading />}
          <Routes>
            <Route path="/" element={<PensionHome />} />
            <Route path="/about" element={<PensionAbout />} />
            <Route path="/mypensions" element={<PensionMyPensions />} />
            <Route path="/register" element={<PensionRegister loading={loading} setLoading={setLoading} />} />
          </Routes>
        </main>
        <Footer />
        {modal.isOpen && <Modal />}
      </div>
    </HashRouter>
  );
}

export { App };
