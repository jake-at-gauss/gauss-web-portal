import { isEmpty } from "lodash";
import React from "react";
import regStyles from "../../../styles/constants";
import { UnstyledButton } from "../../Button/UnstyledButton";

// Components
import CloseIcon from "../../CloseIcon/CloseIcon";
import Column from "../../Layout/Column";
import Row from "../../Layout/Row";

// Styles
import genericStyles from "../ModalStyles.css";

const GenericMessageModal = ({ config, closeModal }) => {
  return (
    <div className={genericStyles.overlay}>
      <Column
        align
        className={genericStyles.wrapper}
        style={{ height: "fit-content", width: "30vw" }}
      >
        <Row
          align
          style={{ justifyContent: "space-between", borderBottom: "1px ridge" }}
        >
          {config.title && <h2>{config.title}</h2>}
          <CloseIcon
            style={{ right: 0, position: "absolute" }}
            close={closeModal}
          />
        </Row>
        {config.text && (
          <span style={{ display: "block", marginTop: 32 }}>{config.text}</span>
        )}
        {!isEmpty(config.blocks) &&
          config.blocks.map(({ style, text }) => (
            <span style={{ display: "block", marginTop: 32, ...style }}>
              {text}
            </span>
          ))}
        {config.hideButton || (
          <UnstyledButton
            onClick={closeModal}
            style={{
              color: regStyles.white,
              backgroundColor: regStyles.base,
              height: 32,
              width: 200,
              borderRadius: 4,
              marginTop: 32,
            }}
          >
            {config.buttonText || "OK"}
          </UnstyledButton>
        )}
      </Column>
    </div>
  );
};

export default GenericMessageModal;
