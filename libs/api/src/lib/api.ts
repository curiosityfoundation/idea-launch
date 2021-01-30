import * as M from '@effect-ts/morphic'
import * as T from '@effect-ts/core/Effect'
import {
  MorphADT,
  AOfMorhpADT,
  EOfMorhpADT,
  HasTypes,
  AnyADTTypes
} from '@effect-ts/morphic/Batteries/usage/tagged-union'

export const Method = {
  GET: null,
  POST: null,
  PUT: null,
  DELETE: null,
  PATCH: null
}

export type Method = keyof typeof Method

export interface Endpoint<
  T extends string,
  M extends Method,
  Body extends M.M<any, any, any>,
  Resp extends HasTypes<any>,
  > {
  _T: T
  _M: M
  _BodyA: M.AType<Body>
  _RespA: AOfMorhpADT<Resp>
  _RespE: EOfMorhpADT<Resp>
  name: T
  method: M
  Body: Body
  Response: Resp
}

const Empty_ = M.make((F) =>
  F.interface({})
)

export interface Empty extends M.AType<typeof Empty_> { }
export interface EmptyRaw extends M.EType<typeof Empty_> { }
export const Empty = M.opaque<EmptyRaw, Empty>()(Empty_)

export function endpoint<
  T extends string,
  M extends Method,
  Body extends M.M<any, any, any>,
  Resp extends HasTypes<any>,
  >(
    opt: {
      name: T
      method: M
      Body: Body
      Response: Resp
    }
  ) {
  return opt as Endpoint<T, M, Body, Resp>
}

export type AnyEndpoint = Endpoint<any, any, any, any>

export function handler<E extends AnyEndpoint>(
  endpoint: E
): <R>(fn: (e: E) => T.RIO<R, E['_RespE']>) => Handler<R, E> {
  return <R>(fn) => fn(endpoint)
}

export interface Handler<R, E extends AnyEndpoint> extends T.RIO<R, E['_RespE']> { }
