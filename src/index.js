import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './components/App';
import { PensionProvider } from './components/PensionContext';
import { store } from './store';
import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PensionProvider>
        <App />
      </PensionProvider>
    </Provider>
  </React.StrictMode>
);
