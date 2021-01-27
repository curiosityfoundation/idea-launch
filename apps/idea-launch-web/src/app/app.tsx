import * as T from '@effect-ts/core/Effect';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Pages } from './pages';
import { ReduxStore, EpicMiddleware } from './store'

export const RenderApp = T.accessServicesM({
  redux: ReduxStore,
  epic: EpicMiddleware,
})(({ redux, epic }) =>
  T.collectAllUnit([
    T.effectTotal(() => {
      ReactDOM.render(
        <React.StrictMode>
          <Provider store={redux.store}>
            <Pages />
          </Provider>
        </React.StrictMode>,
        document.getElementById('root')
      )
    }),
    epic.runRootEpic,
  ])
)
