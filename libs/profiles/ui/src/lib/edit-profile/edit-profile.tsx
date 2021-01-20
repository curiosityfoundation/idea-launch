import React from 'react';

import './edit-profile.module.css';

export interface EditProfileProps { 
  first: string
  last: string
  avatar: string
}

export interface EditProfileProps { 
  form: FormikProps<PostProjectValues>
}

export function EditProfile(props: EditProfileProps) {
  return (
    <div>
      <h1>Welcome to edit-profile!</h1>
    </div>
  );
}

export default EditProfile;
