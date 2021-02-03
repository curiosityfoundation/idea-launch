import { unionADT, ADTType } from '@effect-ts/morphic/Adt'
import { combineReducers } from 'redux'

import { AccountAction, AccountState, AccountEpic, accountReducer } from '@idea-launch/accounts/ui'

import { DataAction, DataState, dataReducer } from '../data'
import { APIAction, APIState, APIEpic, APIReducer } from '../api'
import { RouteAction, RouteState, RouterEpic, routeReducer } from '../router'

export const AppState = {
  account: AccountState,
  api: APIState,
}

export interface AppState {
  account: AccountState
  api: APIState
  route: RouteState
  data: DataState
}

export const rootReducer = combineReducers<AppState>({
  account: accountReducer,
  route: routeReducer,
  data: dataReducer,
  api: APIReducer,
})

export const AppAction = unionADT([
  AccountAction,
  RouteAction,
  DataAction,
  APIAction,
])

export type AppAction = ADTType<typeof AppAction>
