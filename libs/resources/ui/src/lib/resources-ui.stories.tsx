import React from 'react';
import { ResourcesUi, ResourcesUiProps } from './resources-ui';

export default {
  component: ResourcesUi,
  title: 'ResourcesUi',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: ResourcesUiProps = {};

  return <ResourcesUi />;
};
