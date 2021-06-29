import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { APP_ALBUMS_PATH } from "../../../constants";
import regStyles from "../../../styles/constants";
import { UnstyledButton } from "../../Button/UnstyledButton";

// Components
import CloseIcon from "../../CloseIcon/CloseIcon";
import Column from "../../Layout/Column";
import Row from "../../Layout/Row";

// Styles
import genericStyles from "../ModalStyles.css";

const UploadSuccessModal = ({ config, closeModal }) => {
  console.log(config);
  return (
    <div className={genericStyles.overlay}>
      <Column
        className={genericStyles.wrapper}
        style={{ height: "fit-content", width: "30vw" }}
      >
        <Row
          align
          style={{ justifyContent: "space-between", borderBottom: "1px ridge" }}
        >
          <h2>Success!</h2>
          <CloseIcon close={closeModal} />
        </Row>
        <span style={{ display: "block", marginTop: 32 }}>
          {config.num} photos have been added to the "{config.album}" album.
        </span>
        <Link
          onClick={closeModal}
          to={`${APP_ALBUMS_PATH}/${config.album.toLowerCase()}`}
          style={{
            display: "flex",
            alignItems: "center",
            color: regStyles.base,
            alignSelf: "flex-end",
            fontWeight: "bold",
            marginTop: 16,
          }}
        >
          Go To Album <IoIosArrowRoundForward size={30} />
        </Link>
        <span style={{ display: "block", marginTop: 32 }}>
          {config.tasks.length} tasks have been initiated.
        </span>
        <Link
          onClick={closeModal}
          to={""}
          style={{
            display: "flex",
            alignItems: "center",
            color: regStyles.base,
            alignSelf: "flex-end",
            fontWeight: "bold",
            marginTop: 16,
          }}
        >
          Manage Tasks <IoIosArrowRoundForward size={30} />
        </Link>
      </Column>
    </div>
  );
};

export default UploadSuccessModal;
