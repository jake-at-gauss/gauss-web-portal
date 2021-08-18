//File for any backend calls

import axios from "axios";
import {
  CREATE_CHECKOUT_SESSION,
  CREATE_RATEABLE_TEMPLATE,
  CREATE_TASK,
  CREATE_TASK_BATCH,
  CREATE_USER,
  GET_TASKS_FROM_BATCH,
  GET_TASK_BATCHES,
  GET_USER,
  LOGIN,
} from "../constants";
import { composePath } from "./general";

export const createUser = async (formFields) => {
  return axios({
    method: CREATE_USER.METHOD,
    url: CREATE_USER.ROUTE,
    data: formFields,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
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
  options = [],
  image_urls = [],
  enterprise_id = 0
) => {
  if (image_urls.length < 100) {
    return axios({
      method: CREATE_TASK_BATCH.METHOD,
      url: CREATE_TASK_BATCH.ROUTE,
      data: {
        options,
        image_urls,
        enterprise_id,
      },
    });
  }

  return axios({
    method: CREATE_TASK_BATCH.METHOD,
    url: CREATE_TASK_BATCH.ROUTE,
    data: {
      options,
      image_urls: image_urls.slice(0, 100),
      enterprise_id,
    },
  }).then(async ({ data }) => {
    // Upload remaining tasks
    // TODO: allow this to be done in batches
    await Promise.all(
      image_urls.slice(101, -1).map((image_url) =>
        axios({
          method: CREATE_TASK.METHOD,
          url: CREATE_TASK.ROUTE,
          data: {
            options,
            image_url,
            batch_identifier: data.task_batch.batch_identifier,
          },
        })
      )
    );

    return { data };
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

export const fetchBatchTasks = async (batch_identifier, page = 1) => {
  return axios({
    method: GET_TASKS_FROM_BATCH.METHOD,
    url: composePath(GET_TASKS_FROM_BATCH.ROUTE, {
      task_id: batch_identifier,
      page,
    }),
  });
};
