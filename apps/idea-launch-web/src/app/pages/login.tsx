import React from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme } from '@material-ui/core/styles';
import GoogleSignInButton from 'react-google-button';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: theme.spacing(30),
    height: theme.spacing(30),
  },
  links: {
    width: 'fit-content',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    '& svg': {
      margin: theme.spacing(1.5),
    },
    '& hr': {
      margin: theme.spacing(0, 0.5),
    },
  }
}));

export function LoginPage() {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <img
          src={logo}
          alt='logo'
          className={classes.logo}
        />
        <br />
        <GoogleSignInButton />
        <br />
        <Grid alignItems='center' className={classes.links}>
          <Link to='/'>
            Home
          </Link>
          <Divider orientation='vertical' flexItem />
          <Link to='/legal/privacy'>
            Privacy
          </Link>
          <Divider orientation='vertical' flexItem />
          <Link to='/legal/tos'>
            Terms of Service
          </Link>
        </Grid>
      </div>
    </div>
  )
}