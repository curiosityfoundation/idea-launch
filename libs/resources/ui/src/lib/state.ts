import * as A from '@effect-ts/core/Array'
import * as R from '@effect-ts/core/Record'
import { pipe } from '@effect-ts/core/Function'
import * as M from '@effect-ts/morphic'

import { Resource } from '@idea-launch/resources/model'

const Init_ = M.make((F) =>
  F.interface({
    state: F.stringLiteral('Init')
  }, { name: 'Init' })
)

export interface Init extends M.AType<typeof Init_> { }
export interface InitRaw extends M.EType<typeof Init_> { }
export const Init = M.opaque<InitRaw, Init>()(Init_)

const Pending_ = M.make((F) =>
  F.interface({
    state: F.stringLiteral('Pending')
  }, { name: 'Pending' })
)

export interface Pending extends M.AType<typeof Pending_> { }
export interface PendingRaw extends M.EType<typeof Pending_> { }
export const Pending = M.opaque<PendingRaw, Pending>()(Pending_)

const Loaded_ = M.make((F) =>
  F.interface({
    state: F.stringLiteral('Loaded'),
    data: F.record(Resource(F))
  }, { name: 'Loaded' })
)

export interface Loaded extends M.AType<typeof Loaded_> { }
export interface LoadedRaw extends M.EType<typeof Loaded_> { }
export const Loaded = M.opaque<LoadedRaw, Loaded>()(Loaded_)

const Failure_ = M.make((F) => 
  F.interface({
    state: F.stringLiteral('Failure'),
  }, { name: 'Failure' })
)

export interface Failure extends M.AType<typeof Failure_> { }
export interface FailureRaw extends M.EType<typeof Failure_> { }
export const Failure = M.opaque<FailureRaw, Failure>()(Failure_)

export const ResourcesState = M.makeADT('state')({
  Init,
  Pending,
  Failure,
  Loaded,
})

export type ResourcesState = M.AType<typeof ResourcesState>

const ResourcesRequested_ = M.make((F) => 
  F.interface({
    type: F.stringLiteral('ResourcesRequested'),
  }, { name: 'ResourcesRequested' })
)

export interface ResourcesRequested extends M.AType<typeof ResourcesRequested_> { }
export interface ResourcesRequestedRaw extends M.EType<typeof ResourcesRequested_> { }
export const ResourcesRequested = M.opaque<ResourcesRequestedRaw, ResourcesRequested>()(ResourcesRequested_)

const ResourcesRequestFailed_ = M.make((F) => 
  F.interface({
    type: F.stringLiteral('ResourcesRequestFailed'),
  }, { name: 'ResourcesRequestFailed' })
)

export interface ResourcesRequestFailed extends M.AType<typeof ResourcesRequestFailed_> { }
export interface ResourcesRequestFailedRaw extends M.EType<typeof ResourcesRequestFailed_> { }
export const ResourcesRequestFailed = M.opaque<ResourcesRequestFailedRaw, ResourcesRequestFailed>()(ResourcesRequestFailed_)

const ResourcesRequestSuccess_ = M.make((F) => 
  F.interface({
    type: F.stringLiteral('ResourcesRequestSuccess'),
    payload: F.array(Resource(F))
  }, { name: 'ResourcesRequestSuccess' })
)

export interface ResourcesRequestSuccess extends M.AType<typeof ResourcesRequestSuccess_> { }
export interface ResourcesRequestSuccessRaw extends M.EType<typeof ResourcesRequestSuccess_> { }
export const ResourcesRequestSuccess = M.opaque<ResourcesRequestSuccessRaw, ResourcesRequestSuccess>()(ResourcesRequestSuccess_)

export const ResourcesAction = M.makeADT('type')({
  ResourcesRequested,
  ResourcesRequestFailed,
  ResourcesRequestSuccess,
})

export type ResourcesAction = M.AType<typeof ResourcesAction>

export const initResourcesState = ResourcesState.of.Init({})

export const resourcesReducer = ResourcesAction.createReducer(initResourcesState)({
  ResourcesRequested: () => ResourcesState.transform({
    Init: () => ResourcesState.of.Pending({})
  }),
  ResourcesRequestFailed: () => ResourcesState.transform({
    Pending: () => ResourcesState.of.Failure({})
  }),
  ResourcesRequestSuccess: (a) => ResourcesState.transform({
    Pending: () => ResourcesState.of.Loaded({ 
      data:  pipe(
        a.payload,
        A.map((r) => [r.id, r] as const),
        R.fromArray,
      )
    })
  })
})
