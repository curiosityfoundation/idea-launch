import React from 'react';
import { Formik } from 'formik'
import { CreateProfileForm, CreateProfileFormProps } from './create-profile-form';

export default {
  component: CreateProfileForm,
  title: 'CreateProfileForm',
};

export const primary = () => {
  return <Formik
    onSubmit={console.log}
    initialValues={{
      first: '',
      last: '',
      classcode: '',
      avatar: '',
    }}
  >
    {(form) => <CreateProfileForm form={form} />}
  </Formik>
};
