import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { tag } from '@effect-ts/core/Has'

export interface Config {
  functionsUrl: string
}

export const Config = tag<Config>()

export const accessConfig = T.accessService(Config)
export const accessConfigM = T.accessServiceM(Config)

export const ConfigLive = (functionsUrl: string) => L.pure(Config)({
  functionsUrl,
})
