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

type ListProjectsState = ADTType<typeof ListProjectsState>
type ListProjectsAction = ADTType<typeof ListProjectsAction>

const {
  initState: initListResourcesState,
  State: ListResourcesState,
  Action: ListResourcesAction,
  reducer: listResourcesReducer,
} = makeRemoteAccess(ListResources)

type ListResourcesState = ADTType<typeof ListResourcesState>
type ListResourcesAction = ADTType<typeof ListResourcesAction>

const {
  initState: initFindProfileState,
  State: FindProfileState,
  Action: FindProfileAction,
  reducer: findProfileReducer,
} = makeRemoteAccess(FindProfile)

type FindProfileState = ADTType<typeof FindProfileState>
type FindProfileAction = ADTType<typeof FindProfileAction>

const {
  initState: initCreateProfileState,
  State: CreateProfileState,
  Action: CreateProfileAction,
  reducer: createProfileReducer,
} = makeRemoteAccess(CreateProfile)

type CreateProfileState = ADTType<typeof CreateProfileState>
type CreateProfileAction = ADTType<typeof CreateProfileAction>

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
  resources: ResourceTable
  route: RouteState
  profiles: ProfileTable
  api: {
    listProjects: ListProjectsState
    listResources: ListResourcesState
    findProfile: FindProfileState
    createProfile: CreateProfileState
  }
}

export const rootReducer = combineReducers<State>({
  account: accountReducer,
  route: routeReducer,
  resources: resourceTableReducer,
  profiles: profileTableReducer,
  api: combineReducers({
    listProjects: listProjectsReducer, 
    listResources: listResourcesReducer, 
    findProfile: findProfileReducer, 
    createProfile: createProfileReducer, 
  }),
})

export const initState: State = {
  account: initAccountState,
  resources: initResourceTableState,
  route: initRouteState,
  profiles: initProfileTableState,
  api: {
    findProfile: initFindProfileState,
    listProjects: initListProjectsState,
    listResources: initListResourcesState,
    createProfile: initCreateProfileState,
  }
}

export const Action = unionADT([
  AccountAction,
  RouteAction,
  ResourceTableAction,
  ProfileTableAction,
  FindProfileAction,
  ListResourcesAction,
  ListProjectsAction,
  CreateProfileAction,
])

export type Action = ADTType<typeof Action>

export const epic = epic_<Action, State>()

export const useDispatch = () => useDispatch_<Dispatch<Action>>()
export const useSelector = <A>(fn: (s: State) => A) => useSelector_(fn)
export const useStore = () => useStore_<State, Action>()
