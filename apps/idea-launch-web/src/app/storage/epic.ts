import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'

import { FirebaseStorage } from '@idea-launch/firebase-web'
import { reduxEpic } from '@idea-launch/redux-effect'
import { UUIDGen } from '@idea-launch/uuid-gen'

import { StorageAction } from './constants'

const percentage = (a: number, b: number) => (a / b) * 100

const uploadFile = (id: string, file: File) =>
  T.accessServicesM({
    uuid: UUIDGen,
    storage: FirebaseStorage,
  })(({ uuid, storage }) =>
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
  )

export const StorageEpic = reduxEpic<StorageAction, {}>()(
  (actions) =>
    pipe(
      actions,
      S.filter(StorageAction.is.UploadRequested),
      S.mapM((a) =>
        uploadFile(
          a.payload.id,
          a.payload.file,
        ),
      ),
      S.flatten,
    )
)
