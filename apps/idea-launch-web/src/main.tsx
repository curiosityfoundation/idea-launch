import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { App } from './app/app';
import { createStore } from './app/store';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={createStore()}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
