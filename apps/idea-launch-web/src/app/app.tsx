import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { LandingPage } from './pages/landing'
import { ResourcesPage } from './pages/resources'
import { ContactPage } from './pages/contact'
import { LoginPage } from './pages/login'
import { FeedPage } from './pages/feed'
import { NotFoundPage } from './pages/not-found'

import './app.module.css';

export function App() {
  return (
    <Switch>
      <Route
        path='/'
        exact
        render={() => <LandingPage />}
      />
      <Route
        path='/resources'
        exact
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
