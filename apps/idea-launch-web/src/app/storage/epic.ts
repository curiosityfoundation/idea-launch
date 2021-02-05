import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'

import { reduxEpic } from '@idea-launch/redux-effect'

import { StorageAction } from './constants'
import { uploadFile } from './upload-file'

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
