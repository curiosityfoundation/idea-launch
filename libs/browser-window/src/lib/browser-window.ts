import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'

export interface BrowserWindow {
  window: Window
}

export const BrowserWindow = tag<BrowserWindow>()

export const accessBrowserWindow = T.accessService(BrowserWindow)
export const accessBrowserWindowM = T.accessServiceM(BrowserWindow)

export const BrowserWindowLive = (window: Window) => L.pure(BrowserWindow)({ window })
