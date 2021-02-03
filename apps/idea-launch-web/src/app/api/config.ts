import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { tag } from '@effect-ts/core/Has'

export interface APIConfig {
  functionsUrl: string
}

export const APIConfig = tag<APIConfig>()

export const accessAPIConfig = T.accessService(APIConfig)
export const accessAPIConfigM = T.accessServiceM(APIConfig)

export const APIConfigLive = (functionsUrl: string) => L.pure(APIConfig)({
  functionsUrl,
})
