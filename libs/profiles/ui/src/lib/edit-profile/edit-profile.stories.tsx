import React from 'react';
import { EditProfile, EditProfileProps } from './edit-profile';

export default {
  component: EditProfile,
  title: 'EditProfile',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: EditProfileProps = {};

  return <EditProfile />;
};
