//Forms
export const EMAIL = "email";
export const PASSWORD = "password";
export const RE_PASSWORD = "re_password";
export const FIRST_NAME = "first_name";
export const LAST_NAME = "last_name";
// export const ALPACA_KEY_ID = "alpaca_key_id";
// export const ALPACA_SECRET_KEY = "alpaca_secret_key";

export const UNFILLED = "Please fill out this field";
export const EMAIL_NOT_VALID = "Please enter a correct email";
export const PASSWORDS_NO_MATCH = "Password's do not match";

//Routes

export const CREATE_USER = { ROUTE: "/api/create_user/", METHOD: "post" };
export const LOGIN = { ROUTE: "/api/login/", METHOD: "post" };
export const CREATE_RATEABLE_TEMPLATE = { ROUTE: "/api/add_template/", METHOD: "post" };

//Status Codes

export const STATUS_SUCCESS = 200;

//Paths

export const SIGNUP_PATH = "/signup";
export const LOGIN_PATH = "/login";
export const APP_PATH = "/app";
export const APP_BUILD_PATH = "/app/build";
export const APP_MANAGE_PATH = "/app/manage";
export const APP_DEPLOY_PATH = "/app/deploy";
export const APP_ACCOUNT_PATH = "/app/account";
