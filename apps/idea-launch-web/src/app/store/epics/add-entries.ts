import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { combineEpics, reduxEpic } from '@idea-launch/redux-effect'
import { CreateProfile, FindProfile, ListResources } from '@idea-launch/api'

import { DataAction } from '../../data'
import { APIAction } from '../../api'
import { StorageAction, Upload } from '../../storage'
import { AppAction } from '../constants'

const AddEntriesFromStorageEpic =
  reduxEpic<StorageAction, {}, DataAction>()(
    (actions) =>
      pipe(
        actions,
        S.filter(StorageAction.verified),
        S.map(
          StorageAction.matchStrict({
            UploadFailed: (a) =>
              DataAction.of.AddEntries({
                payload: {
                  table: 'uploads',
                  entries: [
                    Upload.of.Failed({
                      id: a.payload.id,
                      reason: a.payload.reason,
                    })
                  ]
                }
              }),
            UploadProgressChanged: (a) =>
              DataAction.of.AddEntries({
                payload: {
                  table: 'uploads',
                  entries: [
                    Upload.of.InProgress({
                      id: a.payload.id,
                      progress: a.payload.progress,
                    })
                  ],
                }
              }),
            UploadRequested: (a) =>
              DataAction.of.AddEntries({
                payload: {
                  table: 'uploads',
                  entries: [
                    Upload.of.InProgress({
                      id: a.payload.id,
                      progress: 0,
                    })
                  ],
                }
              }),
            UploadSucceeded: (a) =>
              DataAction.of.AddEntries({
                payload: {
                  table: 'uploads',
                  entries: [
                    Upload.of.Complete({
                      id: a.payload.id,
                      url: a.payload.url,
                    })
                  ],
                }
              }),
          })
        )
      )
  )

const AddEntriesFromAPIEpic =
  reduxEpic<APIAction, {}, DataAction>()(
    (actions) =>
      pipe(
        actions,
        S.filter(AppAction.is.APIRequestSucceeded),
        S.mapConcat((a) => {
          switch (a.payload.endpoint) {
            case 'CreateProfile':
              return CreateProfile.Response.matchStrict({
                Failure: () => [],
                Success: (response) => [
                  AppAction.of.AddEntries({
                    payload: {
                      table: 'profiles',
                      entries: [response.profile]
                    }
                  })
                ],
              })(a.payload.response)
            case 'FindProfile':
              return FindProfile.Response.matchStrict({
                Failure: () => [],
                NotFound: () => [],
                Success: (response) => [
                  AppAction.of.AddEntries({
                    payload: {
                      table: 'profiles',
                      entries: [response.profile]
                    }
                  })
                ],
              })(a.payload.response)
            case 'ListResources':
              return ListResources.Response.matchStrict({
                Failure: () => [],
                Success: (response) => [
                  AppAction.of.AddEntries({
                    payload: {
                      table: 'resources',
                      entries: response.resources
                    }
                  })
                ],
              })(a.payload.response)
            case 'ListProjects':
              return []
          }
        })
      )
  )

export const AddEntriesEpic = combineEpics([
  AddEntriesFromAPIEpic,
  AddEntriesFromStorageEpic,
])
