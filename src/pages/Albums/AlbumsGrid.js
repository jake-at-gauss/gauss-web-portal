import moment from "moment";
import React from "react";

// Components
import { Link } from "react-router-dom";
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import regStyles from "../../styles/constants";

// Styles
import styles from "./albums.css";

const attributes = [
  {
    text: "",
    accessor: "pictures",
    width: 20,
    Component: ({ pictures }) => (
      <img
        style={{
          height: 40,
          width: 40,
          borderRadius: "50%",
          objectFit: "cover",
        }}
        alt=""
        src={pictures[0] && pictures[0].src}
      />
    ),
  },
  {
    text: "Name",
    accessor: "name",
    width: 200,
    Component: ({ name, pictures }) => (
      <Column>
        <span style={{ fontWeight: "bold", color: regStyles.gray95 }}>
          {name}
        </span>
        <span style={{ fontSize: 12, fontStyle: "italic" }}>
          {pictures.length} image{pictures.length === 1 ? "" : "s"}
        </span>
      </Column>
    ),
  },
  {
    text: "Last Modified",
    accessor: "lastModified",
    width: 100,
    Component: ({ name, lastModified }) => {
      return (
        <span>
          {moment(name !== "Fruit" ? lastModified * 1000 : undefined).fromNow()}
        </span>
      );
    },
  },
  {
    text: "Modified By",
    accessor: "",
    width: 100,
    Component: ({}) => {
      return (
        <Row
          className={styles.hoverable}
          align
          justify
          style={{
            color: regStyles.white,
            background: regStyles.base,
            borderRadius: "50%",
            margin: 8,
            height: 30,
            width: 30,
          }}
        >
          JZ
          <span className={styles.tooltip}>Jake Zegil</span>
        </Row>
      );
    },
  },
];

const GridHeader = ({}) => {
  return (
    <Row style={{ marginTop: 32 }}>
      {attributes.map(({ text, width }) => (
        <div
          style={{
            display: "flex",
            color: "#09231095",
            fontWeight: "bold",
            flex: width,
          }}
        >
          <span>{text}</span>
        </div>
      ))}
    </Row>
  );
};

const AlbumEntry = ({ album }) => {
  return (
    <Link
      className={styles.previewContainer}
      to={`/app/albums/${album.name.toLowerCase()}`}
    >
      {attributes.map(({ accessor, width, Component }) => (
        <div style={{ display: "flex", flex: width }}>
          {!!Component ? Component(album) : <span>{album[accessor]}</span>}
        </div>
      ))}
    </Link>
  );
};

const AlbumsGrid = ({ albums, loading, filter }) => {
  return (
    <Column>
      <GridHeader />
      {loading &&
        albums.map(() => (
          <LoadingComponent style={{ height: 60, width: "100%", margin: 4 }} />
        ))}
      {!loading &&
        albums
          .filter(
            (album) =>
              !filter || album.name.toLowerCase().includes(filter.toLowerCase())
          )
          .map((album, i) => <AlbumEntry album={album} />)}
    </Column>
  );
};

export default AlbumsGrid;
