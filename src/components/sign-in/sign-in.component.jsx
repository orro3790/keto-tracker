import React, { useState } from 'react';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';

import './sign-in.styles.scss';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await auth.signInWithEmailAndPassword(email, password);
      // this.setState({ email: '', password: '' });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className='sign-in'>
      <h2>I already have an account</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          name='email'
          inputType='input'
          type='email'
          value={email}
          handleChange={handleChange}
          label='email'
          required
        />
        <FormInput
          name='password'
          inputType='input'
          type='password'
          value={password}
          handleChange={handleChange}
          label='password'
          required
        />
        <div className='buttons'>
          {/* <CustomButton type='submit'> Sign in </CustomButton> */}
          <CustomButton type='button' onClick={signInWithGoogle} isGoogleSignIn>
            Sign in with Google
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
