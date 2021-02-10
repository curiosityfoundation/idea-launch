import * as M from '@effect-ts/morphic'

const Classroom_ = M.make((F) =>
  F.interface({
    id: F.string(),
    classCode: F.string(),
    name: F.string(),
    owner: F.string()
  })
)

export interface Classroom extends M.AType<typeof Classroom_> { }
export interface ClassroomRaw extends M.EType<typeof Classroom_> { }
export const Classroom = M.opaque<ClassroomRaw, Classroom>()(Classroom_)
