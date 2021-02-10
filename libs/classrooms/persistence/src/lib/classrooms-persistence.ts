import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'

import { Classroom } from '@idea-launch/classrooms/model'

export class ClassroomsPersistenceError {
  readonly tag: 'ClassroomsPersistenceError'
  constructor(readonly reason: string) { }
}

export interface ClassroomsPersistence {
  findClassroom: (classCode: string) => T.IO<ClassroomsPersistenceError, O.Option<Classroom>>
}

export const ClassroomsPersistence = tag<ClassroomsPersistence>()

export const {
  findClassroom
} = T.deriveLifted(ClassroomsPersistence)(
  ['findClassroom'],
  [] as never[],
  [] as never[],
)
