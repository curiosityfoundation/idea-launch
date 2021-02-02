import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'

export interface UUIDGen {
  generate: T.UIO<string>
  generateLen: (len: number) => T.UIO<string>
}

export const UUIDGen = tag<UUIDGen>()

export const generate = T.accessServiceM(UUIDGen)(
  (uuid) => uuid.generate
)

export const generateLen = (len: number) =>T.accessServiceM(UUIDGen)(
  (uuid) => uuid.generateLen(len)
)
 