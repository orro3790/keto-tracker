import React, { useState, useEffect } from 'react';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';

import './sign-up.styles.scss';

const SignUp = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("passwords don't match");
      return;
    }

    try {
      // the follow method comes from firebase's auth, returns user obj
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // now let's store that user into the database with our createUserProfileDocument then set the state to default values to clear the form
      await createUserProfileDocument(user, { displayName });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    switch (e.target.name) {
      case 'displayName':
        setDisplayName(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className='sign-up-c'>
      {/* <h2 className='t'>I do not have an account.</h2>
      <span>Sign up with your email and password</span> */}
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <FormInput
          type='text'
          inputType='input'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          label='Display Name'
          className='sign-up-r'
          required
        />
        <FormInput
          type='email'
          inputType='input'
          name='email'
          value={email}
          onChange={handleChange}
          label='Email'
          className='sign-up-r'
          required
        />
        <FormInput
          type='password'
          inputType='input'
          name='password'
          value={password}
          onChange={handleChange}
          label='Password'
          className='sign-up-r'
          required
        />
        <FormInput
          type='password'
          inputType='input'
          name='confirmPassword'
          value={confirmPassword}
          onChange={handleChange}
          label='Confirm Password'
          className='sign-up-r'
          required
        />
        <div class='btn'>
          <CustomButton type='submit' className='google-sign-in'>
            SIGN UP
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
