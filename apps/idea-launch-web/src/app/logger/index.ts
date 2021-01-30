import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { tag } from '@effect-ts/core/Has'

export interface Logger {
  log: <A>(s1: A) => T.UIO<A>
}

export const Logger = tag<Logger>()

export const accessLogger = T.accessService(Logger)
export const accessLoggerM = T.accessServiceM(Logger)

export const ConsoleLoggerLive = L.pure(Logger)({
  log: (s1, ...ss) =>
    T.effectTotal(() => {
      console.log(s1, ...ss)
      return s1
    })
})

export const SilentLoggerLive = L.pure(Logger)({
  log: (s1) => T.succeed(s1)
})


export const log = <A>(a: A) =>
  accessLoggerM((logger) => logger.log(a))
  