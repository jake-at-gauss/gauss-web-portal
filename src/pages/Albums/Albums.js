import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { IoIosAlbums, IoMdSearch } from "react-icons/io";

// Components
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import regStyles from "../../styles/constants";
import AlbumsGrid from "./AlbumsGrid";

// Styles
import styles from "./albums.css";

// MOCKDATA: rm mock data
import albums from "./mockAlbums";

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

const Albums = ({}) => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  }, [filter]);

  return (
    <div className={styles.container}>
      <h2 style={{ display: "flex" }}>
        <IoIosAlbums />
        <span style={{ marginLeft: 8 }}>Albums</span>
      </h2>
      <Column
        style={{
          background: regStyles.white,
          borderRadius: 4,
          boxShadow: "2px 2px 4px 0px rgba(50, 50, 50, 0.4)",
          padding: "32px 64px",
        }}
      >
        <SearchBar
          style={{ alignSelf: "start", width: 300 }}
          onInput={(e) => setFilter(e.target.value)}
        />
        <AlbumsGrid albums={albums} loading={loading} filter={filter} />
      </Column>
    </div>
  );
};

export default Albums;
