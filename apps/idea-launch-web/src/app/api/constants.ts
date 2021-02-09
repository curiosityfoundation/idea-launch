import { unionADT, ADTType } from '@effect-ts/morphic/Adt'
import { combineReducers } from 'redux'

import {
  makeRemoteAccess,
  ListProjects,
  ListResources,
  FindProfile,
  CreateProfile,
  CreateProject,
} from '@idea-launch/api'

export const {
  initState: initListProjectsState,
  State: ListProjectsState,
  Action: ListProjectsAction,
  reducer: listProjectsReducer,
} = makeRemoteAccess(ListProjects)

export type ListProjectsState = ADTType<typeof ListProjectsState>
export type ListProjectsAction = ADTType<typeof ListProjectsAction>

export const {
  initState: initListResourcesState,
  State: ListResourcesState,
  Action: ListResourcesAction,
  reducer: listResourcesReducer,
} = makeRemoteAccess(ListResources)

export type ListResourcesState = ADTType<typeof ListResourcesState>
export type ListResourcesAction = ADTType<typeof ListResourcesAction>

export const {
  initState: initFindProfileState,
  State: FindProfileState,
  Action: FindProfileAction,
  reducer: findProfileReducer,
} = makeRemoteAccess(FindProfile)

export type FindProfileState = ADTType<typeof FindProfileState>
export type FindProfileAction = ADTType<typeof FindProfileAction>

export const {
  initState: initCreateProfileState,
  State: CreateProfileState,
  Action: CreateProfileAction,
  reducer: createProfileReducer,
} = makeRemoteAccess(CreateProfile)

export type CreateProfileState = ADTType<typeof CreateProfileState>
export type CreateProfileAction = ADTType<typeof CreateProfileAction>

export const {
  initState: initCreateProjectState,
  State: CreateProjectState,
  Action: CreateProjectAction,
  reducer: createProjectReducer,
} = makeRemoteAccess(CreateProject)

export type CreateProjectState = ADTType<typeof CreateProjectState>
export type CreateProjectAction = ADTType<typeof CreateProjectAction>

export interface APIState {
  listProjects: ListProjectsState
  listResources: ListResourcesState
  findProfile: FindProfileState
  createProfile: CreateProfileState
  createProject: CreateProjectState
}

export const APIState = {
  listProjects: ListProjectsState,
  listResources: ListResourcesState,
  findProfile: FindProfileState,
  createProfile: CreateProfileState,
  createProject: CreateProjectState,
}

export const APIReducer = combineReducers<APIState>({
  listProjects: listProjectsReducer,
  listResources: listResourcesReducer,
  findProfile: findProfileReducer,
  createProfile: createProfileReducer,
  createProject: createProjectReducer,
})

export const initAPIState: APIState = {
  findProfile: initFindProfileState,
  listProjects: initListProjectsState,
  listResources: initListResourcesState,
  createProfile: initCreateProfileState,
  createProject: initCreateProjectState,
}

export const APIAction = unionADT([
  FindProfileAction,
  ListResourcesAction,
  ListProjectsAction,
  CreateProfileAction,
  CreateProjectAction,
])

export type APIAction = ADTType<typeof APIAction>
