import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'

interface UploadRequested {
  type: 'UploadRequested'
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
  UploadProgressChanged: ofType<UploadProgressChanged>(),
  UploadSucceeded: ofType<UploadSucceeded>(),
  UploadFailed: ofType<UploadFailed>(),
})

export type StorageAction = ADTType<typeof StorageAction>

interface InProgress {
  state: 'InProgress'
  id: string
  progress: number
}

interface Failed {
  state: 'Failed'
  id: string
  reason: string
}

interface Complete {
  state: 'Complete'
  id: string
  url: string
}

export const Upload = makeADT('state')({
  InProgress: ofType<InProgress>(),
  Failed: ofType<Failed>(),
  Complete: ofType<Complete>(),
})

export type Upload = ADTType<typeof Upload>
