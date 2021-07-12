import React, { Component } from "react";
import PropTypes from "prop-types";
import { PROMPT_BUTTON_MODAL } from "../../components/ModalContainer/ModalConstants";

import buttonClassStyles from "./PromptButton.css";
import regStyles from "../../styles/constants";
import { useModalService } from "../ModalContainer/ModalService";

// Custom Hooks

const PromptButton = ({
  shouldPrompt,
  buttonStyles,
  modalConfig,
  childStyles,
  className,
  children,
  disabled,
  onClick,
  loading,
  color,
  text,
}) => {
  const [_, { openModal }] = useModalService();

  const handlePromptClick = () => {
    openModal(PROMPT_BUTTON_MODAL, modalConfig);
  };

  const handleClick = (e) => {
    shouldPrompt ? handlePromptClick() : onClick && onClick(e);
  };

  const renderDefaultChild = () => {
    const defaultStyles = {
      display: "flex",
      backgroundColor: color || regStyles.base,
      color: regStyles.white,
      height: 40,
      width: 200,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    };

    return <span style={{ ...defaultStyles, ...childStyles }}>{text}</span>;
  };

  const renderChildren = () => {
    if (text) {
      return renderDefaultChild();
    }
    return children;
  };

  return (
    <button
      disabled={loading || disabled}
      onClick={handleClick}
      style={{ opacity: disabled ? 0.5 : 1, ...buttonStyles }}
      className={`${buttonClassStyles.defaultStyles} ${className}`}
    >
      {loading ? <div className="pseudo-loader" /> : renderChildren()}
    </button>
  );
};

PromptButton.propTypes = {
  buttonStyles: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  shouldPrompt: PropTypes.bool,
  loading: PropTypes.bool,
  modalConfig: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    image: PropTypes.string,
    approveButton: PropTypes.shape({
      text: PropTypes.string,
      onClick: PropTypes,
      style: PropTypes.object,
    }),
    rejectButton: PropTypes.shape({
      text: PropTypes.string,
      onClick: PropTypes,
      style: PropTypes.object,
    }),
  }),
  text: PropTypes.string,
  color: PropTypes.string,
  childStyles: PropTypes.object,
};

export default PromptButton;
