import { UUID } from '@effect-ts/morphic/Algebra/Primitives'

import { Project, Comment } from './projects-model'

export const mockProjects = [
  Project.build({
    id: '0' as UUID,
    title: 'Lemonada Sales Wireframes',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
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
    link: 'https://www.figma.com/',
    owner: '1' as UUID,
    modified: null,
  }),
]

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