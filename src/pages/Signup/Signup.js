import { useEffect, useState } from "react";

// Components
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

// Styles
import styles from "./signup.css";

// Utils
import { verifyFormFields } from "../../utils/verification";
import {
  EMAIL,
  FIRST_NAME,
  LAST_NAME,
  LOGIN_PATH,
  PASSWORD,
  STATUS_SUCCESS,
} from "../../constants";
import { createUser } from "../../utils/queries";
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import { Link, useLocation } from "react-router-dom";
import Row from "../../components/Layout/Row";

import { ReactComponent as Logo } from "../../assets/logo_no_shadow.svg";
import regStyles from "../../styles/constants";

const Signup = ({ login }) => {
  const location = useLocation();
  let params = new URLSearchParams(location.search);

  const name = (params.get("name") || "").split(" ");
  const first_name = name[0] || "";
  const last_name = name.slice(1).join(" ") || "";

  const [formFields, setFormFields] = useState({
    [FIRST_NAME]: { value: first_name, error: "" },
    [LAST_NAME]: { value: last_name, error: "" },
    [EMAIL]: { value: params.get("email"), error: "" },
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

      const { status } = await createUser(formValues);

      if (status === STATUS_SUCCESS) {
        login();
      }

      // TODO: handle failed request
      return;
    }
  };

  return (
    <div className={styles.signupPage}>
      <p style={{ flex: 1 }}>&nbsp;</p>
      <div className={styles.signupContainer}>
        <Row align style={{ width: "70%" }}>
          <Logo style={{ marginRight: 8 }} width="3em" />
          <h1 style={{ color: regStyles.base }}>Gauss</h1>
        </Row>
        <div className={styles.signupElements}>
          <Input
            info={"Enter your first name"}
            value={formFields[FIRST_NAME].value}
            error={formFields[FIRST_NAME].error}
            onChange={onChange}
            name={FIRST_NAME}
          />
          <Input
            info={"Enter your last name"}
            value={formFields[LAST_NAME].value}
            error={formFields[LAST_NAME].error}
            onChange={onChange}
            name={LAST_NAME}
          />
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
            onChange={onChange}
            name={PASSWORD}
            hideable
          />
          <div className={styles.signupButtonContainer}>
            <Button onClick={submit}>Sign up</Button>
            <p>
              Already have an account?{" "}
              <Link to={LOGIN_PATH}>
                <span className={styles.cursorText}>Log in here!</span>
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

export default Signup;
