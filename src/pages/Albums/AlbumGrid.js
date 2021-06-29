import moment from "moment";
import React from "react";

// Components
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { VIEW_PHOTO_MODAL } from "../../components/ModalContainer/ModalConstants";
import { useModalService } from "../../components/ModalContainer/ModalService";
import regStyles from "../../styles/constants";

// Styles
import styles from "./albums.css";

const attributes = [
  {
    text: "",
    accessor: "pictures",
    width: 40,
    Component: (picture) => (
      <img
        style={{
          height: 40,
          width: 40,
          borderRadius: "50%",
          objectFit: "cover",
        }}
        alt=""
        src={picture.src}
      />
    ),
  },
  {
    text: "Name",
    accessor: "name",
    width: 125,
    Component: ({ name }) => (
      <Column>
        <span style={{ fontWeight: "bold", color: regStyles.gray95 }}>
          {name}
        </span>
      </Column>
    ),
  },
  {
    text: "Number of Annotations",
    accessor: "",
    width: 125,
    Component: ({ index }) => (
      <span>{index === 0 ? 2 : Math.round(Math.random() * 5)}</span>
    ),
  },
  {
    text: "Last Modified",
    accessor: "lastModified",
    width: 100,
    Component: ({ name = "", lastModified = "" }) => {
      return <span>{moment().fromNow()}</span>;
    },
  },
  {
    text: "Modified By",
    accessor: "",
    width: 60,
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
          key={text}
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

const PictureEntry = ({ picture, index, albumName }) => {
  const [, { openModal }] = useModalService();

  return (
    <UnstyledButton
      className={styles.previewContainer}
      onClick={() =>
        openModal(VIEW_PHOTO_MODAL, {
          image: {
            src: picture.src,
            name: picture.name,
          },
        })
      }
    >
      {attributes.map(({ accessor, width, Component }, i) => {
        return (
          <div key={i} style={{ display: "flex", flex: width }}>
            {!!Component ? (
              Component({ ...picture, index })
            ) : (
              <span>{picture[accessor]}</span>
            )}
          </div>
        );
      })}
    </UnstyledButton>
  );
};

const AlbumGrid = ({
  albumName,
  pictures = [],
  loading,
  filter = "",
  style,
}) => {
  return (
    <Column style={style}>
      <GridHeader />
      {loading &&
        pictures
          .slice(0, 5)
          .map(() => (
            <LoadingComponent style={{ height: 60, width: 800, margin: 4 }} />
          ))}
      {!loading &&
        pictures
          .filter(
            (album) =>
              !filter || albumName.toLowerCase().includes(filter.toLowerCase())
          )
          .map((picture, i) => (
            <PictureEntry
              key={i}
              picture={picture}
              albumName={albumName}
              index={i}
            />
          ))}
    </Column>
  );
};

export default AlbumGrid;
