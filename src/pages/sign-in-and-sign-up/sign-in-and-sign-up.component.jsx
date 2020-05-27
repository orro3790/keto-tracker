import React from 'react';

import SignIn from '../../components/sign-in/sign-in.component';
import SignUp from '../../components/sign-up/sign-up.component';

import './sign-in-and-sign-up.styles.scss';

const SignInAndSignUpPage = () => (
  <div className='sign-in-c'>
    <div className='left-c'>
      <div></div>
      <div></div>
    </div>
    <div className='right-c'>
      <div className='already-btn'>Already a Member? Sign In</div>
      <div className='inner-c'>
        <div className='top-r'>
          <div></div>
          <SignIn />
          <div></div>
        </div>
        <div className='bottom-r'>
          <div></div>
          <SignUp />
          <div></div>
        </div>
      </div>
    </div>
  </div>
);

export default SignInAndSignUpPage;
