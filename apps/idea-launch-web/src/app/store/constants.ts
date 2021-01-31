import { unionADT, ADTType } from '@effect-ts/morphic/Adt'
import { combineReducers } from 'redux'
import { Dispatch } from 'react';
import {
  useDispatch as useDispatch_,
  useSelector as useSelector_,
  useStore as useStore_,
} from 'react-redux'

import {
  makeRemoteAccess,
  ListProjects,
  ListResources,
  FindProfile,
  CreateProfile,
} from '@idea-launch/api'
import {
  AccountState,
  AccountAction,
  accountReducer,
  initAccountState
} from '@idea-launch/accounts/ui'
import {
  ResourceTable,
  ResourceTableAction,
  resourceTableReducer,
  initResourceTableState,
} from '@idea-launch/resources/ui'
import {
  ProfileTable,
  ProfileTableAction,
  profileTableReducer,
  initProfileTableState,
} from '@idea-launch/profiles/ui'
import { 
  reduxEffect as reduxEffect_,
} from '@idea-launch/redux-effect';

import {
  RouteState,
  RouteAction,
  routeReducer,
  initRouteState
} from '../router'

import {
  initAPIState,
  APIAction,
  APIReducer,
  APIState,
} from './api-constants'

export const State = {
  account: AccountState,
  api: APIState,
}

export interface State {
  account: AccountState
  resources: ResourceTable
  route: RouteState
  profiles: ProfileTable
  api: APIState
}

export const rootReducer = combineReducers<State>({
  account: accountReducer,
  route: routeReducer,
  resources: resourceTableReducer,
  profiles: profileTableReducer,
  api: APIReducer,
})

export const initState: State = {
  account: initAccountState,
  resources: initResourceTableState,
  route: initRouteState,
  profiles: initProfileTableState,
  api: initAPIState
}

export const Action = unionADT([
  AccountAction,
  RouteAction,
  ResourceTableAction,
  ProfileTableAction,
  APIAction,
])

export type Action = ADTType<typeof Action>

export const reduxEffect = reduxEffect_<Action, State>()

export const useDispatch = () => useDispatch_<Dispatch<Action>>()
export const useSelector = <A>(fn: (s: State) => A) => useSelector_(fn)
export const useStore = () => useStore_<State, Action>()
