import classNames from "classnames";
import React from "react";
import Column from "../components/Layout/Column";

import pageWrapperStyles from "./pageWrapperStyles.css";

const withPageWrapper =
  (Component, { Icon, styles = {}, title } = {}) =>
  ({}) => {
    return (
      <div
        className={classNames(pageWrapperStyles.container, styles.container)}
      >
        <h2 style={{ display: "flex" }}>
          {!!Icon && <Icon />}
          <span style={{ marginLeft: 8 }}>{title}</span>
        </h2>
        <Column
          className={classNames(
            pageWrapperStyles.componentContainer,
            styles.componentContainer
          )}
        >
          <Component />
        </Column>
      </div>
    );
  };

export default withPageWrapper;
