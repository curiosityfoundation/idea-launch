import React from 'react';
import * as Yup from 'yup';
import { FormikProps, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button';

import './post-project-form.module.css';

export interface PostProjectValues {
  title: string
  description: string
  link: string
}

export interface PostProjectFormProps {
  form: FormikProps<PostProjectValues>
}

export const validationSchema = Yup.object({
  title: Yup.string().min(6).max(120).required(),
  description: Yup.string().min(60).max(360).required(),
  link: Yup.string().min(4).max(360).required(),
})

export function PostProjectForm(props: PostProjectFormProps) {
  return (
    <Form>
      <Field
        component={TextField}
        name='title'
        type='text'
        label='Title'
        placeholder='Whats your project called?'
        fullWidth
        variant='outlined'
        error={!!props.form.errors.title && props.form.touched.title}
        helperText={props.form.errors.title || ''}
      />
      <br />
      <br />
      <Field
        component={TextField}
        name='description'
        type='text'
        label='Description'
        placeholder='Describe it! Let us know if you want help or feedback on something specific.'
        fullWidth
        multiline
        rows={4}
        variant='outlined'
        error={!!props.form.errors.description && props.form.touched.description}
        helperText={props.form.errors.description || ''}
      />
      <br />
      <br />
      <Field
        component={TextField}
        name='link'
        type='text'
        label='Link to your project'
        fullWidth
        placeholder='Paste the link to your project here!'
        variant='outlined'
        error={!!props.form.errors.link && props.form.touched.link}
        helperText={props.form.errors.link || ''}
      />
      <br />
      <br />
      <Button
        color='primary'
        variant='contained'
        disabled={props.form.isSubmitting || !props.form.dirty}
        onClick={props.form.submitForm}
        size='large'
        fullWidth
      >
        Next
      </Button>
    </Form>
  );
}

export default PostProjectForm;
