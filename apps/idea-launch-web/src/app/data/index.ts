import { unionADT, ADTType } from '@effect-ts/morphic/Adt'

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
import { combineReducers } from 'redux'

export interface DataState {
  resources: ResourceTable,
  profiles: ProfileTable,
}

export const dataReducer = combineReducers<DataState>({
  resources: resourceTableReducer,
  profiles: profileTableReducer,
})

export const initDataState: DataState = {
  resources: initResourceTableState,
  profiles: initProfileTableState,
}

export const DataAction = unionADT([
  ProfileTableAction,
  ResourceTableAction,
])

export type DataAction = ADTType<typeof DataAction>
