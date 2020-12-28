import { PASSWORD } from "../../constants";
import styles from "./input.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import classNames from "classnames";
import Column from "../Layout/Column";
import Row from "../Layout/Row";
const eye = <FontAwesomeIcon icon={faEye} />;

const Input = ({
  value,
  info,
  name,
  rightText,
  rightTextFunction,
  error,
  onChange,
  hideable,
  containerStyle,
  infoStyle,
  ...props
}) => {
  const [fieldHidden, setFieldHidden] = useState(hideable);

  const toggleFieldHidden = () => {
    setFieldHidden(!fieldHidden);
  };

  return (
    <Column style={containerStyle} className={styles.inputContainer}>
      <div style={infoStyle} className={styles.inputToptextContainer}>
        <p>{info}</p>
        <p style={{ cursor: "pointer" }} onClick={rightTextFunction}>
          {rightText}
        </p>
      </div>
      <Row align>
        <div className={styles.inputTextfieldContainer}>
          <input
            className={classNames(styles.input, { "input-error": !!error })}
            type={fieldHidden ? PASSWORD : "text"}
            onChange={onChange}
            value={value}
            key={name}
            name={name}
            {...props}
          />
          {hideable && <i onClick={toggleFieldHidden}>{eye}</i>}
        </div>
        <span
          className={classNames(
            error && styles.showError,
            styles.inputErrorText
          )}
        >
          !<span className={styles.inputErrorToolTip}>{error}</span>
        </span>
      </Row>
    </Column>
  );
};

export default Input;
