import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'
import { accessFirebaseStorageM } from '@idea-launch/firebase-web'

import { reduxEffect } from '@idea-launch/redux-effect'
import { generateLen } from '@idea-launch/uuid-gen'

import { StorageAction } from './constants'

export const RouterEffects = reduxEffect<StorageAction, {}>()(
  (action) => pipe(
    action,
    O.fromPredicate(StorageAction.verified),
    O.fold(
      () => T.succeed([]),
      StorageAction.matchStrict({
        UploadSucceeded: (a) => T.succeed([]),
        UploadProgressChanged: (a) => T.succeed([]),
        UploadFailed: (a) => T.succeed([]),
        UploadRequested: (a) =>
          pipe(
            generateLen(3),
            T.map((id) => [
              StorageAction.of.UploadStarted({
                payload: {
                  id,
                  file: a.payload.file
                }
              })
            ])
          ),
        UploadStarted: (a) =>
          accessFirebaseStorageM(
            ({ storage }) =>
              T.effectTotal(() => {
                // const storageRef = storage().ref();

                // // [START storage_monitor_upload]
                // var uploadTask = storageRef.child('images/rivers.jpg').put(file);

                // // Register three observers:
                // // 1. 'state_changed' observer, called any time the state changes
                // // 2. Error observer, called on failure
                // // // 3. Completion observer, called on successful completion
                // uploadTask.on('state_changed',
                //   (snapshot) => {
                //     // Observe state change events such as progress, pause, and resume
                //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                //     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //     console.log('Upload is ' + progress + '% done');
                //     switch (snapshot.state) {
                //       case firebase.storage.TaskState.PAUSED: // or 'paused'
                //         console.log('Upload is paused');
                //         break;
                //       case firebase.storage.TaskState.RUNNING: // or 'running'
                //         console.log('Upload is running');
                //         break;
                //     }
                //   },
                //   (error) => {
                //     // Handle unsuccessful uploads
                //   },
                //   () => {
                //     // Handle successful uploads on complete
                //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                //     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                //       console.log('File available at', downloadURL);
                //     });
                //   }
                // );
                return []
              })
          )
      }),
    ),
  )
)
