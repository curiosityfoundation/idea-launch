import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Action, useDispatch } from './constants';
import { LandingPage } from './pages/landing'
import { ResourcesPage } from './pages/resources'
import { ContactPage } from './pages/contact'
import { LoginPage } from './pages/login'
import { FeedPage } from './pages/feed'
import { NotFoundPage } from './pages/not-found'

import './app.module.css';

export function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() =>
      dispatch(
        Action.of.ResourcesRequested({})
      ),
      1000,
    )
  })

  return (
    <Switch>
      <Route
        path='/'
        exact
        render={() => <LandingPage />}
      />
      <Route
        path='/resources'
        render={() => <ResourcesPage />}
      />
      <Route
        path='/contact'
        exact
        render={() => <ContactPage />}
      />
      <Route
        path='/login'
        exact
        render={() => <LoginPage />}
      />
      <Route
        path='/feed'
        exact
        render={() => <FeedPage />}
      />
      <Route
        path='*'
        exact
        render={() => <NotFoundPage />}
      />
    </Switch>
  );
}

export default App;
