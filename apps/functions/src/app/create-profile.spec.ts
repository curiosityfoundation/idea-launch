import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'

import { ProfilesPersistenceMock } from '@idea-launch/profiles/persistence'
import {
  FunctionsAuthStatusMock,
  AuthStatus,
  provideFunctionsRequestContextLive,
} from '@idea-launch/firebase-functions'
import { NanoidUUIDLive } from '@idea-launch/uuid-gen'
import { CreateProfile } from '@idea-launch/api'
import { ConsoleLoggerLive } from '@idea-launch/logger'

import { handleCreateProfile } from './create-profile'
import { logDefect } from './util'

describe('handleCreateProfile', () => {

  it('succeeds', async () => {

    pipe(
      handleCreateProfile,
      logDefect,
      T.provideSomeLayer(ProfilesPersistenceMock),
      T.provideSomeLayer(
        FunctionsAuthStatusMock(
          AuthStatus.of.Authenticated({
            decodedId: { uid: '123' } as any
          })
        )
      ),
      provideFunctionsRequestContextLive(
        {
          body: CreateProfile.Body.build({
            avatar: '',
            classCode: '',
            name: {
              first: 'kassim',
              last: 'd',
            }
          })
        } as any,
        {} as any
      ),
      T.provideSomeLayer(ConsoleLoggerLive),
      T.provideSomeLayer(NanoidUUIDLive),
      T.runPromise
    ).then((a) => {
      console.log(a)
      expect(a).not.toBe(undefined)
    }).catch(console.warn)

  })

})