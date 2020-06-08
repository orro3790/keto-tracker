import React, { useState, useEffect } from 'react';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { connect } from 'react-redux';
import { auth, createUserDoc } from '../../firebase/firebase.utils';
import './sign-up.styles.scss';

const SignUp = ({ toggleAlertModal }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAlert = () => {
    toggleAlertModal({
      title: 'CONFIRM EMAIL',
      msg:
        "You're almost there! Check your email for a verification link, then you can start tracking!",
      img: 'email',
      status: 'visible',
      sticky: false,
    });
  };

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: 'http://localhost:3000/signin',
    // This must be true.
    handleCodeInApp: true,
  };

  useEffect(() => {
    // Confirm the link is a sign-in with email link.
    if (auth.isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      let storedEmail = window.localStorage.getItem('emailForSignIn');
      let storedDisplayName = window.localStorage.getItem(
        'displayNameForSignIn'
      );

      if (!storedEmail) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        storedEmail = window.prompt(
          'Please provide your email for confirmation'
        );
      }
      if (!storedDisplayName) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        storedDisplayName = window.prompt(
          'Please provide your display name for confirmation'
        );
      }
      auth
        .signInWithEmailLink(storedEmail, window.location.href)
        .then(async function (result) {
          await result.user
            .updateProfile({
              displayName: storedDisplayName,
            })
            .then(createUserDoc(result.user))
            .then(
              window.localStorage.removeItem('emailForSignIn'),
              window.localStorage.removeItem('displayNameForSignIn')
            );
        })
        .catch(function (error) {
          console.log(error.code);
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("passwords don't match");
      return;
    }

    auth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(function () {
        // The link was successfully sent. Inform the user.
        window.localStorage.setItem('emailForSignIn', email);
        window.localStorage.setItem('displayNameForSignIn', displayName);
      })
      .catch(function (error) {
        console.log(error.code);
      });

    handleAlert();
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
          name='displayName'
          value={displayName}
          onChange={handleChange}
          label='Display Name'
          className='sign-up-r'
          required
        />
        <FormInput
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          label='Email'
          className='sign-up-r'
          required
        />
        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          label='Password'
          className='sign-up-r'
          required
        />
        <FormInput
          type='password'
          name='confirmPassword'
          value={confirmPassword}
          onChange={handleChange}
          label='Confirm Password'
          className='sign-up-r'
          required
        />
        <div className='btn'>
          <CustomButton type='submit' className='google-sign-in'>
            SIGN UP
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
  //add a confirmation modal
});

export default connect(null, mapDispatchToProps)(SignUp);
