//File for any backend calls

import axios from "axios";
import { CREATE_USER, LOGIN } from "../constants";

export const createUser = async (formFields) => {
  return axios({
    method: CREATE_USER.METHOD,
    url: CREATE_USER.ROUTE,
    data: JSON.stringify(formFields),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  }).then((data) => {
    return data.status;
  });
};

export const login = async (formFields) => {
  return axios({
    method: LOGIN.METHOD,
    url: LOGIN.ROUTE,
    data: JSON.stringify(formFields),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  }).then((data) => {
    return data.status;
  });
};
