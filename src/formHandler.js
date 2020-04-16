import { useState } from 'react';

export default function FormHandler(FIELDS) {
  // remember to pass form fields into this function after importing it!
  const [fields, setFields] = useState(FIELDS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const property = 'value';
    const updatedField = { ...fields[name] };
    updatedField[property] = value;

    setFields({
      ...fields,
      [name]: updatedField,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // prevent multiple form submissions
    setIsSubmitting(true);
    // simuluate processing, reset isSubmitting after 2 sec
    setTimeout(() => {
      console.log(fields);
      setIsSubmitting(false);
    }, 1000);
  };

  return {
    fields,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
