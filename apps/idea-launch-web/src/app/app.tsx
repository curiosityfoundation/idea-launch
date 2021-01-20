import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import { LandingPage } from './pages/landing'
import { ResourcesPage } from './pages/resources'

import './app.module.css';

export function App() {
  return (
    <div>
      <main>
        <LandingPage />
        {/* <Switch>
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
        </Switch> */}
      </main>
    </div>
  );
}

export default App;
