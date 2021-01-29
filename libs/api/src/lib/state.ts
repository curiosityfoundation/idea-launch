import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'

import { Result } from './find-profile'

interface Init {
  state: 'Init'
}

interface Pending {
  state: 'Pending'
}

interface Failure {
  state: 'Failure'
  reason: string
  refreshing: boolean
}

interface Success {
  state: 'Success'
  result: Result
  refreshing: boolean
}

interface Both {
  state: 'Both'
  result: Result
  reason: string
  refreshing: boolean
}

export const FindProfileState = makeADT('state')({
  Init: ofType<Init>(),
  Pending: ofType<Pending>(),
  Failure: ofType<Failure>(),
  Success: ofType<Success>(),
  Both: ofType<Both>(),
})

export type FindProfileState = ADTType<typeof FindProfileState>

export const initFindProfileState = FindProfileState.of.Init({})

interface ProfileRequested {
  type: 'ProfileRequested'
}

interface ProfileRequestFailed {
  type: 'ProfileRequestFailed'
  payload: string
}

interface ProfileRequestSucceeded {
  type: 'ProfileRequestSucceeded'
  payload: Result
}

export const FindProfileAction = makeADT('type')({
  ProfileRequested: ofType<ProfileRequested>(),
  ProfileRequestFailed: ofType<ProfileRequestFailed>(),
  ProfileRequestSucceeded: ofType<ProfileRequestSucceeded>(),
})

export type FindProfileAction = ADTType<typeof FindProfileAction>

export const findProfileReducer =
  FindProfileAction.createReducer(initFindProfileState)({
    ProfileRequested: () =>
      FindProfileState.transform({
        Init: () =>
          FindProfileState.of.Pending({}),
        Failure: (s) =>
          FindProfileState.of.Failure({
            ...s,
            refreshing: true
          }),
        Success: (s) =>
          FindProfileState.of.Success({
            ...s,
            refreshing: true
          }),
        Both: (s) =>
          FindProfileState.of.Both({
            ...s,
            refreshing: true
          }),
      }),
    ProfileRequestFailed: (a) =>
      FindProfileState.transform({
        Pending: () =>
          FindProfileState.of.Failure({
            reason: a.payload,
            refreshing: false
          }),
        Failure: (s) => s.refreshing
          ? FindProfileState.of.Failure({
            reason: a.payload,
            refreshing: false
          })
          : s,
        Success: (s) => s.refreshing
          ? FindProfileState.of.Both({
            ...s,
            reason: a.payload,
            refreshing: false
          })
          : s,
        Both: (s) => s.refreshing
          ? FindProfileState.of.Both({
            ...s,
            reason: a.payload,
            refreshing: false
          })
          : s,
      }),
    ProfileRequestSucceeded: (a) =>
      FindProfileState.transform({
        Pending: () =>
          FindProfileState.of.Success({
            result: a.payload,
            refreshing: false
          }),
        Failure: (s) => s.refreshing
          ? FindProfileState.of.Success({
            result: a.payload,
            refreshing: false
          })
          : s,
        Success: (s) => s.refreshing
          ? FindProfileState.of.Success({
            result: a.payload,
            refreshing: false
          })
          : s,
        Both: (s) => s.refreshing
          ? FindProfileState.of.Success({
            ...s,
            result: a.payload,
            refreshing: false
          })
          : s,
      }),
  })