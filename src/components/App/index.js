import './App.scss';
import React from 'react';
import { PensionWallet } from '../PensionWallet';
import { Header } from '../../shared/Header';

function App() {
  return (
    <React.Fragment>
      <Header>
        <PensionWallet />
      </Header>
    </React.Fragment>
  );
}

export { App };
