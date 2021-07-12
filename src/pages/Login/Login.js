import { useEffect, useState } from "react";

// Components
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

// Styles
import styles from "./login.css";

// Utils
import { verifyFormFields } from "../../utils/verification";
import { EMAIL, SIGNUP_PATH, PASSWORD, STATUS_SUCCESS } from "../../constants";
import { login as loginUser } from "../../utils/queries";
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import { Link } from "react-router-dom";

const Login = ({ login }) => {
  const [formFields, setFormFields] = useState({
    [EMAIL]: { value: "", error: "" },
    [PASSWORD]: { value: "", error: "" },
  });

  const onChange = (e) => {
    updateFields(e.target.name, e.target.value, "value");
  };

  //Updates the fields on the formData state. Field value can be passed in as (value) or (error)
  const updateFields = (name, value, field) => {
    setFormFields({
      ...formFields,
      [name]: { ...formFields[name], [field]: value },
    });
  };

  const forgotPassword = () => {};

  // First submits formData to verify and returns the same object but with errors filled in
  // then counts the number of errors
  const submit = async () => {
    const verifiedFormFields = verifyFormFields(formFields);

    let hasErrors = !!Object.values(verifiedFormFields).find(
      ({ error }) => !!error
    );

    setFormFields(verifiedFormFields);

    if (!hasErrors) {
      const formValues = Object.entries(verifiedFormFields).reduce(
        (acc, [key, { value }]) => ({
          ...acc,
          [key]: value,
        }),
        {}
      );

      const { status } = await loginUser(formValues)
        .then((data) => data)
        .catch((data) => data)
        .finally((data) => data);

      if (status === STATUS_SUCCESS) {
        login();
      } else {
        setFormFields({
          ...formFields,
          [PASSWORD]: {
            ...formFields[PASSWORD],
            error: "Invalid user or password",
          },
        });
      }

      return;
    }
  };

  return (
    <div className={styles.loginPage}>
      <p style={{ flex: 1 }}>&nbsp;</p>
      <div className={styles.loginContainer}>
        {/* <img className={styles.loginLogo} src="/images/logos/gauss_logo.svg" /> */}
        <div className={styles.loginElements}>
          <Input
            info={"Enter your email"}
            value={formFields[EMAIL].value}
            error={formFields[EMAIL].error}
            onChange={onChange}
            name={EMAIL}
          />
          <Input
            info={"Enter your password"}
            value={formFields[PASSWORD].value}
            error={formFields[PASSWORD].error}
            rightText={"Forgot Password?"}
            rightTextFunction={forgotPassword}
            onChange={onChange}
            name={PASSWORD}
            hideable
          />
          <div className={styles.loginButtonContainer}>
            <Button onClick={submit}>Log In</Button>
            <p>
              Don't have an account yet?{" "}
              <Link to={SIGNUP_PATH}>
                <span className={styles.cursorText}>Sign Up here!</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.termsAndServiceContainer}>
        <p>
          By using Gauss, you agree to our{" "}
          <UnstyledButton className={styles.cursorText}>
            {" "}
            Terms and Conditions
          </UnstyledButton>{" "}
          and{" "}
          <UnstyledButton className={styles.cursorText}>
            Privacy Policy
          </UnstyledButton>
        </p>
      </div>
    </div>
  );
};

export default Login;
