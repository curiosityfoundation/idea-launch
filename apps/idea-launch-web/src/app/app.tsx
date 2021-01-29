import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import * as O from '@effect-ts/core/Option'
import { pipe } from '@effect-ts/core/Function'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { FirebaseAuthState, FirebaseAuthStateChanged } from './firebase'

import { Pages } from './pages';
import { ReduxStore, Action, accessReduxStoreM, accessEpicMiddlewareM } from './store'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'

const RenderReact = accessReduxStoreM((redux) =>
  T.effectTotal(() => {
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={redux.store}>
          <Pages />
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    )
  })
)

const StartMiddleware = accessEpicMiddlewareM(
  (middleware) => middleware.runRootEpic
)

const ConnectFirebaseAuthToRedux = T.accessServicesM({
  redux: ReduxStore,
  authState: FirebaseAuthState
})(({ redux, authState }) =>
  pipe(
    authState.changes,
    S.mapM(
      FirebaseAuthStateChanged.matchStrict({
        LoggedIn: (loggedIn) =>
          pipe(
            T.fromPromise(() => loggedIn.user.getIdToken(false)),
            T.chain((idToken) =>
              T.effectTotal(() => {
                redux.store.dispatch(
                  Action.of.LoginSuccess({
                    payload: {
                      userId: loggedIn.user.uid as UUID,
                      idToken,
                    }
                  })
                )
              }),
            )
          ),
        LoggedOut: () =>
          T.effectTotal(() => {
            redux.store.dispatch(
              Action.of.LogoutSuccess({})
            )
          })
      })
    ),
    S.runDrain,
  )
)

export const App =
  pipe(
    RenderReact,
    T.andThen(StartMiddleware),
    T.andThen(ConnectFirebaseAuthToRedux),
  )
