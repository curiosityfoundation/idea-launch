import querystring from 'query-string'

import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as O from '@effect-ts/core/Option'

import * as H from './http-client';

function getContentType(requestType: H.RequestType): string {
  return H.foldRequestType(
    requestType,
    () => 'application/json',
    () => 'application/x-www-form-urlencoded',
    () => 'multipart/form-data',
    () => 'application/octet-stream'
  )
}

function getBody(
  body: unknown,
  requestType: H.RequestType
): string | ArrayBuffer | SharedArrayBuffer | FormData {
  return H.foldRequestType(
    requestType,
    () => JSON.stringify(body),
    () => querystring.stringify(body as any),
    () => (body as any) as FormData,
    () => body as Buffer
  )
}

export const FetchClientLive = (fetchApi: typeof fetch) =>
  L.pure(H.HTTP)({
    ops: {
      request(
        method: H.Method,
        url: string,
        requestType: H.RequestType,
        responseType: H.ResponseType,
        headers: Record<string, string>,
        body: unknown
      ): T.IO<H.HTTPError<string>, H.Response<any>> {

        const input: RequestInit = {
          headers: {
            'Content-Type': getContentType(requestType),
            ...headers
          },
          body: body ? getBody(body, requestType) : undefined,
          method: H.getMethodAsString(method)
        }

        return T.effectAsync((cb) => {
          fetchApi(url, input).then((resp) => {
            const h: Record<string, string> = {}

            resp.headers.forEach((val, key) => {
              h[key] = val
            })

            if (resp.status >= 200 && resp.status < 300) {
              H.foldResponseType(
                responseType,
                () => {
                  resp.json().then((json: unknown) => {
                    cb(
                      T.succeed({
                        headers: h,
                        status: resp.status,
                        body: O.fromNullable(json)
                      })
                    )
                  })
                },
                () =>
                  resp.text().then((text) => {
                    cb(
                      T.succeed({
                        headers: h,
                        status: resp.status,
                        body: O.fromNullable(text)
                      })
                    )
                  }),
                () => {
                  if (resp['arrayBuffer']) {
                    resp.arrayBuffer().then((arrayBuffer) => {
                      cb(
                        T.succeed({
                          headers: h,
                          status: resp.status,
                          body: O.fromNullable(Buffer.from(arrayBuffer))
                        })
                      )
                    })
                  } else {
                    ; (resp as any).buffer().then((buffer: Buffer) => {
                      cb(
                        T.succeed({
                          headers: h,
                          status: resp.status,
                          body: O.fromNullable(Buffer.from(buffer))
                        })
                      )
                    })
                  }
                }
              )
            } else {
              resp.text().then((text) => {
                cb(
                  T.fail({
                    _tag: H.HTTPErrorReason.Response,
                    response: {
                      headers: h,
                      status: resp.status,
                      body: O.fromNullable(text)
                    }
                  })
                )
              })
            }
          }).catch((err) => {
            cb(
              T.fail({
                _tag: H.HTTPErrorReason.Request,
                error: err
              })
            )
          })

        })
      }
    }
  })
  