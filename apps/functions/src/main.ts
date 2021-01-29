import * as functions from 'firebase-functions'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'
import * as cors from 'cors';

import * as Endpoints from '@idea-launch/api'
import { profilesPersistenceMock } from '@idea-launch/profiles/persistence'
import { projectsPersistenceMock } from '@idea-launch/projects/persistence'
import { resourcesPersistenceMock } from '@idea-launch/resources/persistence'

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
        Endpoints.ListProjects.handler(
          req.body,
          'xyz' as UUID
        ),
        T.provideLayer(projectsPersistenceMock),
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
        Endpoints.ListResources.handler(
          req.body,
          'xyz' as UUID
        ),
        T.provideLayer(resourcesPersistenceMock),
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
        Endpoints.FindProfile.handler(
          req.body,
          'xyz' as UUID
        ),
        T.provideLayer(profilesPersistenceMock),
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
