import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'

export interface BrowserWindow {
  window: Window
}

export const BrowserWindow = tag<BrowserWindow>()

export const accessBrowserWindow = T.accessService(BrowserWindow)
export const accessBrowserWindowM = T.accessServiceM(BrowserWindow)
