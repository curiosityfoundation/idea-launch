import { pipe } from '@effect-ts/core/Function'
import * as A from '@effect-ts/core/Array'
import * as R from '@effect-ts/core/Record'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'

import { Profile } from './profiles-model'

export const mockProfiles = [
  Profile.build({
    id: '0' as UUID,
    name: {
      first: 'Kassim',
      last: 'D.',
    },
    owner: '0' as UUID,
    avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
    classCode: '123456' as UUID,
    created: new Date(),
    modified: null
  }),
  Profile.build({
    id: '1' as UUID,
    name: {
      first: 'Joseph',
      last: 'A.',
    },
    owner: '1' as UUID,
    avatar: 'https://www.gravatar.com/avatar/205e460b47112e5b48aec07710c08d50?s=200',
    classCode: '123456' as UUID,
    created: new Date(),
    modified: null
  }),
]

export const mockProfileTable = pipe(
  mockProfiles,
  A.map((p) => [p.id, p] as const),
  R.fromArray,
)
