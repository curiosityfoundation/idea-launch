import { pipe } from '@effect-ts/core/Function'
import * as A from '@effect-ts/core/Array'
import * as O from '@effect-ts/core/Option'
import * as R from '@effect-ts/core/Record'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Formik } from 'formik'
import React, { FC } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import {
  ProjectCard,
  PostProjectForm,
  postProjectValidationSchema,
  PostProjectValues,
  CommentInput,
  CommentList
} from '@idea-launch/projects/ui'

import { Navbar } from '../components/navbar'
import { RouteProps } from '../router'
import { AppAction, AppState } from '../store'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(12),
  },
  row: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const FeedPage: FC<RouteProps<'Feed'>> = () => {

  const classes = useStyles()
  const dispatch = useDispatch()
  const data = useSelector((s: AppState) => s.data)

  const initialValues: PostProjectValues = {
    title: '',
    description: '',
    link: '',
  }

  return (
    <div className={classes.root}>
      <Container>
        <Navbar />
        <Typography
          variant='h4'
          color='textPrimary'
          align='center'
        >
          Ready to share an idea?
        </Typography>
        <Formik
          onSubmit={async (values) => dispatch(
            AppAction.of.JWTRequested({
              payload: AppAction.as.APIRequested({
                payload: {
                  endpoint: 'CreateProject',
                  body: values
                }
              })
            })
          )}
          initialValues={initialValues}
          validationSchema={postProjectValidationSchema}
        >
          {(form) => (
            <PostProjectForm form={form} />
          )}
        </Formik>
        {pipe(
          data.projects.entries,
          R.toArray,
          A.filterMap(([id, project]) => pipe(
            data.profiles.entries,
            R.lookup(project.owner),
            O.map((profile) => (
              <div className={classes.row}>
                <ProjectCard
                  key={project.id}
                  username={`${profile.name.first} ${profile.name.last}`}
                  title={project.title}
                  description={project.description}
                  avatar={profile.avatar}
                  url={project.link}
                  favoriteCount={13}
                />
                <Formik
                  onSubmit={async (values) => dispatch(
                    AppAction.of.JWTRequested({
                      payload: AppAction.as.APIRequested({
                        payload: {
                          endpoint: 'CreateComment',
                          body: {
                            ...values,
                            projectId: project.id
                          }
                        }
                      })
                    })
                  )}
                  initialValues={{
                    content: ''
                  }}
                >
                  {(form) => (
                    <CommentInput form={form} />
                  )}
                </Formik>
                <CommentList
                  comments={pipe(
                    data.comments.entries,
                    R.toArray,
                    A.filter(([_, comment]) => comment.projectId === project.id),
                    A.filterMap(([_, comment]) =>
                      pipe(
                        data.profiles.entries,
                        R.lookup(comment.owner),
                        O.map((profile) => [comment, profile] as const)
                      )
                    ),
                    A.map(([comment, profile]) => ({
                      id: comment.id,
                      content: comment.content,
                      created: moment(comment.created).fromNow(),
                      username: `${profile.name.first} ${profile.name.last}`,
                      avatar: profile.avatar,
                    }))
                  )}
                />
              </div>
            ))
          ))
        )}
      </Container>
    </div>
  )
}