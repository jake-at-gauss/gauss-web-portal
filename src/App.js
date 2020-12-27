import "./App.css";
import { Route, withRouter } from "react-router";
import Signup from "./pages/Signup/Signup.js";
import { useEffect, useState } from "react";
import {
  APP_ACCOUNT_PATH,
  APP_BUILD_PATH,
  APP_DEPLOY_PATH,
  APP_MANAGE_PATH,
  APP_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
} from "./constants";

function App() {
  return (
    <div className="app">
      <Route path={SIGNUP_PATH}>
        <Signup />
      </Route>
      <Route path={LOGIN_PATH}></Route>
      <Route path={APP_PATH}>
        <Route path={APP_BUILD_PATH}></Route>
        <Route path={APP_ACCOUNT_PATH}></Route>
      </Route>
    </div>
  );
}

export default App;
