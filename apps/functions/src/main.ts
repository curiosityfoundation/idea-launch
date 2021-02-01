import * as functions from 'firebase-functions'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as cors from 'cors';

import { profilesPersistenceMock } from '@idea-launch/profiles/persistence'
import { projectsPersistenceMock } from '@idea-launch/projects/persistence'
import { resourcesPersistenceMock } from '@idea-launch/resources/persistence'
import {
  FirebaseAdminAppLive,
  FunctionsAuthStatusLive,
  provideFunctionsRequestContextLive
} from '@idea-launch/firebase-functions'

import { handleFindProfile } from './app/find-profile'
import { handleListProjects } from './app/list-projects'
import { handleListResources } from './app/list-resources'
import { handleCreateProfile } from './app/create-profile'

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
        T.provideSomeLayer(projectsPersistenceMock),
        T.provideSomeLayer(FunctionsAuthStatusLive),
        provideFunctionsRequestContextLive(req, res),
        T.provideSomeLayer(FirebaseAdminAppLive),
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
        T.provideSomeLayer(resourcesPersistenceMock),
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
        T.provideSomeLayer(profilesPersistenceMock),
        T.provideSomeLayer(FunctionsAuthStatusLive),
        provideFunctionsRequestContextLive(req, res),
        T.provideSomeLayer(FirebaseAdminAppLive),
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
        T.provideSomeLayer(profilesPersistenceMock),
        T.provideSomeLayer(FunctionsAuthStatusLive),
        provideFunctionsRequestContextLive(req, res),
        T.provideSomeLayer(FirebaseAdminAppLive),
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
