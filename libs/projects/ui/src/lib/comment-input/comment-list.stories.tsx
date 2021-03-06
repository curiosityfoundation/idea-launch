import React from 'react';
import { CommentInput, validationSchema } from './comment-input';
import { Formik } from 'formik'

export default {
  component: CommentInput,
  title: 'CommentInput',
};

export const primary = () => {
  return <Formik
    onSubmit={console.log}
    validationSchema={validationSchema}
    initialValues={{
      content: '',
    }}
  >
    {(form) => <CommentInput form={form} />}
  </Formik>
};
