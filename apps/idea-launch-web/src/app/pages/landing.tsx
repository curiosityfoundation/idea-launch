import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Navbar } from '../components/navbar'

import community from '../../assets/illustrations/community.svg';
import getStarted from '../../assets/illustrations/get-started.svg';
import integrations from '../../assets/illustrations/integrations.svg';
import welcome from '../../assets/illustrations/welcome.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(12),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  textArea: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
}));

export function LandingPage() {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Container>
        <Navbar />
        <div className={classes.row}>
          <div className={classes.textArea}>
            <Typography
              variant='h4'
              color='textPrimary'
              align='center'
            >
              Everything tomorrow’s creators need to launch something for the first time.
            </Typography>
            <br />
            <Typography
              variant='h5'
              color='textSecondary'
              align='center'
            >
              Community, resources, and a guided curriculum to transform your classroom into a start-up incubator over night.
            </Typography>
          </div>
          <img src={community} alt='community' />
        </div>
        <div className={classes.row}>
          <img src={getStarted} alt='get started' />
          <div className={classes.textArea}>
            <Typography
              variant='h4'
              color='textPrimary'
              align='center'
            >
              What is this?
            </Typography>
            <br />
            <Typography
              variant='h5'
              color='textSecondary'
              align='center'
            >
              A toolkit focused on providing a foundation for the founders and creators waiting to be discovered at diverse and rural grade schools across the United States.
            </Typography>
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.textArea}>
            <Typography
              variant='h4'
              color='textPrimary'
              align='center'
            >
              Who’s building it?
            </Typography>
            <br />
            <Typography
              variant='h5'
              color='textSecondary'
              align='center'
            >
              Idea Launch is supported by the Curiosity Foundation a non-profit based in Berkeley, CA. Our team of creators has years of experience working directly with students, teachers, and schools to launch new and innovative programs.
            </Typography>
          </div>
          <img src={integrations} alt='integrations' />
        </div>
        <div className={classes.row}>
          <img src={welcome} alt='welcome' />
          <div className={classes.textArea}>
            <Typography
              variant='h4'
              color='textPrimary'
              align='center'
            >
              How do we start?
            </Typography>
            <br />
            <Typography
              variant='h5'
              color='textSecondary'
              align='center'
            >
              Join our waitlist of schools and organizations. We’re currently piloting our program in partnership with Pajaro Valley Unified School District in California but are looking for participants for Spring, Summer, and the Fall quarters.
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  )
}