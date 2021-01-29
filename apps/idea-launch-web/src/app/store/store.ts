import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { tag } from '@effect-ts/core/Has'
import { configureStore, Store, ConfigureStoreOptions } from '@reduxjs/toolkit'

import { accessEpicMiddleware } from './epics'

export interface ReduxStore {
  store: Store
}

export const ReduxStore = tag<ReduxStore>()

const makeReduxStore = (options: Omit<ConfigureStoreOptions, 'middleware'>) =>
  accessEpicMiddleware(
    ({ middleware }): ReduxStore => ({
      store: configureStore({
        ...options,
        middleware: [middleware],
      })
    })
  )

export const accessReduxStore = T.accessService(ReduxStore)
export const accessReduxStoreM = T.accessServiceM(ReduxStore)

export function ReduxStoreLive(
  options: Omit<ConfigureStoreOptions, 'middleware'>
) {
  return L.fromEffect(ReduxStore)(makeReduxStore(options))
}
