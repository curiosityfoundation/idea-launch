import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { reduxEpic } from '@idea-launch/redux-effect'
import { CreateProfile, FindProfile, ListResources } from '@idea-launch/api'

import { AppAction } from '../constants'

export const AddEntriesEpic = reduxEpic<AppAction, {}>()(
  (actions) =>
    pipe(
      actions,
      S.filter(AppAction.is.APIRequestSucceeded),
      S.mapConcat((a) => {
        switch (a.payload.endpoint) {
          case 'CreateProfile':
            return CreateProfile.Response.matchStrict({
              Failure: () => [],
              Success: (response) => [
                AppAction.of.AddEntries({
                  payload: {
                    table: 'profiles',
                    entries: [response.profile]
                  }
                })
              ],
            })(a.payload.response)
          case 'FindProfile':
            return FindProfile.Response.matchStrict({
              Failure: () => [],
              NotFound: () => [],
              Success: (response) => [
                AppAction.of.AddEntries({
                  payload: {
                    table: 'profiles',
                    entries: [response.profile]
                  }
                })
              ],
            })(a.payload.response)
          case 'ListResources':
            return ListResources.Response.matchStrict({
              Failure: () => [],
              Success: (response) => [
                AppAction.of.AddEntries({
                  payload: {
                    table: 'resources',
                    entries: response.resources
                  }
                })
              ],
            })(a.payload.response)
          case 'ListProjects':
            return []
        }
      })
    )
)
