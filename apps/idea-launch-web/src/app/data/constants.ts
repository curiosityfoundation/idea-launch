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
import {
  CommentTable,
  CommentTableAction,
  commentTableReducer,
  initCommentTableState,
  ProjectTable,
  ProjectTableAction,
  projectTableReducer,
  initProjectTableState,
} from '@idea-launch/projects/ui'
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
  uploads: UploadsTable
  resources: ResourceTable
  profiles: ProfileTable
  projects: ProjectTable
  comments: CommentTable
}

export const dataReducer = combineReducers<DataState>({
  uploads: uploadsTableReducer,
  resources: resourceTableReducer,
  profiles: profileTableReducer,
  projects: projectTableReducer,
  comments: commentTableReducer,
})

export const initDataState: DataState = {
  uploads: initUploadsTableState,
  resources: initResourceTableState,
  profiles: initProfileTableState,
  projects: initProjectTableState,
  comments: initCommentTableState,
}

export const DataAction = unionADT([
  ProfileTableAction,
  ResourceTableAction,
  ProjectTableAction,
  CommentTableAction,
  UploadTableAction,
])

export type DataAction = ADTType<typeof DataAction>
