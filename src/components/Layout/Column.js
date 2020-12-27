import React from 'react';
import PropTypes from 'prop-types';

const Column = ({
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
      display: 'flex',
      flexDirection: 'column',
      ...(justify && { justifyContent: 'center' }),
      ...(align && { alignItems: 'center' }),
      ...(wrap && { flexWrap: 'wrap' }),
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

Column.defaultProps = {
  style: {},
  justify: false,
  align: false,
};

export default Column;
