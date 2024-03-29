import React from 'react';

import './form-input.styles.scss';

// Define the possible props FormInput may receive
type Props = {
  label?: string | JSX.Element;
  className?: string;
  textArea?: boolean;
  handleChange?: any;
  otherProps?: any;
  value: any;
};

const FormInput: React.FC<
  Props & React.InputHTMLAttributes<Props> & React.AreaHTMLAttributes<Props>
> = ({
  handleChange,
  label,
  className,
  textArea,
  value,
  ...otherProps
}: Props) => {
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
      {/* if there's a label, dynamically assign classname that checks if there's a label value and then applies shrink class to it, as long as there is a value present in the input */}
      {label ? (
        <label className={`${value ? 'shrink' : ''} form-in-l`}>{label}</label>
      ) : null}
    </div>
  );
};

export default FormInput;
