// if a value exists, it returns true, else return false (this is a double negation trick, NOT NOT something = something --> true! NOT NOT nothing = nothing ---> returns false)
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

// export const totalsEqual100 = ([percentages]) => {
//   return ()
// }
