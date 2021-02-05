import {
  FetchClientLive,
  HTTPHeadersLive,
  HTTPMiddlewareStackLive
} from '@idea-launch/http-client'
import { BrowserWindowLive } from '@idea-launch/browser-window'
import {
  FirebaseAppLive,
  FirebaseAuthClientLive,
  FirebaseAuthLive,
  FirebaseConfigLive,
  FirebaseLoginProviderLive,
  FirebaseAuthStateLive,
  FirebaseStorageLive
} from '@idea-launch/firebase-web'
import { SilentLoggerLive } from '@idea-launch/logger'
import { NanoidUUIDLive } from '@idea-launch/uuid-gen'

import { APIConfigLive } from '../app/api'
import {
  ReduxStoreLive,
  rootReducer,
  ReduxEffectMiddlewareLive,
  ReduxQueueLive,
} from '../app/store'

const FirebaseLayer =
  FirebaseAuthStateLive
  ['<+<'](FirebaseAuthLive)
  ['<+<'](FirebaseLoginProviderLive)
  ['<+<'](FirebaseAuthClientLive)
  ['<+<'](FirebaseStorageLive)
  ['<+<'](FirebaseAppLive)
  ['<+<'](FirebaseConfigLive({
    apiKey: process.env.NX_API_KEY,
    authDomain: process.env.NX_AUTH_DOMAIN,
    projectId: process.env.NX_PROJECT_ID,
    storageBucket: process.env.NX_STORAGE_BUCKET,
    messagingSenderId: process.env.NX_MESSAGING_SENDER_ID,
    appId: process.env.NX_APP_ID,
    measurementId: process.env.NX_MEASUREMENT_ID
  }))

const APIAccessLayer =
  FetchClientLive(fetch)
  ['<+<'](HTTPHeadersLive({
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }))
  ['<+<'](HTTPMiddlewareStackLive([]))
  ['<+<'](APIConfigLive(process.env.NX_FUNCTIONS_URL))

const MiddlewareLayer =
  ReduxEffectMiddlewareLive
  ['<+<'](ReduxQueueLive)
  ['<+<'](BrowserWindowLive(window))
  ['<+<'](FirebaseLayer)
  ['<+<'](APIAccessLayer)
  ['<+<'](SilentLoggerLive)
  ['<+<'](NanoidUUIDLive)

export const AppLayer =
  ReduxStoreLive({
    reducer: rootReducer,
    devTools: true,
  })
  ['<+<'](MiddlewareLayer)
