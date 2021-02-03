import React, { FC, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Formik } from 'formik'
import { useDispatch } from 'react-redux';

import {
  CreateProfileForm,
  CreateProfileFormSchema,
  CreateProfileFormValues,
  UploadAvatar,
} from '@idea-launch/profiles/ui'

import logo from '../../assets/logo.svg';
import { AppAction } from '../store'
import { Route, RouteProps } from '../router'

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
  const [file, setFile] = useState<File>(null)
  const [avatar, setAvatar] = useState('')
  const [preview, setPreview] = useState('')

  const reader = new FileReader();

  reader.addEventListener('load', function () {
    setPreview(String(reader.result))
    dispatch(
      AppAction.of.LocationPushed({
        payload: Route.of.GetStarted({
          step: '4'
        })
      })
    )
  }, false);

  useEffect(() => {
    if (!!file) {
      reader.readAsDataURL(file)
    }
  }, [file])

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
                  AppAction.of.LocationPushed({
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
              onFileAdded={([file]) => {
                if (!!file) {
                  setFile(file)
                }
                // setTimeout(() => {
                //   dispatch(
                //     Action.of.LocationPushed({
                //       payload: Route.of.GetStarted({
                //         step: '4'
                //       })
                //     })
                //   )
                // }, 2500);
                // dispatch(
                //   Action.of.LocationPushed({
                //     payload: Route.of.GetStarted({
                //       step: '3'
                //     })
                //   })
                // )
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
              avatar={preview}
              onBackClick={() => dispatch(
                AppAction.of.LocationPushed({
                  payload: Route.of.GetStarted({
                    step: '2',
                  })
                })
              )}
              onNextClick={() => dispatch(
                AppAction.of.APIRequested({
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