import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

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
import { store } from '../../store';

function App() {
  return (
    <div className="App__container">
      <Provider store={store}>
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
      </Provider>
    </div>
  );
}

export { App };
