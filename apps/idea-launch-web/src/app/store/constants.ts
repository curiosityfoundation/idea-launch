import { unionADT, ADTType } from '@effect-ts/morphic/Adt'
import { combineReducers } from 'redux'
import { Dispatch } from 'react';
import {
  useDispatch as useDispatch_,
  useSelector as useSelector_,
  useStore as useStore_,
} from 'react-redux'

import { 
  findProfileReducer, 
  FindProfileAction, 
  FindProfileState, 
  initFindProfileState 
} from '@idea-launch/api'
import { 
  AccountState, 
  AccountAction, 
  accountReducer, 
  initAccountState 
} from '@idea-launch/accounts/ui'
import { 
  ResourcesState, 
  ResourcesAction, 
  resourcesReducer, 
  initResourcesState 
} from '@idea-launch/resources/ui'
import { epic as epic_ } from '@idea-launch/redux-effect';

import { 
  RouteState, 
  RouteAction, 
  routeReducer, 
  initRouteState 
} from '../router'

export const State = {
  account: AccountState,
  resources: ResourcesState,
  profile: FindProfileState,
}

export interface State {
  account: AccountState
  resources: ResourcesState
  route: RouteState
  profile: FindProfileState,
}

export const rootReducer = combineReducers<State>({
  account: accountReducer,
  resources: resourcesReducer,
  route: routeReducer,
  profile: findProfileReducer,
})

export const initState: State = {
  account: initAccountState,
  resources: initResourcesState,
  route: initRouteState,
  profile: initFindProfileState,
}

export const Action = unionADT([
  AccountAction,
  ResourcesAction,
  RouteAction,
  FindProfileAction,
])

export type Action = ADTType<typeof Action>

export const epic = epic_<Action, State>()

export const useDispatch = () => useDispatch_<Dispatch<Action>>()
export const useSelector = <A>(fn: (s: State) => A) => useSelector_(fn)
export const useStore = () => useStore_<State, Action>()
