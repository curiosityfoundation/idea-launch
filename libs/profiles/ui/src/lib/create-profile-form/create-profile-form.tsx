import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { FormikProps, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button';

import './create-profile-form.module.css';

const useStyles = makeStyles({
  root: {
    minWidth: 375,
    width: '100%',
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

export function CreateProfileForm(props: CreateProfileFormProps) {
  
  const classes = useStyles()
  
  return (
    <Form className={classes.root}>
      <Field
        component={TextField}
        multiline
        rowsMax={4}
        name='first'
        type='text'
        label='First Name'
        fullWidth
      />
      <br />
      <br />
      <Field
        component={TextField}
        multiline
        rowsMax={4}
        name='last'
        type='text'
        label='Last Name'
        fullWidth
      />
      <br />
      <br />
      <Field
        component={TextField}
        multiline
        rowsMax={4}
        name='classcode'
        type='text'
        label='Class Code'
        fullWidth
      />
      <br />
      <br />
      <Button
        color='primary'
        variant='contained'
        disabled={props.form.isSubmitting || !props.form.dirty}
        onClick={props.form.submitForm}
        size='medium'
        fullWidth
      >
        Next
      </Button>
    </Form>
  );
}

export default CreateProfileForm;
