import React from 'react';
import { UploadAvatar, UploadAvatarProps } from './upload-avatar';

export default {
  component: UploadAvatar,
  title: 'UploadAvatar',
};

export const init = () => {

  const props: UploadAvatarProps = {
    state: 'init',
    username: 'Joseph A.',
    onUploadClick: console.log,
  };

  return <UploadAvatar {...props} />;
}

export const uploading = () => {

  const props: UploadAvatarProps = {
    state: 'uploading',
    username: 'Joseph A.',
  };

  return <UploadAvatar {...props} />;
}

export const uploaded = () => {

  const props: UploadAvatarProps = {
    state: 'uploaded',
    avatar: 'https://www.gravatar.com/avatar/20511111479e2e5b48aec07710c08d50?s=200',
    onBackClick: console.log,
    onNextClick: console.log,
  };

  return <UploadAvatar {...props} />;
}

export const confirmed = () => {

  const props: UploadAvatarProps = {
    state: 'confirmed',
    avatar: 'https://www.gravatar.com/avatar/20511111479e2e5b48aec07710c08d50?s=200',
    onNextClick: console.log,
  };

  return <UploadAvatar {...props} />;
}


