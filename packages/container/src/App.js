import React, { lazy, Suspense, useState, useEffect } from 'react';
// import { useOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { createBrowserHistory } from 'history';

// Fetching Okta Configuration
import {oktaAuthConfig, oktaSignInConfig} from '../config/oktaAuthConfig';

import Progress from './components/Progress';
import Login from './Login'
import Header from './components/Header';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

import("@okta/okta-react").then(console.log)

const history = createBrowserHistory();
// Fetching the okta Configuration;
const oktaAuth = new OktaAuth(oktaAuthConfig);

export default  () => {
  console.log("okta",OktaAuth)
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      history.push('/dashboard');
    }
  }, [isSignedIn]);

  const logMeIn = (event) => {
    setTimeout(() => {
      console.log(event)
      localStorage.setItem("loggedin",true)
      setIsSignedIn(true)
    }, 2000);
  }

  const logMeOut = () => {
    setTimeout(() => {
      localStorage.removeItem("loggedin");
      setIsSignedIn(false);
    }, 200);
  }

  const customAuthHandler = () => {
    history.push('/login');
  };

  return (
    <Security  oktaAuth={oktaAuth} onAuthRequired={customAuthHandler}>
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header
            onSignOut={() => logMeOut()}
            isSignedIn={isSignedIn}
          />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route path="/auth">
                <AuthLazy onSignIn={(event) => logMeIn(event)} />
              </Route>
              <Route path='/' render={() => <Login config={oktaSignInConfig} />} /> 
              <Route path="/dashboard">
                {!isSignedIn && <Redirect to="/" />}
                <DashboardLazy />
                {/* <Login /> */}
              </Route>
              <SecureRoute path='/protected' component={MarketingLazy} />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
    </Security>
  );
};

