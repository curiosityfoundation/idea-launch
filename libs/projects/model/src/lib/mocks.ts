import { pipe } from '@effect-ts/core/Function'
import * as A from '@effect-ts/core/Array'
import * as R from '@effect-ts/core/Record'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'

import { Project, Comment } from './projects-model'

export const mockProjects = [
  Project.build({
    id: '0' as UUID,
    title: 'Lemonada Sales Wireframes',
    description: 'I’m thinking about making an app to take lemonade orders for delivery. I’ll use my bike to deliver the lemonade to the homes every Saturday and Sunday. Let me know what you guys think!',
    created: new Date(),
    link: 'https://www.figma.com/',
    owner: '0' as UUID,
    modified: null,
  }),
  Project.build({
    id: '1' as UUID,
    title: 'Pet Pros Business Model',
    description: 'Helps you keep track of what youve done for your pet and what else needs to be done',
    created: new Date(),
    link: 'https://petpros.net/',
    owner: '1' as UUID,
    modified: null,
  }),
]

export const mockProjectTable = pipe(
  mockProjects,
  A.map((p) => [p.id, p] as const),
  R.fromArray,
)

export const mockComments = [
  Comment.build({
    id: '0' as UUID,
    projectId: '0' as UUID,
    content: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
    created: new Date(),
    owner: '0' as UUID,
    approved: true,
  }),
  Comment.build({
    id: '1' as UUID,
    projectId: '0' as UUID,
    content: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
    created: new Date(),
    owner: '1' as UUID,
    approved: true,
  })
]

export const mockCommentTable = pipe(
  mockComments,
  A.map((c) => [c.id, c] as const),
  R.fromArray,
)
