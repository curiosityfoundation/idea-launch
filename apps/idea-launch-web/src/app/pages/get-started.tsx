import React, { FC, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Formik } from 'formik'

import {
  CreateProfileForm,
  CreateProfileFormSchema,
  CreateProfileFormValues,
  UploadAvatar,
  UploadAvatarProps
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

const initialFormValues: CreateProfileFormValues = {
  first: '',
  last: '',
  classCode: ''
}

export const GetStarted: FC<RouteProps<'GetStarted'>> = (props) => {

  const classes = useStyles()
  const dispatch = useDispatch()

  const [formState, setFormState] = useState(initialFormValues)
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    console.log(formState, avatar);
  }, [formState, avatar])

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
              initialValues={initialFormValues}
              onSubmit={(values) => {
                setFormState(values)
                dispatch(
                  Action.of.LocationPushed({
                    payload: Route.of.GetStarted({
                      step: '2'
                    })
                  })
                )
              }}
            >
              {(form) => (<CreateProfileForm form={form} />)}
            </Formik>
          </div>
        </div >
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
              state='init'
              username={`${formState.first} ${formState.last}`}
              onUploadClick={() => {
                setTimeout(() => {
                  setAvatar('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?r=pg')
                  dispatch(
                    Action.of.LocationPushed({
                      payload: Route.of.GetStarted({
                        step: '4'
                      })
                    })
                  )
                }, 2500);
                dispatch(
                  Action.of.LocationPushed({
                    payload: Route.of.GetStarted({
                      step: '3'
                    })
                  })
                )
              }}
            />
          </div>
        </div>
      )
    case '3':
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
              state='uploading'
              username={`${formState.first} ${formState.last}`}
            />
          </div>
        </div>
      )
    case '4':
      return (
        <div className={classes.root}>
          <div className={classes.content}>
            <img
              src={logo}
              alt='logo'
              className={classes.logo}
            />
            <br />
            <br />
            <UploadAvatar
              state='uploaded'
              avatar=''
              onBackClick={() => dispatch(
                Action.of.LocationPushed({
                  payload: Route.of.GetStarted({
                    step: '2',
                  })
                })
              )}
              onNextClick={() => dispatch(
                Action.of.APIRequested({
                  payload: {
                    endpoint: 'CreateProfile',
                    body: {
                      classCode: formState.classCode,
                      avatar,
                      name: {
                        first: formState.first,
                        last: formState.last,
                      }
                    }
                  }
                })
              )}
            />
          </div>
        </div>
      )
  }

}