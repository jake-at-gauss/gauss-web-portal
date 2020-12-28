import styles from "./App.css";
import {
  Redirect,
  Route,
  Router,
  Switch,
  useHistory,
  useLocation,
} from "react-router";
import Signup from "./pages/Signup/Signup.js";
import {
  APP_ACCOUNT_PATH,
  APP_BUILD_PATH,
  APP_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
} from "./constants";
import { useState } from "react";
import { deleteCookie, getCookie } from "./utils/auth";
import { AuthContext } from "./context/AuthContext";
import { get } from "lodash";
import Login from "./pages/Login/Login";
import Build from "./pages/Build/Build";

const PrivateRoute = ({ children, isAuthenticated, ...rest }) => {
  const location = useLocation();

  return (
    <AuthContext.Consumer>
      {({ isAuthenticated }) => (
        <Route {...rest}>
          {isAuthenticated === true ? (
            children
          ) : (
            <Redirect
              to={{ pathname: LOGIN_PATH, state: { from: location } }}
            />
          )}
        </Route>
      )}
    </AuthContext.Consumer>
  );
};

const PublicRoute = ({ children, isAuthenticated, ...rest }) => {
  const location = useLocation();
  const from = get(location, "state.from", {});
  const redirectTo = from.pathname ? from.pathname : APP_PATH;

  return (
    <AuthContext.Consumer>
      {({ isAuthenticated }) => (
        <Route {...rest}>
          {!isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{ pathname: redirectTo, state: { from: location } }}
            />
          )}
        </Route>
      )}
    </AuthContext.Consumer>
  );
};

function App() {
  const history = useHistory();
  const [isAuthenticated, setAuthentication] = useState(!!getCookie("token"));

  const login = () => {
    if (!!getCookie("token")) {
      setAuthentication(true);
    }
  };

  const logout = () => {
    deleteCookie("token");
    setAuthentication(false);
  };

  return (
    <div className={styles.app}>
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <Router history={history}>
          <Switch>
            {/** PUBLIC ROUTES */}
            <PublicRoute path={SIGNUP_PATH}>
              <Signup login={login} />
            </PublicRoute>
            <PublicRoute path={LOGIN_PATH}>
              <Login login={login} />
            </PublicRoute>

            {/** PRIVATE ROUTES */}
            <PrivateRoute path={APP_BUILD_PATH}>
              <Build logout={logout} />
            </PrivateRoute>
            <PrivateRoute path={APP_ACCOUNT_PATH}></PrivateRoute>

            {/**CATCH PRIVATE ROUTES */}
            <Route path={APP_PATH + "*"}>
              <Redirect to={APP_BUILD_PATH} />
            </Route>

            {/**CATCH PUBLIC ROUTES */}
            <Route path="*">
              <Redirect to={SIGNUP_PATH} />
            </Route>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
