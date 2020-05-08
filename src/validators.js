// These validators are used for single-field validations only. Return values can be combined to create meta-level validations within the component.

export const requiredValidation = (field, value) => {
  return {
    isValid: !!value && value !== '',
    message: `"${field}" is a required field.`,
  };
};

export const minimumLengthValidation = (minimum) => {
  return (field, value) => {
    return {
      isValid: value.length >= minimum,
      message: `${field} must be at least ${minimum} characters`,
    };
  };
};

export const under100 = (field, value) => {
  return {
    isValid: value <= 100,
    message: `${field} percentage cannot be greater than 100`,
  };
};

// export const under100 = (field, value) => {
//   return {
//     isValid: value <= 100,
//     message: `${field} percentage cannot be greater than 100`,
//   };
// };
