import React from "react";
import PropTypes from "prop-types";

const Row = ({
  children,
  style,
  justify,
  align,
  className,
  wrap,
  ...props
}) => (
  <div
    className={className}
    style={{
      display: "flex",
      ...(justify && { justifyContent: "center" }),
      ...(align && { alignItems: "center" }),
      ...(wrap && { flexWrap: "wrap" }),
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

Row.defaultProps = {
  style: {},
  justify: false,
  align: false,
};

export default Row;
