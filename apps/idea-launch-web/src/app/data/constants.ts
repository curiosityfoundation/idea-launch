import { unionADT, ADTType } from '@effect-ts/morphic/Adt'
import { combineReducers } from 'redux'

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
import { Table, makeTable } from '@idea-launch/redux-table'

import { Upload } from '../storage'

export const {
  initState: initUploadsTableState,
  reducer: uploadsTableReducer,
  Action: UploadTableAction,
} = makeTable<Upload>()('uploads')

export type UploadsTable = Table<Upload>
export type UploadsTableAction = ADTType<typeof UploadTableAction>


export interface DataState {
  uploads: UploadsTable,
  resources: ResourceTable,
  profiles: ProfileTable,
}

export const dataReducer = combineReducers<DataState>({
  uploads: uploadsTableReducer,
  resources: resourceTableReducer,
  profiles: profileTableReducer,
})

export const initDataState: DataState = {
  uploads: initUploadsTableState,
  resources: initResourceTableState,
  profiles: initProfileTableState,
}

export const DataAction = unionADT([
  ProfileTableAction,
  ResourceTableAction,
  UploadTableAction,
])

export type DataAction = ADTType<typeof DataAction>
