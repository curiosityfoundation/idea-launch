import React from 'react';
import { ProjectsUi, ProjectsUiProps } from './projects-ui';

export default {
  component: ProjectsUi,
  title: 'ProjectsUi',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: ProjectsUiProps = {};

  return <ProjectsUi />;
};
