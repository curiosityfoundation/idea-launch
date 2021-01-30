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
} from '@idea-launch/api'
import {
  AccountState,
  AccountAction,
  accountReducer,
  initAccountState
} from '@idea-launch/accounts/ui'
import {
  ResourcesTable,
  ResourceAction,
  resourcesReducer,
  initResourcesState
} from '@idea-launch/resources/ui'
import {
  ProfileTable,
  ProfileTableAction,
  profileTableReducer,
  initProfileTableState,
} from '@idea-launch/profiles/ui'
import { epic as epic_ } from '@idea-launch/redux-effect';

import {
  RouteState,
  RouteAction,
  routeReducer,
  initRouteState
} from '../router'

const {
  initState: initListProjectsState,
  State: ListProjectsState,
  Action: ListProjectsAction,
  reducer: listProjectsReducer,
} = makeRemoteAccess(ListProjects)

const {
  initState: initListResourcesState,
  State: ListResourcesState,
  Action: ListResourcesAction,
  reducer: listResourcesReducer,
} = makeRemoteAccess(ListResources)

const {
  initState: initFindProfileState,
  State: FindProfileState,
  Action: FindProfileAction,
  reducer: findProfileReducer,
} = makeRemoteAccess(FindProfile)

export const State = {
  account: AccountState,
  profile: FindProfileState,
  api: {
    listProjects: ListProjectsState, 
    listResources: ListResourcesState, 
    findProfile: FindProfileState, 
  },
}

export interface State {
  account: AccountState
  resources: ResourcesTable
  route: RouteState
  profiles: ProfileTable,
  api: {
    listProjects: ADTType<typeof ListProjectsState>, 
    listResources: ADTType<typeof ListResourcesState>, 
    findProfile: ADTType<typeof FindProfileState>, 
  }
}

export const rootReducer = combineReducers<State>({
  account: accountReducer,
  resources: resourcesReducer,
  route: routeReducer,
  profiles: profileTableReducer,
  api: combineReducers({
    listProjects: listProjectsReducer, 
    listResources: listResourcesReducer, 
    findProfile: findProfileReducer, 
  }),
})

export const initState: State = {
  account: initAccountState,
  resources: initResourcesState,
  route: initRouteState,
  profiles: initProfileTableState,
  api: {
    findProfile: initFindProfileState,
    listProjects: initListProjectsState,
    listResources: initListResourcesState,
  }
}

export const Action = unionADT([
  AccountAction,
  RouteAction,
  ResourceAction,
  ProfileTableAction,
  FindProfileAction,
  ListResourcesAction,
  ListProjectsAction,
])

export type Action = ADTType<typeof Action>

export const epic = epic_<Action, State>()

export const useDispatch = () => useDispatch_<Dispatch<Action>>()
export const useSelector = <A>(fn: (s: State) => A) => useSelector_(fn)
export const useStore = () => useStore_<State, Action>()
