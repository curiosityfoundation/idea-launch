import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC } from 'react'
import GoogleSignInButton from 'react-google-button';
import { useDispatch, useSelector } from 'react-redux';

import { AppState, AppAction } from '../store'
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
  },
  links: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
}));

function SignInButton() {

  const account = useSelector((s: AppState) => s.account)
  const dispatch = useDispatch()

  const onLoginClick = () => dispatch(AppAction.of.LoginStarted({}))

  const render = AppState.account.matchStrict({
    LoggedIn: () => <GoogleSignInButton disabled />,
    LoggedOut: () => <GoogleSignInButton onClick={onLoginClick} />,
    LoggingIn: () => <GoogleSignInButton disabled />,
    LoggingOut: () => <GoogleSignInButton disabled />,
  })

  return render(account)

}

export const LoginPage: FC<RouteProps<'Login'>> = () => {

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
            <Link to={Route.of.Landing({})}>
              Home
            </Link>
          </Typography>
          &nbsp;|&nbsp;
          <Typography
            color='textSecondary'
          >
            <Link to={Route.of.Landing({})}>
              Privacy
            </Link>
          </Typography>
          &nbsp;|&nbsp;
          <Typography
            color='textSecondary'
          >
            <Link to={Route.of.Landing({})}>
              Terms of Service
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  )
}