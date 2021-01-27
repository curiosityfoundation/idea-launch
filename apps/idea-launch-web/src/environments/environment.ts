import { 
  FetchClientLive, 
  HTTPHeadersLive, 
  HTTPMiddlewareStackLive 
} from '@idea-launch/http-client'
import { BrowserWindowLive } from '@idea-launch/browser-window'

import { AppConfigLive } from '../app/config'
import { ConsoleLoggerLive } from '../app/logger'
import {
  FirebaseAppLive,
  FirebaseAuthClientEmulator,
  FirebaseAuthLive,
  FirebaseConfigLive,
  FirebaseLoginProviderLive
} from '../app/firebase'
import { 
  ReduxStoreLive, 
  rootReducer, 
  EpicMiddlewareLive 
} from '../app/store'

const AuthLayer =
  FirebaseAuthLive
  ['<<<'](FirebaseLoginProviderLive)
  ['<<<'](FirebaseAuthClientEmulator(process.env.NX_EMULATOR_URL))

const FirebaseAppLayer =
  FirebaseAppLive
  ['<<<'](FirebaseConfigLive({
    apiKey: process.env.NX_API_KEY,
    authDomain: process.env.NX_AUTH_DOMAIN,
    projectId: process.env.NX_PROJECT_ID,
    storageBucket: process.env.NX_STORAGE_BUCKET,
    messagingSenderId: process.env.NX_MESSAGING_SENDER_ID,
    appId: process.env.NX_APP_ID,
    measurementId: process.env.NX_MEASUREMENT_ID
  }))

const MiddlewareLayer =
  EpicMiddlewareLive
  ['<<<'](AuthLayer)
  ['<<<'](FirebaseAppLayer)
  ['<<<'](FetchClientLive(fetch))
  ['<<<'](HTTPHeadersLive({
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }))
  ['<<<'](HTTPMiddlewareStackLive([]))
  ['<<<'](AppConfigLive(process.env.NX_FUNCTIONS_URL))
  ['<<<'](BrowserWindowLive(window))
  ['<<<'](ConsoleLoggerLive)

export const AppLayer =
  ReduxStoreLive({
    reducer: rootReducer,
    devTools: true,
  })
  ['<+<'](MiddlewareLayer)
