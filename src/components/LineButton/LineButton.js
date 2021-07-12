import React, { Component } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";

const checkValidKey = (key, validKeys) => {
  if (validKeys) {
    return validKeys.includes(key);
  }
  return key === 32 || key === 13;
};

export default class LineButton extends Component {
  static propTypes = {
    element: PropTypes.string,
    customElement: PropTypes.node,
    onClick: PropTypes.func,

    borderColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    hideBorder: PropTypes.bool,
    loadingColor: PropTypes.string,
    // iconColor: PropTypes.string,
    height: PropTypes.number,

    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    inactive: PropTypes.bool,

    style: PropTypes.object,
    // icon: PropTypes.string,
  };

  static defaultProps = {
    element: "button",
    customElement: undefined,
    onClick: undefined,

    backgroundColor: "transparent",
    // borderColor: colors.borderColor.regular,
    // textColor: colors.text.colordark,
    hideBorder: false,
    loadingColor: undefined,
    // iconColor: undefined,
    height: 40,

    disabled: false,
    loading: false,
    inactive: false,

    // icon: undefined,
  };

  constructor(props) {
    super(props);

    this.onClick = debounce(this.onClick, 250, {
      leading: true,
      trailing: false,
    });
  }

  onKeyPress = (e) => {
    if (checkValidKey(e.keyCode)) {
      this.onClick(e);
    }
  };

  onClick = (e) => {
    const { onClick } = this.props;
    if (!onClick) return;

    onClick(e);
  };

  onMouseUpCapture = (e) => {
    const { onMouseUpCapture } = this.props;
    if (!onMouseUpCapture) return;
    onMouseUpCapture(e);
  };

  onClickCapture = (e) => {
    const { onClickCapture } = this.props;
    if (!onClickCapture) return;
    onClickCapture(e);
  };

  render() {
    const {
      borderColor,
      textColor,
      backgroundColor,
      hideBorder,
      // loadingColor,
      // iconColor,
      style,
      className,
      height,
      element,
      customElement: CustomElement,

      text,
      disabled,
      // icon,
      // inactive,
      // loading,
    } = this.props;

    const ButtonComponent = element;

    const children = text;
    const props = {
      onClick: this.onClick,
      disabled,
      onKeyPress: this.onKeyPress,
      onMouseUpCapture: this.onMouseUpCapture,
      onClickCapture: this.onClickCapture,
      style: {
        cursor: disabled ? "default" : "pointer",
        color: textColor,
        fontSize: 14,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        backgroundColor,
        borderWidth: hideBorder ? 0 : 1,
        borderStyle: "solid",
        borderColor,
        height,
        width: "100%",
        ...style,
      },
      className,
    };

    if (CustomElement) {
      return <CustomElement {...props}>{children}</CustomElement>;
    }

    return <ButtonComponent {...props}>{children}</ButtonComponent>;
  }
}
