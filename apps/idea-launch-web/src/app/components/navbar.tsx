import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { Link } from './link';
import { Route } from '../router';

import logo from '../../assets/logo.svg';

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
      </div>
    </div>
  )

}
