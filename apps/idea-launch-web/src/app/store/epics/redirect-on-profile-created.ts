import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { reduxEpic } from '@idea-launch/redux-effect'
import { AccountState } from '@idea-launch/accounts/ui'

import { AppState } from '../constants'
import { APIAction } from '../../api'
import { Route, RouteAction } from '../../router'

export const RedirectOnProfileCreatedEpic =
  reduxEpic<APIAction, AppState, RouteAction | APIAction>()(
    (actions, getState) =>
      pipe(
        actions,
        S.filter(APIAction.is.APIRequestSucceeded),
        S.filter((a) => a.payload.endpoint === 'CreateProfile'),
        S.mapM(() => getState),
        S.mapConcat((s) => [
          APIAction.of.APIRequested({
            payload: {
              endpoint: 'FindProfile',
              body: {},
              jwt: pipe(
                s.account,
                AccountState.matchStrict({
                  LoggedIn: ({ idToken }) => idToken,
                  LoggedOut: () => '',
                  LoggingIn: () => '',
                  LoggingOut: () => '',
                })
              ),
            }
          }),
          RouteAction.of.LocationPushed({
            payload: Route.of.Welcome({})
          })
        ])
      )
  )
