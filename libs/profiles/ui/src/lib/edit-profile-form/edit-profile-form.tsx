import React from 'react'
import * as Yup from 'yup'
import { FormikProps, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Badge from '@material-ui/core/Badge'
import Edit from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'

import './edit-profile-form.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
    maxWidth: 600,
    display: 'flex'
  },
  left: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(24),
    height: theme.spacing(24),
    marginLeft: theme.spacing(2),
  },
  hidden: {
    display: 'none',
  },
}))

const StyledBadge = withStyles((theme) =>
  createStyles({
    badge: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
      width: theme.spacing(4),
      height: theme.spacing(4),
      borderRadius: '50%'
    },
  }),
)(Badge);

export interface EditProfileValues {
  first: string
  last: string
  avatar: string
}

export interface EditProfileFormProps {
  form: FormikProps<EditProfileValues>
  avatar: string
}

export const validationSchema = Yup.object({
  first: Yup.string().min(2).max(40).required(),
  last: Yup.string().min(2).max(40).required(),
})

export function EditProfileForm(props: EditProfileFormProps) {

  const classes = useStyles()

  return (
    <Form className={classes.root}>
      <div className={classes.left}>
        <Field
          component={TextField}
          name='first'
          type='text'
          label='First Name'
          variant='outlined'
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
          fullWidth
          error={!!props.form.errors.last && props.form.touched.last}
          helperText={props.form.errors.last || ''}
        />
        <br />
        <br />
        <Button
          color='primary'
          variant='contained'
          disabled={props.form.isSubmitting}
          onClick={props.form.submitForm}
          size='large'
          fullWidth
        >
          Save Changes
        </Button>
      </div>
      <StyledBadge
        overlap='circle'
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={
          <React.Fragment>
            <input
              accept='image/*'
              className={classes.hidden}
              id='icon-button-file'
              type='file'
              onChange={console.log}
            />
            <label htmlFor='icon-button-file'>
              <IconButton aria-label='upload picture' component='span'>
                <Edit />
              </IconButton>
            </label>
          </React.Fragment>
        }
      >
        <Avatar
          className={classes.avatar}
          src={props.avatar}
        />
      </StyledBadge>
    </Form>
  );

}

export default EditProfileForm;
