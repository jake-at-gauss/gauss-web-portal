import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { UnstyledButton } from "../Button/UnstyledButton";

import styles from "./CloseIcon.css";

const CloseIcon = ({ size, close, ...props }) => {
  return (
    <UnstyledButton className={styles.close} {...props} onClick={close}>
      <RiCloseLine size={size} />
    </UnstyledButton>
  );
};

export default CloseIcon;
