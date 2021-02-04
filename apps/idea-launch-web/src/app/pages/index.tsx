import { pipe } from '@effect-ts/core/Function'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppAction, AppState, selectAccountStatus, AccountStatus } from '../store';
import { Route, Router, Redirect } from '../router'

import { LandingPage } from './landing'
import { ResourcesPage } from './resources'
import { ContactPage } from './contact'
import { LoginPage } from './login'
import { FeedPage } from './feed'
import { GetStarted } from './get-started'
import { NotFoundPage } from './not-found'
import { WelcomePage } from './welcome'

const loggedOutRoutes = Route.matchStrict({
  Landing: (route) => (<LandingPage {...route} />),
  NotFound: (route) => (<NotFoundPage {...route} />),
  Resources: (route) => (<ResourcesPage {...route} />),
  Contact: (route) => (<ContactPage {...route} />),
  Login: (route) => (<LoginPage {...route} />),
  Feed: () => (<Redirect to={Route.of.Login({})} />),
  GetStarted: () => (<Redirect to={Route.of.Login({})} />),
  Welcome: (route) => (<WelcomePage {...route} />),
})

const noProfileRoutes = Route.matchStrict({
  Landing: (route) => (<LandingPage {...route} />),
  NotFound: (route) => (<NotFoundPage {...route} />),
  Resources: (route) => (<ResourcesPage {...route} />),
  Contact: (route) => (<ContactPage {...route} />),
  Login: () => (<Redirect to={Route.of.GetStarted({ step: '1' })} />),
  Feed: () => (<Redirect to={Route.of.GetStarted({ step: '1' })} />),
  GetStarted: (route) => (<GetStarted {...route} />),
  Welcome: (route) => (<WelcomePage {...route} />),
})

const loggedInRoutes = Route.matchStrict({
  Landing: (route) => (<LandingPage {...route} />),
  NotFound: (route) => (<NotFoundPage {...route} />),
  Resources: (route) => (<ResourcesPage {...route} />),
  Contact: (route) => (<ContactPage {...route} />),
  Login: () => (<Redirect to={Route.of.Feed({})} />),
  Feed: (route) => (<FeedPage {...route} />),
  GetStarted: () => (<Redirect to={Route.of.Feed({})} />),
  Welcome: (route) => (<WelcomePage {...route} />),
})

export function Pages() {

  const route = useSelector((s: AppState) => s.route)
  const accountStatus = useSelector(selectAccountStatus)

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
