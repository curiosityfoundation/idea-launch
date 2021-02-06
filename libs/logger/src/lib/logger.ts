import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { tag } from '@effect-ts/core/Has'

export interface Logger {
  log: (s1: any) => T.UIO<void>
  warn: (s1: any) => T.UIO<void>
}

export const Logger = tag<Logger>()

export const accessLogger = T.accessService(Logger)
export const accessLoggerM = T.accessServiceM(Logger)

export const ConsoleLoggerLive = L.pure(Logger)({
  log: (s1) =>
    T.effectTotal(() => {
      console.log(s1)
    }),
  warn: (s1) =>
    T.effectTotal(() => {
      console.warn(s1)
    })
})

export const SilentLoggerLive = L.pure(Logger)({
  log: (s1) => T.unit,
  warn: (s1) => T.unit
})

export const log = <A>(a: A) =>
  accessLoggerM((logger) => logger.log(a))

export const warn = <A>(a: A) =>
  accessLoggerM((logger) => logger.warn(a))
