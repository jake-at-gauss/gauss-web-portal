import React, { Component } from "react";
import get from "lodash/get";
import PropTypes from "prop-types";

import Modal from "react-modal";

class ReactModalWrapper extends Component {
  constructor(props) {
    super(props);
  }

  preventDefault = (e) => e.preventDefault();

  componentDidMount() {
    if (!this.props.bgScroll && this.props.modalIsOpen) {
      this.scrollLock();
    }
  }

  componentWillUnmount() {
    this.scrollUnlock();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.bgScroll &&
      prevProps.modalIsOpen !== this.props.modalIsOpen
    ) {
      if (this.props.modalIsOpen) {
        this.scrollLock();
      } else {
        this.scrollUnlock();
      }
    }
  }

  scrollLock = () => {
    // $("body").addClass(styles.overflowHidden);
  };

  scrollUnlock = () => {
    // $("body").removeClass(styles.overflowHidden);
  };

  render() {
    const {
      className,
      overlayClassName,
      children,
      title,
      modalIsOpen,
      closeModal,
      isWhite,
      showCloseOnRight,
      headerClassName,
      transitionType,
      headerImage,
      headerStyles,
    } = this.props;

    const derivedHeaderHeight = get(headerImage, "height", 0);

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal Wrapper"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        className={`${className} ReactModalWrapper--${transitionType}`}
        overlayClassName={`${
          overlayClassName || "ReactModalWrapper--overlay"
        } ReactModalWrapper--fadeIn`}
      >
        <div
          className={headerClassName || "ReactModalWrapper-header"}
          style={{
            backgroundColor: isWhite ? "white" : "",
            color: isWhite ? "#464646" : "",
            height: derivedHeaderHeight !== 0 ? derivedHeaderHeight : null,
            ...headerStyles,
          }}
        >
          {headerImage && (
            <img
              src={headerImage.image}
              height={headerImage.height}
              width="100%"
              style={{ position: "absolute" }}
            />
          )}
          {!showCloseOnRight && (
            <span
              onClick={closeModal}
              className="qm-icon-close"
              style={{
                position: "absolute",
                left: 0,
                top: headerImage ? 16 : "",
              }}
            />
          )}
          <h3 style={{ lineHeight: "normal" }}>{title}</h3>
          {showCloseOnRight && (
            <span
              onClick={closeModal}
              className="qm-icon-close gutter-right"
              style={{
                position: "absolute",
                right: 0,
                top: headerImage ? 16 : "",
              }}
            />
          )}
        </div>
        {children}
      </Modal>
    );
  }
}

export default ReactModalWrapper;

ReactModalWrapper.defaultProps = {
  className: "ReactModalWrapper",
  overlayClassName: "ReactModalWrapper--overlay",
  title: "",
  modalIsOpen: false,
  closeModal: null,
  isWhite: false,
  showCloseOnRight: false,
  transitionType: "",
  bgScroll: false,
};

ReactModalWrapper.propTypes = {
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  title: PropTypes.string,
  modalIsOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  isWhite: PropTypes.bool,
  showCloseOnRight: PropTypes.bool,
  headerClassName: PropTypes.string,
  transitionType: PropTypes.string,
  bgScroll: PropTypes.bool,
};
