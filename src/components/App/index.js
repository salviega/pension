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

import './App.scss';
import { Modal } from '../../shared/Modal';
import { useSelector } from 'react-redux';

function App() {
  const { modal, spinner } = useSelector((e) => e.ui);

  return (
    <HashRouter>
      <div className="App__container">
        <Header>
          <PensionWallet />
        </Header>
        <main>
          {spinner.isActive && <PensionLoading />}
          <Routes>
            <Route path="/" element={<PensionHome />} />
            <Route path="/about" element={<PensionAbout />} />
            <Route path="/mypensions" element={<PensionMyPension />} />
            <Route path="/register" element={<PensionRegister />} />
          </Routes>
        </main>
        <Footer />
        {modal.isOpen && <Modal />}
      </div>
    </HashRouter>
  );
}

export { App };
