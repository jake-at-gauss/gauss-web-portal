import React from "react";

// Components
import { IoMdSearch } from "react-icons/io";
import Row from "../Layout/Row";

// Styles
import styles from "./SearchBar.css";

// Utils
import classNames from "classnames";

export const SearchBar = ({
  placeholder = "Search",
  inputStyles,
  inputClassName,
  iconProps,
  onInput,
  onEnter,
  value,
  className,
  disabled,
  ...props
}) => {
  return (
    <Row align {...props} className={classNames(styles.searchbar, className)}>
      <IoMdSearch size={20} {...iconProps} />
      <input
        className={classNames(styles.searchbarInput, inputClassName)}
        style={{ marginLeft: 8, outline: "none", ...inputStyles }}
        placeholder={placeholder}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onEnter && onEnter(e);
          }
        }}
        onInput={onInput}
        value={value}
        disabled={disabled}
      />
    </Row>
  );
};
