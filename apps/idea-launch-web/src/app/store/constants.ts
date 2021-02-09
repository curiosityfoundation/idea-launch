import { unionADT, makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
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

interface JWTRequested {
  type: 'JWTRequested'
  payload: APIAction
}

export const JWTAction = makeADT('type')({
  JWTRequested: ofType<JWTRequested>(),
})

export type JWTAction = ADTType<typeof JWTAction>

export const AppAction = unionADT([
  APIAction,
  AccountAction,
  RouteAction,
  DataAction,
  StorageAction,
  JWTAction,
])

export type AppAction = ADTType<typeof AppAction>
