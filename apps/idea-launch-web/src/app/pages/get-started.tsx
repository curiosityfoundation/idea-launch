import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Formik } from 'formik'

import {
  CreateProfileForm,
  CreateProfileFormSchema,
  CreateProfileFormValues,
  UploadAvatar,
} from '@idea-launch/profiles/ui'

import { Action, State, useDispatch, useSelector } from '../store'
import { Route, Link, RouteProps } from '../router'

import logo from '../../assets/logo.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: theme.spacing(30),
    height: theme.spacing(30),
  }
}));

export const GetStarted: FC<RouteProps<'GetStarted'>> = (props) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  const initialValues: CreateProfileFormValues = {
    first: '',
    last: '',
    classCode: ''
  }

  switch (props.step) {
    case '1':
      return (
        <div className={classes.root}>
          <div className={classes.content}>
            <img
              src={logo}
              alt='logo'
              className={classes.logo}
            />
            <br />
            <Typography
              variant='h4'
              color='textPrimary'
              align='center'
            >
              Get Started
            </Typography>
            <br />
            <Formik
              validationSchema={CreateProfileFormSchema}
              initialValues={initialValues}
              onSubmit={(values) => dispatch(
                Action.of.APIRequested({
                  payload: {
                    endpoint: 'CreateProfile',
                    body: {
                      avatar: '',
                      classCode: values.classCode,
                      name: {
                        first: values.first,
                        last: values.last,
                      }
                    }
                  }
                })
              )}
            >
              {(form) => (<CreateProfileForm form={form} />)}
            </Formik>
          </div>
        </div>
      )
    case '2':
      return (
        <div className={classes.root}>
          <div className={classes.content}>
            <img
              src={logo}
              alt='logo'
              className={classes.logo}
            />

            <Typography
              variant='h4'
              color='textPrimary'
              align='center'
            >
              Upload a Profile Picture
            </Typography>
            <br />
            <br />
            <UploadAvatar
              state={'init'}
              username='123'
              onUploadClick={console.log}
            />
          </div>
        </div>
      )
    case '3':
      return <div>Case3</div>
  }
}