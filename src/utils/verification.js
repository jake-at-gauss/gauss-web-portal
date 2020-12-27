//File for any form verification

import { EMAIL, EMAIL_NOT_VALID, UNFILLED } from "../constants";
const emailRegex = /[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*/;

export const verifyFormFields = (formFields) => {
  //function for returning specific errors relating to the form fields
  const returnError = (key, value) => {
    if (!value) {
      return UNFILLED;
    } else {
      switch (key) {
        case EMAIL:
          return !emailRegex.test(value) && EMAIL_NOT_VALID;
        default:
          return false;
      }
    }
  };

  //Rebuilds the formFields object with the errors filled
  return Object.entries(formFields).reduce(
    (acc, [key, { value }]) => ({
      ...acc,
      [key]: {
        error: returnError(key, value),
        value,
      },
    }),
    {}
  );
};
