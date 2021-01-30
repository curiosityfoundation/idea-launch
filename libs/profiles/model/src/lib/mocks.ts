import { pipe } from '@effect-ts/core/Function'
import * as A from '@effect-ts/core/Array'
import * as R from '@effect-ts/core/Record'

import { Profile } from './profiles-model'

export const mockProfiles = [
  Profile.build({
    id: '0',
    name: {
      first: 'Kassim',
      last: 'D.',
    },
    owner: '0',
    avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
    classCode: '123456' ,
    created: new Date(),
    modified: null
  }),
  Profile.build({
    id: '1',
    name: {
      first: 'Joseph',
      last: 'A.',
    },
    owner: '1',
    avatar: 'https://www.gravatar.com/avatar/205e460b47112e5b48aec07710c08d50?s=200',
    classCode: '123456',
    created: new Date(),
    modified: null
  }),
]

export const mockProfileTable = pipe(
  mockProfiles,
  A.map((p) => [p.id, p] as const),
  R.fromArray,
)
