import React from 'react';
import { Formik } from 'formik'
import { CreateProfileForm, validationSchema } from './create-profile-form';

export default {
  component: CreateProfileForm,
  title: 'CreateProfileForm',
};

export const primary = () => {
  return <Formik
    onSubmit={console.log}
    validationSchema={validationSchema}
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
