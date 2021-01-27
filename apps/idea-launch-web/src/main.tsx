import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './app/app';
import { initStore } from './app/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={initStore()}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
