//File for any backend calls

import axios from "axios";
import {
  CREATE_CHECKOUT_SESSION,
  CREATE_RATEABLE_TEMPLATE,
  CREATE_TASK_BATCH,
  CREATE_USER,
  GET_TASK_BATCHES,
  GET_USER,
  LOGIN,
} from "../constants";

export const createUser = async (formFields) => {
  return axios({
    method: CREATE_USER.METHOD,
    url: CREATE_USER.ROUTE,
    data: formFields,
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
    data: formFields,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  }).then((data) => {
    return data.status;
  });
};

export const addTemplate = async (formFields) => {
  return axios({
    method: CREATE_RATEABLE_TEMPLATE.METHOD,
    url: CREATE_RATEABLE_TEMPLATE.ROUTE,
    data: formFields,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then((data) => {
    return data.status;
  });
};

// BATCH CREATION
export const createTaskBatch = async (
  options,
  image_urls,
  enterprise_id = 0
) => {
  return axios({
    method: CREATE_TASK_BATCH.METHOD,
    url: CREATE_TASK_BATCH.ROUTE,
    data: {
      options,
      image_urls,
      enterprise_id,
    },
  });
};

// STRIPE CHECKOUT
export const createCheckoutSession = async (data) => {
  return axios({
    method: CREATE_CHECKOUT_SESSION.METHOD,
    url: CREATE_CHECKOUT_SESSION.ROUTE,
    data,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then((response) => {
    const { session_url } = response.data;

    if (!!session_url) {
      window.location = session_url;
    }
  });
};

export const fetchBatches = async (page = 1) => {
  return axios({
    method: GET_TASK_BATCHES.METHOD,
    url: `${GET_TASK_BATCHES.ROUTE}${page}/`,
  });
};

export const fetchUser = async (user = 0) => {
  return axios({
    method: GET_USER.METHOD,
    url: `${GET_USER.ROUTE}${user}/`,
  });
};
