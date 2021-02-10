import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { reduxEpic } from '@idea-launch/redux-effect'

import { AppAction, AppState } from '../constants'
import { AccountAction } from '@idea-launch/accounts/ui'

export const ResetStateOnLogout =
  reduxEpic<AccountAction, AppState, AppAction>()(
    (actions, getState) =>
      pipe(
        actions,
        S.filter(AccountAction.is.LogoutSuccess),
        S.mapConcat(() => [
          AppAction.of.APIReset({
            payload: {
              endpoint: 'CreateProfile'
            }
          }),
          AppAction.of.APIReset({
            payload: {
              endpoint: 'CreateProject'
            }
          }),
          AppAction.of.APIReset({
            payload: {
              endpoint: 'FindProfile'
            }
          }),
          AppAction.of.APIReset({
            payload: {
              endpoint: 'ListProjects'
            }
          }),
          AppAction.of.ClearEntries({
            payload: {
              table: 'profiles'
            }
          }),
          AppAction.of.ClearEntries({
            payload: {
              table: 'projects'
            }
          }),
          AppAction.of.ClearEntries({
            payload: {
              table: 'uploads'
            }
          })
        ])
      )
  )
