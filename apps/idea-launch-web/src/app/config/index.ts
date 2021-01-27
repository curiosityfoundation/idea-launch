import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { tag } from '@effect-ts/core/Has'

export interface AppConfig {
  functionsUrl: string
}

export const AppConfig = tag<AppConfig>()

export const accessAppConfig = T.accessService(AppConfig)
export const accessAppConfigM = T.accessServiceM(AppConfig)

export const AppConfigLive = (functionsUrl: string) => L.pure(AppConfig)({
  functionsUrl,
})
