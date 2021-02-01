import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Route, RouteProps } from '../router';
import { Action, useDispatch } from '../store';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 350
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
}))

export const WelcomePage:  FC<RouteProps<'Welcome'>> = (props) => {
 
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <div className={classes.root}>
      <Typography
        variant='h4'
        color='textPrimary'
        align='center'
      >
        Nice pic! Now lets go to your home page.
      </Typography>
      <br />
      <br />
      <Button
        color='primary'
        variant='contained'
        size='large'
        onClick={() => dispatch(
          Action.of.LocationPushed({
            payload: Route.of.Feed({})
          })
        )}
      >
        Next
      </Button>
    </div>
  )

}