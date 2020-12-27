import React from "react";

// Utils
import classNames from "classnames";

// Styles
import styles from "./UnstyledButton.module.css";

export const UnstyledButton = ({
  className,
  buttonRef,
  noOutline,
  style,
  ...props
}) => (
  <button
    ref={buttonRef}
    style={{ ...(noOutline && { outline: "none" }), ...style }}
    className={classNames(styles.unstyledButton, className)}
    {...props}
  />
);