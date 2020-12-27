import { PASSWORD } from "../../constants";
import "./input.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import classNames from "classnames";
const eye = <FontAwesomeIcon icon={faEye} />;

const Input = ({
  value,
  info,
  name,
  rightText,
  rightTextFunction,
  error,
  onChange,
}) => {
  const [fieldHidden, setFieldHidden] = useState(name !== PASSWORD);

  const toggleShowPassword = () => {
    setFieldHidden(!fieldHidden);
  };

  return (
    <div id="input-container">
      <div id="input-toptext-container">
        <p>{info}</p>
        <p style={{ cursor: "pointer" }} onClick={rightTextFunction}>
          {rightText}
        </p>
      </div>
      <div id="input-textfield-container">
        <input
          className={classNames("input", { "input-error": !!error })}
          type={!fieldHidden ? PASSWORD : "text"}
          onChange={onChange}
          value={value}
          key={name}
          name={name}
        />
        {name == PASSWORD && <i onClick={toggleShowPassword}>{eye}</i>}
      </div>
      <span className="input-error-text">&nbsp;{error}</span>
    </div>
  );
};

export default Input;
