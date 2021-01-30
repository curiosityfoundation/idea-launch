import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { Request, Response } from 'firebase-functions'

export interface FunctionsRequestContext {
  request: Request
  response: Response
}

export const FunctionsRequestContext = tag<FunctionsRequestContext>()

export const accessFunctionsRequestContext = T.accessService(FunctionsRequestContext)
export const accessFunctionsRequestContextM = T.accessServiceM(FunctionsRequestContext)

export const provideFunctionsRequestContextLive = (
  request: Request,
  response: Response,
) => T.provideService(FunctionsRequestContext)({
  request,
  response,
})
