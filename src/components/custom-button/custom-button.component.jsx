import React from 'react';

import './custom-buttom.styles.scss';

// pull the children as props into the CustomButton, so if the button is type='submit', we can access that, as well as any other children values on the button, such as being able to access the handleSubmit function on it
const CustomButton = ({
  children,
  isGoogleSignIn,
  inverted,
  ...otherProps
}) => (
  <button
    className={`${inverted ? 'inverted' : ''} ${
      isGoogleSignIn ? 'google-sign-in' : ''
    } custom-button`}
    {...otherProps}
  >
    {children}
  </button>
);

export default CustomButton;
