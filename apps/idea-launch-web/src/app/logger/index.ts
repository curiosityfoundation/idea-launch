import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { tag } from '@effect-ts/core/Has'

export interface Logger {
  log: (...s: any[]) => T.UIO<void>
}

export const Logger = tag<Logger>()

export const accessAppConfig = T.accessService(Logger)
export const accessAppConfigM = T.accessServiceM(Logger)

export const ConsoleLoggerLive = L.pure(Logger)({
  log: (...s) =>
    T.effectTotal(() => {
      console.log(...s)
    })
})

export const SilentLoggerLive = L.pure(Logger)({
  log: () => T.unit
})

export const {
  log
} = T.deriveLifted(Logger)(
  ['log'],
  [] as never,
  [] as never,
)
