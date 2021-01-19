import React from 'react';
import { ProjectCard, ProjectCardProps } from './project-card';

export default {
  component: ProjectCard,
  title: 'ProjectCard',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: ProjectCardProps = {
    favoriteCount: 176,
    title: 'Lemonada Sales Stuff',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    url: 'https://www.figma.com/',
    username: 'Kassim D.',
    avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
  };

  return <ProjectCard {...props} />;
};
