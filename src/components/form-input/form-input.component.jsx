import React from 'react';

import './form-input.styles.scss';

const FormInput = ({
  handleChange,
  label,
  className,
  inputType,
  ...otherProps
}) => {
  let renderInput;
  switch (inputType) {
    case 'input':
      renderInput = (
        <input
          className={`form-in ${className}`}
          onChange={handleChange}
          {...otherProps}
        />
      );
      break;
    case 'textarea':
      renderInput = (
        <textarea
          className={`form-in ${className}`}
          onChange={handleChange}
          {...otherProps}
        />
      );
      break;
    default:
      break;
  }

  return (
    <div className='group'>
      {renderInput}
      {/* if there's a label, dynamically assign classname that checks if there's a label value and then applies shrink class to it, and form-in-l*/}
      {label ? (
        <label
          className={`${otherProps.value.length ? 'shrink' : ''} form-in-l`}
        >
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default FormInput;
