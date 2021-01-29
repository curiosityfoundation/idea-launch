import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { Link, Route } from '../router';

import logo from '../../assets/logo.svg';
import { State, useSelector, useDispatch, Action } from '../store';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  menuButton: {
    margin: theme.spacing(1),
  }
}));

export function Navbar() {

  const classes = useStyles()
  const account = useSelector((s) => s.account)
  const dispatch = useDispatch()

  return (
    <div className={classes.root}>
      <Link to={Route.of.Landing({})}>
        <img src={logo} alt='logo' />
      </Link>
      <div>
        <Button
          className={classes.menuButton}
          component={Link}
          to={Route.of.Resources({})}
          color='primary'
          variant='outlined'
          size='large'
        >
          Resources
        </Button>
        <Button
          className={classes.menuButton}
          component={Link}
          to={Route.of.Contact({})}
          color='primary'
          variant='outlined'
          size='large'
        >
          Contact Us
        </Button>
        {State.account.matchStrict({
          LoggedIn: () => (
            <Button
              className={classes.menuButton}
              color='primary'
              variant='contained'
              size='large'
              onClick={() => dispatch(
                Action.of.LogoutStarted({})
              )}
            >
              Log Out
            </Button>
          ),
          LoggingIn: () => (
            <Button
              className={classes.menuButton}
              color='primary'
              variant='contained'
              size='large'
              disabled
            >
              Log In
            </Button>
          ),
          LoggedOut: () => (
            <Button
              className={classes.menuButton}
              component={Link}
              to={Route.of.Login({})}
              color='primary'
              variant='contained'
              size='large'
            >
              Log In
            </Button>
          ),
          LoggingOut: () => (
            <Button
              className={classes.menuButton}
              color='primary'
              variant='contained'
              size='large'
              disabled
            >
              Log Out
            </Button>
          ),
        })(account)}
      </div>
    </div>
  )

}
