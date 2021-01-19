import React from 'react';
import { ViewProject, ViewProjectProps } from './view-project';

export default {
  component: ViewProject,
  title: 'ViewProject',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: ViewProjectProps = {};

  return <ViewProject />;
};
