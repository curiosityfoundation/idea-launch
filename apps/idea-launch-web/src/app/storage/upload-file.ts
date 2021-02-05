import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { tag } from '@effect-ts/core/Has'
import * as O from '@effect-ts/core/Option'

import { FirebaseStorage } from '@idea-launch/firebase-web'
import { UUIDGen } from '@idea-launch/uuid-gen'

import { StorageAction } from './constants'

const percentage = (a: number, b: number) => (a / b) * 100

export interface UploadFile {
  uploadFile: (id: string, file: File) => T.UIO<S.UIO<StorageAction>>
}

export const UploadFile = tag<UploadFile>()

export const uploadFile = (id: string, file: File) =>
  T.accessServiceM(UploadFile)(({ uploadFile }) => uploadFile(id, file))

export const UploadFileMock = L.pure(UploadFile)({
  uploadFile: (id, file) => T.succeed(
    S.effectAsync((cb) => {
      cb(
        T.succeed([
          StorageAction.of.UploadProgressChanged({
            payload: {
              id,
              progress: 0,
            }
          })
        ])
      )
      const max = 6
      let i = 0
      const handle = setInterval(() => {
        cb(
          T.succeed([
            StorageAction.of.UploadProgressChanged({
              payload: {
                id,
                progress: 9 * (i++),
              }
            })
          ])
        )
        if (i === max) {
          clearInterval(handle)
          cb(
            T.succeed([
              StorageAction.of.UploadSucceeded({
                payload: {
                  id,
                  url: 'https://via.placeholder.com/150'
                }
              })
            ])
          )
          cb(
            T.fail(
              O.none
            )
          )
        }
      }, 3000 / max)
    })
  )
})

const makeUploadFile =
  T.accessServices({
    uuid: UUIDGen,
    storage: FirebaseStorage,
  })(({ uuid, storage }): UploadFile => ({
    uploadFile: (id: string, file: File) =>
      pipe(
        uuid.generate,
        T.map((generatedId) =>
          pipe(
            S.effectAsync<unknown, string, StorageAction>((cb) => {
              const childRef = storage.storage.ref().child(`${id}-${generatedId}`)
              childRef
                .put(file)
                .on(
                  'state_changed',
                  (snapshot) => cb(
                    T.succeed([
                      StorageAction.of.UploadProgressChanged({
                        payload: {
                          id,
                          progress: percentage(
                            snapshot.bytesTransferred,
                            snapshot.totalBytes
                          )
                        }
                      })
                    ])
                  ),
                  (error) => cb(
                    T.fail(
                      O.some(error.code)
                    )
                  ),
                  () => childRef.getDownloadURL()
                    .then(
                      (url: string) => {
                        cb(
                          T.succeed([
                            StorageAction.of.UploadSucceeded({
                              payload: {
                                id,
                                url,
                              }
                            })
                          ])
                        )
                        cb(
                          T.fail(O.none)
                        )
                      },
                      (err) => cb(
                        T.fail(
                          O.some(err)
                        )
                      ),
                    )
                )
            }),
            S.catchAll((reason) =>
              S.succeed(
                StorageAction.of.UploadFailed({
                  payload: {
                    id,
                    reason,
                  }
                })
              )
            )
          )
        )
      )
  }))

export const UploadFileLive = L.fromEffect(UploadFile)(makeUploadFile)