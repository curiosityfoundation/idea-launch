import React from 'react';

import styles from './app.module.css';

import { Route, Link, Switch } from 'react-router-dom';

export function App() {
  return (
    <div className={styles.app}>
      <header className="flex">
        <h1>Welcome to idea-launch-web!</h1>
      </header>
      <main>
        <div role="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/page-2">Page 2</Link>
            </li>
          </ul>
        </div>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <div>
                This is the generated root route.{' '}
                <Link to="/page-2">Click here for page 2.</Link>
              </div>
            )}
          />
          <Route
            path="/page-2"
            exact
            render={() => (
              <div>
                <Link to="/">Click here to go back to root page.</Link>
              </div>
            )}
          />
        </Switch>
      </main>
    </div>
  );
}

export default App;
