import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Navbar } from '../components/navbar'

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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  }
}));

export function FeedPage() {

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
              Feed
            </Typography>
            <br />
          </div>
        </div>
      </Container>
    </div>
  )
}