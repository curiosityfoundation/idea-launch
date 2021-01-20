import React from 'react';
import { Formik } from 'formik'
import { EditProfileForm, validationSchema } from './edit-profile-form';

export default {
  component: EditProfileForm,
  title: 'EditProfileForm',
};

export const primary = () => {
  return <Formik
    onSubmit={console.log}
    validationSchema={validationSchema}
    initialValues={{
      first: 'Kassim',
      last: 'Dadada',
    }}
  >
    {(form) =>
      <EditProfileForm
        form={form}
        avatar='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
      />
    }
  </Formik>
};
