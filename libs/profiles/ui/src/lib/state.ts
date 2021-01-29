import { makeADT, ofType } from '@effect-ts/morphic/Adt'

import { Profile } from '@idea-launch/profiles/model'

interface Init {
  state: 'Init'
}

interface Pending {
  state: 'Pending'
}

interface Failure {
  state: 'Failure'
  err: string
  refreshing: boolean
}

interface Success<A> {
  state: 'Success'
  data: Profile
  refreshing: boolean
}

interface NotFound<E, A> {
  state: 'Both'
  err: E
  data: A
  refreshing: boolean
}

// interface Init {
//   state: 'Init'
// }

// interface Pending {
//   state: 'Pending'
// }

// interface Failure<E> {
//   state: 'Failure'
//   err: E
//   refreshing: boolean
// }

// interface Success<A> {
//   state: 'Success'
//   data: A
//   refreshing: boolean
// }

// interface Both<E, A> {
//   state: 'Both'
//   err: E
//   data: A
//   refreshing: boolean
// }

// export function makeRefreshableDataState<E, A>() {
//   return makeADT('state')({
//     Init: ofType<Init>(),
//     Pending: ofType<Pending>(),
//     Failure: ofType<Failure<E>>(),
//     Success: ofType<Success<A>>(),
//     Both: ofType<Both<E, A>>(),
//   })
// }

// const OwnedProfileState = makeRefreshableDataState<string>