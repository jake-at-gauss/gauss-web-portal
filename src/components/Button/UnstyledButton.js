import React from "react";

// Utils
import classNames from "classnames";

// Styles
import styles from "./UnstyledButton.css";

export const UnstyledButton = ({
  className,
  buttonRef,
  noOutline,
  style,
  ...props
}) => (
  <button
    type="button"
    ref={buttonRef}
    style={{ ...(noOutline && { outline: "none" }), ...style }}
    className={classNames(styles.unstyledButton, className)}
    {...props}
  />
);
