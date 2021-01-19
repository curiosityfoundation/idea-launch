import { Avatar, Typography, Badge } from '@material-ui/core';
import React from 'react';

import './view-profile.module.css';

/* eslint-disable-next-line */
export type ViewProfileProps = {
  editable: false
  avatar: string
  username: string
} | {
  editable: true
  avatar: string
  username: string
  onEditClick: () => void
}

export function ViewProfile(props: ViewProfileProps) {
  return (
    <div className='view-profile'>
      <Avatar
        alt={props.username}
        src={props.avatar}
      />
      {props.editable && <Badge
        onClick={props.onEditClick}
      />}
      <Typography>
        {props.username}
      </Typography>
    </div>
  );
}

export default ViewProfile;
