import React, { useEffect } from 'react';

import { LandingPage } from './landing'
import { ResourcesPage } from './resources'
import { ContactPage } from './contact'
import { LoginPage } from './login'
import { FeedPage } from './feed'
import { NotFoundPage } from './not-found'

import { Action, useDispatch, useSelector } from '../store';
import { Route, Router } from '../router'

export function Pages() {

  const route = useSelector((s) => s.route)
  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() =>
      dispatch(
        Action.of.ResourcesRequested({})
      ),
      1000,
    )
  }, [])

  const render = Route.matchStrict({
    Landing: () => (<LandingPage />),
    Login: () => (<LoginPage />),
    NotFound: () => (<NotFoundPage />),
    Feed: () => (<FeedPage />),
    Contact: () => (<ContactPage />),
    Resources: () => (<ResourcesPage />),
  })

  return (
    <Router>
      {render(route.current)}
    </Router>
  )

}
