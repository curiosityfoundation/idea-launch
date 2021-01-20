import React from 'react'
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { FormikProps, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button';

import './create-profile-form.module.css';

const useStyles = makeStyles({
  root: {
  },
});

export interface ProfileFormValues {
  first: string
  last: string
  classCode: string
}

export interface CreateProfileFormProps {
  form: FormikProps<ProfileFormValues>
}

export const validationSchema = Yup.object({
  first: Yup.string().min(2).max(40).required(),
  last: Yup.string().min(2).max(40).required(),
  classCode: Yup.string().min(6).max(12).required(),
})

export function CreateProfileForm(props: CreateProfileFormProps) {
  
  const classes = useStyles()
  
  return (
    <Form className={classes.root}>
      <Field
        component={TextField}
        name='first'
        type='text'
        label='First Name'
        variant='outlined'
        placeholder='enter your first name'
        fullWidth
        error={!!props.form.errors.first && props.form.touched.first}
        helperText={props.form.errors.first || ''}
      />
      <br />
      <br />
      <Field
        component={TextField}
        name='last'
        type='text'
        label='Last Name'
        variant='outlined'
        placeholder='enter your last name'
        fullWidth
        error={!!props.form.errors.last && props.form.touched.last}
        helperText={props.form.errors.last || ''}
      />
      <br />
      <br />
      <Field
        component={TextField}
        name='classcode'
        type='text'
        label='Class Code'
        variant='outlined'
        placeholder='ask your teacher for this'
        fullWidth
        error={!!props.form.errors.classCode && props.form.touched.classCode}
        helperText={props.form.errors.classCode || ''}
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

export default CreateProfileForm;
