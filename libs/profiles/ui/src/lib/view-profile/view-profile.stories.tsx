import React from 'react';
import { ViewProfile, ViewProfileProps } from './view-profile';

export default {
  component: ViewProfile,
  title: 'ViewProfile',
};

export const nonEditable = () => {
  /* eslint-disable-next-line */
  const props: ViewProfileProps = {
    username: 'Kassim D.',
    avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
    editable: false
  };

  return <ViewProfile {...props} />;
};

export const editable = () => {
  /* eslint-disable-next-line */
  const props: ViewProfileProps = {
    username: 'Kassim D.',
    avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
    editable: true,
    onEditClick: console.log
  };

  return <ViewProfile {...props} />;
};
