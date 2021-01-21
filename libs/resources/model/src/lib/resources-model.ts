import * as M from '@effect-ts/morphic'

export const ResourceCategories = [
  'web-design',
  'ideation',
  'graphic-design',
  'mobile-design',
  'marketing',
  'coding',
] as const

const Resource_ = M.make((F) =>
  F.interface({
    id: F.uuid(),
    title: F.string(),
    description: F.string(),
    link: F.string(),
    image: F.string(),
    category: F.oneOfLiterals(ResourceCategories),
  }, { name: 'Resource' })
)

export interface Resource extends M.AType<typeof Resource_> { }
export interface ResourceRaw extends M.EType<typeof Resource_> { }
export const Resource = M.opaque<ResourceRaw, Resource>()(Resource_)
