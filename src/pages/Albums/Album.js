import React, { useEffect, useState } from "react";
import { IoIosAlbums } from "react-icons/io";
import { useParams } from "react-router";
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { VIEW_PHOTO_MODAL } from "../../components/ModalContainer/ModalConstants";
import { useModalService } from "../../components/ModalContainer/ModalService";
import regStyles from "../../styles/constants";
import AlbumGrid from "./AlbumGrid";
import styles from "./albums.css";
import albums from "./mockAlbums";

const Album = ({}) => {
  const { albumId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => setTimeout(() => setLoading(false), 400), []);

  // TODO: fetch album data via id
  const album = albums.find(({ name }) => name.toLowerCase() === albumId) || {};

  return (
    <div className={styles.container}>
      <h2 style={{ display: "flex" }}>
        <IoIosAlbums />
        <span style={{ marginLeft: 8 }}>{album.name}</span>
      </h2>
      <Row
        style={{
          background: regStyles.white,
          borderRadius: 4,
          boxShadow: "2px 2px 4px 0px rgba(50, 50, 50, 0.4)",
          padding: "32px 64px",
          overflow: "auto",
          height: "76%",
        }}
      >
        <AlbumGrid
          albumName={album.name}
          filter=""
          pictures={album.pictures}
          loading={loading}
          style={{ flex: 1, marginRight: 32 }}
        />
        {loading && <LoadingComponent className={styles.albumInfoLoading} />}
        {!loading && (
          <Column className={styles.albumInfo}>
            <h2>Album Info</h2>
            <Column style={{ marginTop: 16 }}>
              <span>Images: {album.pictures.length}</span>
              <span style={{ marginTop: 8 }}>
                Annotated Images: {album.pictures.length}
              </span>
              <span style={{ marginTop: 8 }}>Album Name: {album.name}</span>
            </Column>
            <UnstyledButton className={styles.exportButton}>
              Export Album to CSV
            </UnstyledButton>
          </Column>
        )}
      </Row>
    </div>
  );
};

export default Album;
