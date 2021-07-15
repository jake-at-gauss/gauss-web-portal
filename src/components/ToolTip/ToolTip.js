import React from "react";

import styles from "./ToolTip.css";

const ToolTip = ({ children, tooltip, tooltipStyles, containerStyles }) => {
  return (
    <div className={styles.tooltipContainer} style={{ ...containerStyles }}>
      <div className={styles.tooltip} style={{ ...tooltipStyles }}>
        {tooltip}
      </div>
      {children}
    </div>
  );
};

export default ToolTip;
