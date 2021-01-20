import React from 'react';
import { PostProjectForm, validationSchema } from './post-project-form';
import { Formik } from 'formik'

export default {
  component: PostProjectForm,
  title: 'PostProjectForm',
};

export const primary = () => {
  return <Formik
    onSubmit={console.log}
    validationSchema={validationSchema}
    initialValues={{
      title: '',
      description: '',
      link: '',
    }}
  >
    {(form) => <PostProjectForm form={form} />}
  </Formik>
};
