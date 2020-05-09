import { useState, useEffect } from 'react';

/*
Handles form validation with custom defined validators which can be assigned to any field. Takes in a fields object and onSubmitDispatcher, adds an errors property to each input field that will store any caught errors. If there are no errors, isSubmittable === true, and the onSubmitDispatcher function will be called. 

  1: import FormHandler from formHandler.js into component that requires validation
  2: import custom validators from validators.js
  3: define FIELDS obj with all the input names as the keys, and the key values as 'value' & 'validations', within component
  4: include any validators you want in an input's validations array, defined and imported from validators.js
  5: define a onSubmitDispatcher function within component that will dipatch the validated fields obj after successful submit
  6: destructure the functions and augmented fields obj from FormHanlder(FIELDS, onSubmitDispatcher) 
    Ex: const {
          fields,
          handleChange,
          handleSubmit,
          isSubmittable,
          isSubmitting,
        } = FormHandler(FIELDS, onSubmitDispatcher);
  7: use handleChange in <input ... value={handleChange}> and include onSubmit={handleSubmit} in the submit btn
  8: isSubmittable and isSubmitting state can be used to stylize form, alerts, or modals within the component
  9: extract errors from the field prop and display them. Ex: fields.email.errors
*/

export default function FormHandler(FIELDS, onSubmitDispatcher) {
  const [fields, setFields] = useState(FIELDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittable, setIsSubmittable] = useState(false);
  const [errors, setErrors] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting === false) {
      setIsSubmitting(true);
      onSubmitDispatcher();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    let newFields = { ...fields };
    newFields[name].value = value;
    newFields = setValidationErrors(newFields);
    setIsSubmittable(!hasErrors(newFields));
    setFields(newFields);
    combinedErrorsArray(fields);
  };

  const combinedErrorsArray = (fields) => {
    const errorsArray = [];
    Object.keys(fields).forEach((field) => {
      if (fields[field].errors.length > 0) {
        fields[field].errors.forEach((error) => errorsArray.push(error));
      }
    });
    setErrors(errorsArray);
  };

  const hasErrors = (fields) => {
    return (
      Object.keys(fields)
        .map((field) => fields[field].errors.length)
        .reduce((acc, errorCount) => acc + errorCount, 0) > 0
    );
  };

  const setValidationErrors = (fields) => {
    Object.keys(fields).forEach((field) => {
      fields[field].errors = errorsForField(field);
    });
    return fields;
  };

  const errorsForField = (field) => {
    return fields[field].validations
      .map((validation) => {
        const { isValid, message } = validation(field, fields[field].value);
        return isValid ? '' : message;
      })
      .filter((value) => value.length > 0);
  };

  useEffect(() => {
    // after a form submit, put a 3 second timeout on subsequent submit attempts
    let preventSubmit;
    if (isSubmitting === true) {
      preventSubmit = setTimeout(() => setIsSubmitting(false), 3000);
      console.log('setting 3 second timeout on submits');
    }

    return () => {
      // cleanup the timeout if a user clicks off the page before the timeout finishes, to prevent memory leaks
      clearTimeout(preventSubmit);
      console.log('cleaning up timeout');
    };
  }, [isSubmitting]);

  // isSubmittable state must be used in within component to enable/disable submit button
  // isSubmitting should also be used within component to create submit request timeouts --> enable/disable submit
  // fields is returned as an augmented version with an errors property containing array of error messages
  // handleChange can be used anywhere there are form inputs needing onChange, just make sure to define FIELDS in component
  // errors (optional export) holds all error messages in one array, which can be useful for bulk display
  return {
    fields,
    handleChange,
    handleSubmit,
    isSubmittable,
    isSubmitting,
    errors,
  };
}
