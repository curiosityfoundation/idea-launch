import * as M from '@effect-ts/morphic'
import * as T from '@effect-ts/core/Effect'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'
import { Decoder } from '@effect-ts/morphic/Decoder/common'
import { Encoder } from '@effect-ts/morphic/Encoder/base'

export type Endpoint<E, B> = {
  name: string
  handler: (args: unknown, uid: UUID) => T.Effect<E, void, B>
}
