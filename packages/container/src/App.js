import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';

import Progress from './components/Progress';
import Header from './components/Header';
import OktaSignInWidget from './OktaSingInWidget';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

const history = createBrowserHistory();

export default () => {
  const { oktaAuth } = useOktaAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);

  // if (authState.isPending) return null;

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


  const Login = ({ config }) => {
    const { oktaAuth, authState } = useOktaAuth();
  
    const onSuccess = (tokens) => {
      oktaAuth.handleLoginRedirect(tokens);
    };
  
    const onError = (err) => {
      console.log('error logging in', err);
    };
  
    if (authState.isPending) return null;
  
    return authState.isAuthenticated ?
      <Redirect to={{ pathname: '/' }}/> :
      <OktaSignInWidget
        config={config}
        onSuccess={onSuccess}
        onError={onError}/>;
  };

  return (
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
              <Route path="/dashboard">
                {!isSignedIn && <Redirect to="/" />}
                {/* <DashboardLazy /> */}
                <Login />
              </Route>
              <Route path="/" component={MarketingLazy} />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  );
};
