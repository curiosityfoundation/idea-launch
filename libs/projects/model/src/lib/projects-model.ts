import * as M from '@effect-ts/morphic'

const Project_ = M.make((F) => 
  F.interface({
    id: F.string(),
    title: F.string(),
    description: F.string(),
    link: F.string(),
    owner: F.string(),
    created: F.date(),
    modified: F.option(F.date()),
  }, { name: 'Project' })
)

export interface Project extends M.AType<typeof Project_> { }
export interface ProjectRaw extends M.EType<typeof Project_> { }
export const Project = M.opaque<ProjectRaw, Project>()(Project_)

const CreateProject_ = M.make((F) => 
  F.interface({
    title: F.string(),
    description: F.string(),
    link: F.string(),
  }, { name: 'CreateProject' })
)

export interface CreateProject extends M.AType<typeof CreateProject_> { }
export interface CreateProjectRaw extends M.EType<typeof CreateProject_> { }
export const CreateProject = M.opaque<CreateProjectRaw, CreateProject>()(CreateProject_)

const DeleteProject_ = M.make((F) => 
  F.interface({
    id: F.uuid(),
  }, { name: 'DeleteProject' })
)

export interface DeleteProject extends M.AType<typeof DeleteProject_> { }
export interface DeleteProjectRaw extends M.EType<typeof DeleteProject_> { }
export const DeleteProject = M.opaque<DeleteProjectRaw, DeleteProject>()(DeleteProject_)

const Comment_ = M.make((F) => 
  F.interface({
    id: F.string(),
    projectId: F.string(),
    owner: F.string(),
    content: F.string(),
    created: F.date(),
    approved: F.boolean(),
  })
)

export interface Comment extends M.AType<typeof Comment_> { }
export interface CommentRaw extends M.EType<typeof Comment_> { }
export const Comment = M.opaque<CommentRaw, Comment>()(Comment_)

const CreateComment_ = M.make((F) => 
  F.interface({
    projectId: F.string(),
    content: F.string(),
  })
)

export interface CreateComment extends M.AType<typeof CreateComment_> { }
export interface CreateCommentRaw extends M.EType<typeof CreateComment_> { }
export const CreateComment = M.opaque<CreateCommentRaw, CreateComment>()(CreateComment_)
