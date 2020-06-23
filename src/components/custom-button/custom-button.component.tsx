import React from 'react';

import './custom-button.styles.scss';

const CustomButton = ({ children, className, ...otherProps }: any) => (
  <button className={`${className} custom-button`} {...otherProps}>
    {children}
  </button>
);

export default CustomButton;
