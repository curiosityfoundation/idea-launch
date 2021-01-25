import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import GoogleSignInButton from 'react-google-button';
import { Link, Redirect } from 'react-router-dom';

import { Action, State, useDispatch, useSelector } from '../constants'
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
  },
  links: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
}));

function SignInButton() {

  const accountState = useSelector((s: State) => s.account)
  const dispatch = useDispatch()

  const onLoginClick = () => dispatch(Action.of.LoginStarted({}))

  const render = State.account.matchStrict({
    LoggedIn: () => <Redirect to='/feed' />,
    LoggedOut: () => <GoogleSignInButton onClick={onLoginClick} />,
    LoggingIn: () => <GoogleSignInButton disabled />,
    LoggingOut: () => <GoogleSignInButton disabled />,
  })

  return render(accountState)

}

export function LoginPage() {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography
          variant='h4'
          color='textPrimary'
          align='center'
        >
          Sign In
        </Typography>
        <img
          src={logo}
          alt='logo'
          className={classes.logo}
        />
        <br />
        <SignInButton />
        <br />
        <div className={classes.links}>
          <Typography
            color='textSecondary'
          >
            <Link to='/'>
              Home
            </Link>
          </Typography>
          &nbsp;|&nbsp;
          <Typography
            color='textSecondary'
          >
            <Link to='/legal/privacy'>
              Privacy
            </Link>
          </Typography>
          &nbsp;|&nbsp;
          <Typography
            color='textSecondary'
          >
            <Link to='/legal/tos'>
              Terms of Service
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}