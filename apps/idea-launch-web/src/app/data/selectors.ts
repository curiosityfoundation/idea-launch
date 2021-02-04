import * as R from '@effect-ts/core/Record'

import { DataState } from './constants';

export const selectUpload = (state: DataState) => (id: string) =>
  R.lookup(id)(state.uploads.entries)
