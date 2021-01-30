import * as M from '@effect-ts/morphic'
import * as T from '@effect-ts/core/Effect'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'
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
  A extends M.M<any, any, any>,
  Result extends AnyADTTypes,
  ResultRaw,
  O extends MorphADT<Result, any, any, any, any>,
  > {
  _T: T
  _A: M.AType<A>
  _O: AOfMorhpADT<O>
  _OR: EOfMorhpADT<O>
  name: T
  method: M
  Body: A
  Response: O
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
  A extends M.M<any, any, any>,
  Result extends AnyADTTypes,
  ResultRaw,
  O extends MorphADT<Result, any, any, any, ResultRaw>,
  >(
    opt: {
      name: T
      method: M
      Body: A
      Response: O
    }
  ) {
  return opt as Endpoint<T, M, A, Result, ResultRaw, O>
}

export function handler<E extends Endpoint<any, any, any, any, any, any>>(
  endpoint: E
): <R>(fn: (e: E) => T.RIO<R, E['_OR']>) => Handler<R, E> {
  return <R>(fn: (e: E) => T.RIO<R, E['_OR']>) => fn(endpoint)
}

export interface Handler<R, E extends Endpoint<any, any, any, any, any, any>> extends T.RIO<R, E['_OR']> { }
