import React, { useEffect } from 'react';

import { LandingPage } from './pages/landing'
import { ResourcesPage } from './pages/resources'
import { ContactPage } from './pages/contact'
import { LoginPage } from './pages/login'
import { FeedPage } from './pages/feed'
import { NotFoundPage } from './pages/not-found'
import { Router } from './components/router';

import { Action, useDispatch, useSelector } from './constants';
import { Route } from './router'
import './app.module.css';

export function App() {

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

export default App;
