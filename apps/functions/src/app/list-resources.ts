import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'

import { listResources } from '@idea-launch/resources/persistence'
import { ListResources, handler } from '@idea-launch/api'

export const handleListResources = handler(ListResources)(
  ({ Response }) => pipe(
    listResources,
    T.map((resources) =>
      Response.of.Success({
        resources,
      })
    ),
    T.catchAll((err) =>
      T.succeed(
        Response.of.Failure({
          reason: err.reason,
        })
      )
    ),
    T.chain(encode(Response)),
  )
)
