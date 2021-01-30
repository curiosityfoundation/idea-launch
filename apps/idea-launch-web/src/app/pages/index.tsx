import React, { useEffect } from 'react';
import { pipe } from '@effect-ts/core/Function'

import { LandingPage } from './landing'
import { ResourcesPage } from './resources'
import { ContactPage } from './contact'
import { LoginPage } from './login'
import { FeedPage } from './feed'
import { GetStarted } from './get-started'
import { NotFoundPage } from './not-found'

import { Action, State, useDispatch, useSelector, makeAccountStatus, AccountStatus } from '../store';
import { Route, Router, Redirect } from '../router'

const loggedOutRoutes = Route.matchStrict({
  Landing: (route) => (<LandingPage {...route} />),
  NotFound: (route) => (<NotFoundPage {...route} />),
  Resources: (route) => (<ResourcesPage {...route} />),
  Contact: (route) => (<ContactPage {...route} />),
  Login: (route) => (<LoginPage {...route} />),
  Feed: () => (<Redirect to={Route.of.Login({})} />),
  GetStarted: () => (<Redirect to={Route.of.Login({})} />),
})

const noProfileRoutes = Route.matchStrict({
  Landing: (route) => (<LandingPage {...route} />),
  NotFound: (route) => (<NotFoundPage {...route} />),
  Resources: (route) => (<ResourcesPage {...route} />),
  Contact: (route) => (<ContactPage {...route} />),
  Login: () => (<Redirect to={Route.of.GetStarted({ step: '1' })} />),
  Feed: () => (<Redirect to={Route.of.GetStarted({ step: '1' })} />),
  GetStarted: (route) => (<GetStarted {...route} />),
})

const loggedInRoutes = Route.matchStrict({
  Landing: (route) => (<LandingPage {...route} />),
  NotFound: (route) => (<NotFoundPage {...route} />),
  Resources: (route) => (<ResourcesPage {...route} />),
  Contact: (route) => (<ContactPage {...route} />),
  Login: () => (<Redirect to={Route.of.Feed({})} />),
  Feed: (route) => (<FeedPage {...route} />),
  GetStarted: (route) => (<Redirect to={Route.of.Feed({})} />),
})

export function Pages() {

  const route = useSelector((s) => s.route)
  const accountStatus = useSelector(makeAccountStatus)
  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        Action.of.APIRequested({
          payload: {
            endpoint: 'ListResources',
            body: {}
          }
        })
      )
    }, 1000)
  }, [])

  const render = pipe(
    accountStatus,
    AccountStatus.matchStrict({
      LoggedOut: () => loggedOutRoutes,
      NoProfile: () => noProfileRoutes,
      LoggedIn: () => loggedInRoutes,
    })
  )

  return (
    <Router>
      {render(route.current)}
    </Router>
  )

}
