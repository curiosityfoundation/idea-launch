import { unionADT, ADTType } from '@effect-ts/morphic/Adt'
import { combineReducers } from 'redux'

import { AccountAction, AccountState, accountReducer } from '@idea-launch/accounts/ui'

import { DataAction, DataState, dataReducer } from '../data'
import { APIAction, APIState, APIReducer } from '../api'
import { RouteAction, RouteState, routeReducer } from '../router'
import { StorageAction } from '../storage'

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
  APIAction,
  AccountAction,
  RouteAction,
  DataAction,
  StorageAction,
])

export type AppAction = ADTType<typeof AppAction>
