import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'
import React, { FC, useState } from 'react'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'

import { selectLoggedIn } from '@idea-launch/accounts/ui'
import {
  CreateProfileForm,
  CreateProfileFormSchema,
  CreateProfileFormValues,
  UploadAvatar,
} from '@idea-launch/profiles/ui'

import logo from '../../assets/logo.svg'
import { AppAction, AppState } from '../store'
import { selectUpload } from '../data'
import { Route, RouteProps } from '../router'
import { Upload } from '../storage'

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
}))

const initialFormValues: CreateProfileFormValues = {
  first: '',
  last: '',
  classCode: ''
}

const avatarUploadId = 'avatar-upload-id'

export const GetStarted: FC<RouteProps<'GetStarted'>> = (props) => {

  const classes = useStyles()
  const dispatch = useDispatch()
  const avatarUpload = useSelector(
    (s: AppState) => selectUpload(s.data)(avatarUploadId)
  )
  const loggedIn = useSelector(
    (s: AppState) => selectLoggedIn(s.account)
  )
  
  const [formState, setFormState] = useState(initialFormValues)

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
            {
              pipe(
                avatarUpload,
                O.fold(
                  () => (
                    <UploadAvatar
                      state='init'
                      username={`${formState.first} ${formState.last}`}
                      onFileAdded={([file]) => {
                        if (!!file) {
                          dispatch(
                            AppAction.of.UploadRequested({
                              payload: {
                                id: avatarUploadId,
                                file,
                              }
                            })
                          )
                        }
                      }}
                    />
                  ),
                  Upload.matchStrict({
                    InProgress: () => (
                      <UploadAvatar
                        state='uploading'
                        username={`${formState.first} ${formState.last}`}
                      />
                    ),
                    Complete: ({ url }) => (
                      <UploadAvatar
                        state='uploaded'
                        avatar={url}
                        onBackClick={() => dispatch(
                          AppAction.of.RemoveEntries({
                            payload: {
                              table: 'uploads',
                              ids: [avatarUploadId]
                            }
                          })
                        )}
                        onNextClick={() => dispatch(
                          AppAction.of.APIRequested({
                            payload: {
                              endpoint: 'CreateProfile',
                              jwt: O.fold_(
                                loggedIn,
                                () => '',
                                ({ idToken }) => idToken,
                              ),
                              body: {
                                classCode: formState.classCode,
                                avatar: url,
                                name: {
                                  first: formState.first,
                                  last: formState.last,
                                }
                              }
                            }
                          })
                        )}
                      />
                    ),
                    Failed: ({ reason }) => (
                      <div>
                        <UploadAvatar
                          state='init'
                          username={`${formState.first} ${formState.last}`}
                          onFileAdded={([file]) => {
                            if (!!file) {
                              dispatch(
                                AppAction.of.UploadRequested({
                                  payload: {
                                    id: avatarUploadId,
                                    file,
                                  }
                                })
                              )
                            }
                          }}
                        />
                        <Typography
                          variant='h4'
                          color='textPrimary'
                          align='center'
                        >
                          Something went wrong... {reason}. Please try again.
                        </Typography>
                      </div>
                    ),
                  })

                )
              )}
          </div>
        </div>
      )
    
  }

}