import React, { FC } from 'react'
import { pipe } from '@effect-ts/core/Function'
import * as A from '@effect-ts/core/Array'
import * as O from '@effect-ts/core/Option'
import * as R from '@effect-ts/core/Record'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles';

import { mockProfileTable } from '@idea-launch/profiles/model'
import { ProjectCard } from '@idea-launch/projects/ui'
import { mockProjects } from '@idea-launch/projects/model'

import { Navbar } from '../components/navbar'
import { RouteProps } from '../router'

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
        {pipe(
          mockProjects,
          A.filterMap((project) => pipe(
            mockProfileTable,
            R.lookup(project.id),
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
              </div>
            ))
          ))
        )}
      </Container>
    </div>
  )
}