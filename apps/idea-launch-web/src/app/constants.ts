import { unionADT, ADTType } from '@effect-ts/morphic/Adt'
import { combineReducers } from 'redux'
import { Dispatch } from 'react';
import { 
  useDispatch as useDispatch_, 
  useSelector as useSelector_, 
  useStore as useStore_ 
} from 'react-redux'

import { epic as epic_ } from '@idea-launch/redux-effect';

import { AccountState, AccountAction, accountReducer, initAccountState } from '@idea-launch/accounts/ui'
import { ResourcesState, ResourcesAction, resourcesReducer, initResourcesState } from '@idea-launch/resources/ui'

export const State = {
  account: AccountState,
  resources: ResourcesState,
}

export interface State {
  account: AccountState
  resources: ResourcesState
}

export const reducer = combineReducers<State>({
  account: accountReducer,
  resources: resourcesReducer,
})

export const initState: State = {
  account: initAccountState,
  resources: initResourcesState,
}

export const Action = unionADT([
  AccountAction,
  ResourcesAction,
])

export type Action = ADTType<typeof Action>

export const epic = epic_<Action, State>()

export const useDispatch = () => useDispatch_<Dispatch<Action>>()
export const useSelector = <A>(fn: (s: State) => A) => useSelector_(fn)
export const useStore = () => useStore_<State, Action>()
