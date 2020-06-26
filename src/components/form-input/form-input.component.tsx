import React, { InputHTMLAttributes } from 'react';

import './form-input.styles.scss';

// Define the possible props FormInput may receive
type Props = {
  label?: string;
  className?: string;
  textArea?: boolean;
  handleChange?: any;
  otherProps?: any;
};

const FormInput: React.FC<
  Props & React.InputHTMLAttributes<Props> & React.AreaHTMLAttributes<Props>
> = ({ handleChange, label, className, textArea, ...otherProps }: Props) => {
  let renderInput;

  if (textArea) {
    renderInput = (
      <textarea
        className={`form-in ${className}`}
        onChange={handleChange}
        {...otherProps}
      />
    );
  } else {
    renderInput = (
      <input
        className={`form-in ${className}`}
        onChange={handleChange}
        {...otherProps}
      />
    );
  }

  return (
    <div className='group'>
      {renderInput}
      {/* if there's a label, dynamically assign classname that checks if there's a label value and then applies shrink class to it, and form-in-l*/}
      {label ? (
        <label className={`${className ? 'shrink' : ''} form-in-l`}>
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default FormInput;
