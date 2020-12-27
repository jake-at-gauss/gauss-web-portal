import { useEffect, useState } from "react";

// Components
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

// Styles
import "./signup.css";

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

const Signup = () => {
  const [formFields, setFormFields] = useState({
    [FIRST_NAME]: { value: "", error: "" },
    [LAST_NAME]: { value: "", error: "" },
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

      const status = await createUser(formValues);

      if (status == STATUS_SUCCESS) {
      }

      return;
    }
  };

  useEffect(() => {}, [formFields]);

  return (
    <div id="signup-page">
      <p style={{ flex: 1 }}>&nbsp;</p>
      <div id="signup-container">
        <img id="signup-logo" src="/images/logos/Gauss_logo.svg" />
        <div id="signup-elements">
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
            rightText={"Forgot Password?"}
            rightTextFunction={forgotPassword}
            onChange={onChange}
            name={PASSWORD}
          />
          <div id="signup-button-container">
            <Button onClick={submit}>Sign up</Button>
            <p>
              Already have an account?{" "}
              <UnstyledButton className="cursor-text">
                Log in here!
              </UnstyledButton>
            </p>
          </div>
        </div>
      </div>
      <div className="terms-and-service-container">
        <p>
          By using Gauss, you agree to our{" "}
          <UnstyledButton className="cursor-text">
            {" "}
            Terms and Conditions
          </UnstyledButton>{" "}
          and{" "}
          <UnstyledButton className="cursor-text">
            Privacy Policy
          </UnstyledButton>
        </p>
      </div>
    </div>
  );
};

export default Signup;
