import React from 'react';

import './custom-button.styles.scss';

const CustomButton = ({ children, className, ...otherProps }) => (
  <button className={`${className} custom-button`} {...otherProps}>
    {children}
  </button>
);

export default CustomButton;
