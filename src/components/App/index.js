import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { Header } from '../../shared/Header';
import { Footer } from '../../shared/Footer';
import { PensionLoading } from '../PensionLoading';
import { PensionWallet } from '../PensionWallet';
import { PensionHome } from '../PensionHome';
import { PensionMyPension } from '../PensionMyPension';
import { PensionAbout } from '../PensionAbout';
import { PensionRegister } from '../PensionRegister';
import { PensionContribute } from '../PensionContribute';

import './App.scss';
import { Modal } from '../../shared/Modal';
import { useSelector } from 'react-redux';

function App() {
  const { modal } = useSelector((e) => e.ui);

  return (
    <div className="App__container">
      <HashRouter>
        <Header>
          <PensionWallet />
        </Header>
        <main>
          <PensionLoading />
          <Routes>
            <Route path="/" element={<PensionHome />} />
            <Route path="/about" element={<PensionAbout />} />
            <Route path="/mypension" element={<PensionMyPension />} />
            <Route path="/contribute" element={<PensionContribute />} />
            <Route path="/register" element={<PensionRegister />} />
          </Routes>
        </main>
        <Footer />
      </HashRouter>
      {modal.isOpen && <Modal />}
    </div>
  );
}

export { App };
