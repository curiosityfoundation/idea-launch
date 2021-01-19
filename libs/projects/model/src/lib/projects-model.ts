import * as M from '@effect-ts/morphic'

const Project_ = M.make((F) => 
  F.interface({
    id: F.uuid(),
    title: F.string(),
    description: F.string(),
    link: F.string(),
    owner: F.uuid(),
    created: F.date(),
    modified: F.optional(F.date()),
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
    owner: F.uuid(),
  }, { name: 'CreateProject' })
)

export interface CreateProject extends M.AType<typeof CreateProject_> { }
export interface CreateProjectRaw extends M.EType<typeof CreateProject_> { }
export const CreateProject = M.opaque<CreateProjectRaw, CreateProject>()(CreateProject_)

const DeleteProject_ = M.make((F) => 
  F.interface({
    id: F.uuid(),
    owner: F.uuid(),
  }, { name: 'DeleteProject' })
)

export interface DeleteProject extends M.AType<typeof DeleteProject_> { }
export interface DeleteProjectRaw extends M.EType<typeof DeleteProject_> { }
export const DeleteProject = M.opaque<DeleteProjectRaw, DeleteProject>()(DeleteProject_)

const Comment_ = M.make((F) => 
  F.interface({
    id: F.uuid(),
    projectId: F.uuid(),
    owner: F.uuid(),
    content: F.string(),
    created: F.date(),
    approved: F.boolean(),
  }, { name: 'Comment' })
)

export interface Comment extends M.AType<typeof Comment_> { }
export interface CommentRaw extends M.EType<typeof Comment_> { }
export const Comment = M.opaque<CommentRaw, Comment>()(Comment_)

const CreateComment_ = M.make((F) => 
  F.interface({
    owner: F.uuid(),
    content: F.string(),
  }, { name: 'CreateComment' })
)

export interface CreateComment extends M.AType<typeof CreateComment_> { }
export interface CreateCommentRaw extends M.EType<typeof CreateComment_> { }
export const CreateComment = M.opaque<CreateCommentRaw, CreateComment>()(CreateComment_)

const Reaction_ = M.make((F) => 
  F.interface({
    projectId: F.uuid(),
    owner: F.uuid(),
    created: F.date(),
  }, { name: 'Reaction' })
)

export interface Reaction extends M.AType<typeof Reaction_> { }
export interface ReactionRaw extends M.EType<typeof Reaction_> { }
export const Reaction = M.opaque<ReactionRaw, Reaction>()(Reaction_)

const CreateReaction_ = M.make((F) => 
  F.interface({
    projectId: F.uuid(),
    owner: F.uuid(),
  }, { name: 'CreateReaction' })
)

export interface CreateReaction extends M.AType<typeof CreateReaction_> { }
export interface CreateReactionRaw extends M.EType<typeof CreateReaction_> { }
export const CreateReaction = M.opaque<CreateReactionRaw, CreateReaction>()(CreateReaction_)

const DeleteReaction_ = M.make((F) => 
  F.interface({
    projectId: F.uuid(),
    owner: F.uuid(),
  }, { name: 'DeleteReaction' })
)

export interface DeleteReaction extends M.AType<typeof DeleteReaction_> { }
export interface DeleteReactionRaw extends M.EType<typeof DeleteReaction_> { }
export const DeleteReaction = M.opaque<DeleteReactionRaw, DeleteReaction>()(DeleteReaction_)