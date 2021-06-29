/* eslint-disable no-return-assign */
import React, { Component } from "react";

import classNames from "classnames";
import { UnstyledButton } from "../Button/UnstyledButton";
import { get } from "lodash";
import styles from "./DropdownMenu.css";

export default class DropdownMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.dropdownMenu = null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);

    this.setState({ top: this.calculateOptionsTop() });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (this.dropdownMenu && !this.dropdownMenu.contains(e.target)) {
      e.stopPropagation();
      this.closeDropdown();
    }
  };

  handleDotToggle = (isOpen) => this.setState({ isOpen });

  openDropdown = (e) => {
    const { isOpen } = this.state;
    e.stopPropagation();

    if (!isOpen) {
      this.handleDotToggle(true);
    }
  };

  closeDropdown = () => {
    const { onMenuClose } = this.props;
    const { isOpen } = this.state;

    if (isOpen) {
      this.handleDotToggle(false);

      if (onMenuClose && typeof onMenuClose === "function") {
        onMenuClose();
      }
    }
  };

  toggleDropdown = (e) => {
    e.stopPropagation();
    const { isOpen } = this.state;
    isOpen ? this.closeDropdown() : this.openDropdown(e);
  };

  calculateOptionsTop = () => {
    const target = this.dropdownMenu;

    if (!target) {
      return 0;
    }

    const offset = target.clientHeight ? Number(target.clientHeight) : 0;

    return offset;
  };

  //TODO: add option to render components above and below options
  render() {
    const {
      style,
      children,
      disabled,
      className,
      dropdownOptions,
      dropdownOptionsClassName,
    } = this.props;
    const { isOpen } = this.state;
    return (
      <UnstyledButton
        disabled={disabled}
        noOutline
        buttonRef={(ref) => (this.dropdownMenu = ref)}
        className={classNames(
          styles.dropdownMenu,
          isOpen && "dropdown-menu--open",
          className
        )}
        style={{ ...style, position: "relative" }}
        onClick={this.toggleDropdown}
      >
        {children}
        <div
          className={classNames(
            styles.dropdownMenuOptions,
            isOpen && styles.dropdownMenuOptions__open,
            dropdownOptionsClassName
          )}
          style={{
            top: this.state.top,
          }}
        >
          {dropdownOptions}
        </div>
      </UnstyledButton>
    );
  }
}
