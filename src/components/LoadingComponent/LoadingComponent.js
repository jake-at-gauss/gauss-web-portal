import React from "react";
import classNames from "classnames";
import styles from "./loading.css";

const LoadingComponent = ({ className, ...props }) => {
  return <div className={classNames(styles.loader, className)} {...props} />;
};

export default LoadingComponent;
