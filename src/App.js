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
  APP_BATCHES_PATH,
  APP_BUILD_PATH,
  APP_CREATE_BATCH_PATH,
  APP_PATH,
  APP_PRICING_INFO_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
} from "./constants";
import { useState } from "react";
import { deleteCookie, getCookie } from "./utils/auth";
import { AuthContext } from "./context/AuthContext";
import { get } from "lodash";
import Login from "./pages/Login/Login";
import Build from "./pages/Build/Build";
import Page from "./hocs/asPage";
import ModalService from "./components/ModalContainer/ModalService";
import BatchUploader from "./pages/BatchUploader/BatchUploader";
import BatchManager from "./pages/BatchManager/BatchManager";
import PricingInfo from "./pages/PricingInfo/PricingInfo";

const privateRoutes = [
  // {
  //   path: APP_BUILD_PATH,
  //   Component: Build,
  // },
  {
    path: APP_PRICING_INFO_PATH,
    Component: PricingInfo,
  },
  {
    path: APP_BATCHES_PATH,
    Component: BatchManager,
  },
  {
    path: APP_CREATE_BATCH_PATH,
    Component: BatchUploader,
  },
  // {
  //   path: APP_ALBUMS_PATH,
  //   Component: Albums,
  // },
  // {
  //   path: APP_ALBUM_PATH,
  //   Component: Album,
  // },
  // {
  //   path: APP_ACCOUNT_PATH,
  //   Component: Test,
  // },
];

// TODO: sweep and handle failed network requests (toast?)
// TODO: refactor auth to authService and useAuthService hook
// TODO: other stuff surely

const PrivateRoute = ({
  withoutHeader,
  children,
  isAuthenticated,
  ...rest
}) => {
  const location = useLocation();

  return (
    <AuthContext.Consumer>
      {({ isAuthenticated, logout }) => (
        <Route {...rest}>
          {isAuthenticated === true ? (
            !withoutHeader ? (
              <Page content={children} logout={logout} />
            ) : (
              children
            )
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
      <ModalService />
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
            {privateRoutes.map(({ path, Component }) => (
              <PrivateRoute path={path}>
                <Component />
              </PrivateRoute>
            ))}
            {/**CATCH PRIVATE ROUTES */}
            <Route path={APP_PATH + "*"}>
              <Redirect to={APP_CREATE_BATCH_PATH} />
            </Route>
            {/**CATCH PUBLIC ROUTES */}
            <Route path={"*"}>
              <Redirect to={SIGNUP_PATH} />
            </Route>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
