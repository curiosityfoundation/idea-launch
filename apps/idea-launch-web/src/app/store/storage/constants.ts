import * as A from '@effect-ts/core/Array'
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'

import { makeTable, Table } from '@idea-launch/redux-table'

interface UploadRequested {
  type: 'UploadRequested'
  payload: {
    file: File
  }
}

interface UploadStarted {
  type: 'UploadStarted'
  payload: {
    id: string
    file: File
  }
}

interface UploadProgressChanged {
  type: 'UploadProgressChanged'
  payload: {
    id: string
    progress: number
  }
}

interface UploadSucceeded {
  type: 'UploadSucceeded'
  payload: {
    id: string
  }
}

interface UploadFailed {
  type: 'UploadFailed'
  payload: {
    id: string
    reason: string
  }
}

export const StorageAction = makeADT('type')({
  UploadRequested: ofType<UploadRequested>(),
  UploadStarted: ofType<UploadStarted>(),
  UploadProgressChanged: ofType<UploadProgressChanged>(),
  UploadSucceeded: ofType<UploadSucceeded>(),
  UploadFailed: ofType<UploadFailed>(),
})

export type StorageAction = ADTType<typeof StorageAction>

interface Upload {
  id: string,
  progress: number
}

export const {
  initState: initUploadsTableState,
  reducer: uploadsTableReducer,
  Action: UploadTableAction,
} = makeTable<Upload>()('uploads')

export type UploadsTable = Table<Upload>
export type UploadsTableAction = ADTType<typeof UploadTableAction>
