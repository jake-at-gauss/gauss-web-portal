import React, { Component } from "react";

//Component
import ReactModalWrapper from "../ReactModalWrapper";
import Column from "../../Layout/Column";
import Row from "../../Layout/Row";
import LineButton from "../../LineButton/LineButton";

//Styles
import styles from "./PromptButtonModal.css";
import regStyles from "../../../styles/constants";

// Default Props
const defaultContentConfig = {
  title: "Almost There...",
  image: "assets/images/projects/almost-there@2x.png",
  subtitle: "You must complete all the sections of this step to move forward.",
};
const defaultApproveButton = {
  text: "Yes",
  onClick: () => {},
  style: null,
};

const defaultRejectButton = {
  text: "No",
  onClick: () => {},
  style: null,
};

const gutter = 8;
const doubleGutter = gutter * 2;

const getPropsWithDefaults = (config) => {
  const contentConfig = {
    ...defaultContentConfig,
    ...config,
  };

  const approveButton = {
    ...defaultApproveButton,
    ...config.approveButton,
  };

  const rejectButton = {
    ...defaultRejectButton,
    ...config.rejectButton,
  };

  //Warn RE: important props
  if (!config.title) {
    console.warn("Prop Missing: Prompt Button Title");
  }
  if (!config.subtitle) {
    console.warn("Prop Missing: Prompt Button Subtitle");
  }
  if (!(config.approveButton || {}).onClick) {
    console.warn("Prop Missing: Approve Button onClick for Prompt Button");
  }

  return {
    ...contentConfig,
    approveButton,
    rejectButton,
    noReject: !!config.noReject,
  };
};

export default class PromptButtonModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCheckboxChecked: false,
    };
  }

  handleConfirm = () => {
    const { config, closeModal } = this.props;
    const { approveButton } = getPropsWithDefaults(config);
    approveButton.onClick();
    closeModal();
  };

  handleReject = () => {
    const { config, closeModal } = this.props;
    const { rejectButton } = getPropsWithDefaults(config);
    rejectButton.onClick();
    closeModal();
  };

  render() {
    const { modalIsOpen, config, closeModal } = this.props;
    const { isCheckboxChecked } = this.state;
    const {
      title,
      subtitle,
      image,
      approveButton,
      rejectButton,
      noReject,
      imageOption = {},
      contentRender,
      subtitleStyle,
    } = getPropsWithDefaults(config);
    const approveDisabled = !!config.checkbox && !isCheckboxChecked;
    return (
      <ReactModalWrapper
        modalIsOpen
        closeModal={closeModal}
        headerStyles={{
          height: 32,
          marginTop: 32,
          fontWeight: "bold",
          fontSize: 24,
          paddingTop: gutter,
          paddingRight: 48,
          paddingLeft: 48,
        }}
        headerClassName={styles.modalHeader}
        title={title}
        showCloseOnRight
        shouldCloseOnOverlayClick
        isWhite
        className={styles.defaultStyles}
        overlayClassName={styles.containerOverlay}
      >
        <Column align style={{ padding: doubleGutter }}>
          <div
            style={{
              marginTop: doubleGutter,
              marginBottom: doubleGutter,
              fontSize: 16,
              lineHeight: "16px",
              color: regStyles.gray5,
              textAlign: "center",
              ...subtitleStyle,
            }}
          >
            <span
              style={{
                fontSize: 16,
                lineHeight: "normal",
                color: regStyles.gray80,
                whiteSpace: "pre-line",
              }}
            >
              {subtitle}
            </span>
          </div>
          {contentRender &&
            typeof contentRender === "function" &&
            contentRender()}
          <Row style={{ width: "100%" }}>
            {!noReject && (
              <LineButton
                style={rejectButton.style}
                borderColor={regStyles.base}
                textColor={regStyles.base}
                text={rejectButton.text}
                onClick={this.handleReject}
              />
            )}
            <LineButton
              style={{
                marginLeft: 4,
                opacity: approveDisabled ? 0.5 : 1,
                ...approveButton.style,
              }}
              backgroundColor={regStyles.base}
              borderColor={regStyles.base}
              textColor={regStyles.white}
              text={approveButton.text}
              onClick={this.handleConfirm}
              disabled={approveDisabled}
            />
          </Row>
        </Column>
      </ReactModalWrapper>
    );
  }
}

PromptButtonModal.defaultProps = {
  config: {
    ...defaultContentConfig,
    approveButton: {
      ...defaultApproveButton,
    },
    rejectButton: {
      ...defaultRejectButton,
    },
  },
};
