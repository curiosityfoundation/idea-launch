import React from 'react'
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { FormikProps, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button';

import './comment-input.module.css';

const useStyles = makeStyles({
  root: {
    minWidth: 375,
    width: '100%',
  },
});

export interface CommentValues {
  content: string
}

export interface CommentInputProps {
  form: FormikProps<CommentValues>
}

export const validationSchema = Yup.object({
  content: Yup.string().min(6).max(240).required(),
})

export function CommentInput(props: CommentInputProps) {

  const classes = useStyles();

  return (
    <Form className={classes.root}>
      <Field
        component={TextField}
        multiline
        rows={2}
        rowsMax={4}
        name='content'
        type='text'
        fullWidth
        placeholder='write your comment, feedback or praise here'
        variant='outlined'
        error={!!props.form.errors.content && props.form.touched.content}
        helperText={props.form.errors.content || ''}
      />
      <br />
      <br />
      <Button
        color='primary'
        disabled={props.form.isSubmitting || !props.form.dirty}
        onClick={props.form.submitForm}
        size='small'
      >
        Submit
      </Button>
    </Form>
  );
}

export default CommentInput;
