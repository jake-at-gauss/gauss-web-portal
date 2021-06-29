import React from "react";

// Components
import CloseIcon from "../../CloseIcon/CloseIcon";
import Image from "../../Image/Image";
import Column from "../../Layout/Column";
import Row from "../../Layout/Row";

// images
import { ReactComponent as Logo } from "../../../assets/logo_no_shadow.svg";

// Styles
import styles from "./ViewPhotoModal.css";
import regStyles from "../../../styles/constants";

const mockAnnotations = [
  {
    type: "Classification",
    meta: `{
      label: "apple"
    }`,
  },
  {
    type: "Bounding Box",
    meta: `{
      description: "Label all fruits in the image.",
        width: 176,
        height: 154,
        left: 137,
        top: 71
    }`,
  },
];

const mockBBox = {
  width: 183,
  height: 177,
  left: 478,
  top: 253,
};

const Header = ({ close }) => {
  return (
    <Row className={styles.header} style={{ color: regStyles.gray95 }}>
      <Logo style={{ margin: "0 16px" }} width={30} />
      <Column justify>
        <span style={{ fontSize: 12 }}>Gauss</span>
        <span>Annotation Viewer</span>
      </Column>
      <CloseIcon style={{ marginLeft: "auto" }} close={close} />
    </Row>
  );
};

const ViewPhotoModal = ({ config, closeModal }) => {
  const { image } = config;

  // TODO: API call will fetch image details
  const size = `{ width: 375, height: 280 }`;

  return (
    <Column className={styles.wrapper}>
      <Header close={closeModal} />
      <Row className={styles.content}>
        <Row
          className={styles.imageContainer}
          justify
          align
          style={{ flex: 3, position: "relative" }}
        >
          <Image className={styles.image} src={image.src} />
          <div
            style={{
              ...mockBBox,
              border: `2px solid #092310`,
              position: "absolute",
            }}
          ></div>
        </Row>
        <Column
          style={{
            flex: 1,
            padding: 16,
            borderLeft: "2px solid #09231040",
            color: regStyles.gray95,
          }}
        >
          <h2>{image.name}</h2>
          <span>size: {size}</span>
          <h3>Image Annotations</h3>
          <Column>
            {mockAnnotations.map((ann, i) => (
              <Column key={i} className={styles.annotation}>
                <span>type: {ann.type}</span>
                <span>metadata: {ann.meta}</span>
              </Column>
            ))}
          </Column>
        </Column>
      </Row>
    </Column>
  );
};

export default ViewPhotoModal;
