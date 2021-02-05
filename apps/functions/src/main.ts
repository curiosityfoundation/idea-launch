import * as functions from 'firebase-functions'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as cors from 'cors';

import { ProfilesPersistenceLive } from '@idea-launch/profiles/persistence'
import { projectsPersistenceMock } from '@idea-launch/projects/persistence'
import { ResourcesPersistenceLive } from '@idea-launch/resources/persistence'
import {
  FirebaseAdminAppLive,
  FunctionsAuthStatusLive,
  FirebaseStorageLive,
  provideFunctionsRequestContextLive,
  FunctionsLogger,
} from '@idea-launch/firebase-functions'
import { NanoidUUIDLive } from '@idea-launch/uuid-gen'

import { handleFindProfile } from './app/find-profile'
import { handleListProjects } from './app/list-projects'
import { handleListResources } from './app/list-resources'
import { handleCreateProfile } from './app/create-profile'
import { logDefect } from './app/util'

const withCors = cors({
  origin: true,
})

const checkOrigin = (fn) => async (req, res) => {
  withCors(req as any, res, () => fn(req, res))
}

export const ListProjects =
  functions.https.onRequest(
    checkOrigin((req, res) => {
      pipe(
        handleListProjects,
        logDefect,
        T.provideSomeLayer(projectsPersistenceMock),
        T.provideSomeLayer(FunctionsAuthStatusLive),
        provideFunctionsRequestContextLive(req, res),
        T.provideSomeLayer(FirebaseAdminAppLive),
        T.provideSomeLayer(FunctionsLogger),
        T.runPromise,
      ).then(
        (raw) => {
          res.status(200)
          res.json(raw)
        },
        () => {
          res.status(500)
          res.write('internal error')
        },
      )
    })
  )

export const ListResources =
  functions.https.onRequest(
    checkOrigin((req, res) => {
      pipe(
        handleListResources,
        logDefect,
        T.provideSomeLayer(ResourcesPersistenceLive),
        T.provideSomeLayer(FirebaseStorageLive),
        T.provideSomeLayer(FirebaseAdminAppLive),
        T.provideSomeLayer(FunctionsLogger),
        T.runPromise,
      ).then(
        (raw) => {
          res.status(200)
          res.json(raw)
        },
        () => {
          res.status(500)
          res.write('internal error')
        },
      )
    })
  )

export const FindProfile =
  functions.https.onRequest(
    checkOrigin((req, res) => {
      pipe(
        handleFindProfile,
        logDefect,
        T.provideSomeLayer(ProfilesPersistenceLive),
        T.provideSomeLayer(FunctionsAuthStatusLive),
        provideFunctionsRequestContextLive(req, res),
        T.provideSomeLayer(FirebaseStorageLive),
        T.provideSomeLayer(FirebaseAdminAppLive),
        T.provideSomeLayer(FunctionsLogger),
        T.provideSomeLayer(NanoidUUIDLive),
        T.runPromise,
      ).then(
        (raw) => {
          res.status(200)
          res.json(raw)
        },
        () => {
          res.status(500)
          res.write('internal error')
        },
      )
    })
  )
  
export const CreateProfile =
  functions.https.onRequest(
    checkOrigin((req, res) => {
      pipe(
        handleCreateProfile,
        logDefect,
        T.provideSomeLayer(ProfilesPersistenceLive),
        T.provideSomeLayer(FunctionsAuthStatusLive),
        provideFunctionsRequestContextLive(req, res),
        T.provideSomeLayer(FirebaseStorageLive),
        T.provideSomeLayer(FirebaseAdminAppLive),
        T.provideSomeLayer(FunctionsLogger),
        T.provideSomeLayer(NanoidUUIDLive),
        T.runPromise,
      ).then(
        (raw) => {
          res.status(200)
          res.json(raw)
        },
        () => {
          res.status(500)
          res.write('internal error')
        },
      )
    })
  )
