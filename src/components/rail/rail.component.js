import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { signOut } from '../../firebase/firebase.utils';
import ConfirmationModal from '../confirmation-modal/confirmation-modal.component';
import './rail.styles.scss';

const Rail = ({ currentUser }) => {
  const [confirmationMsg, setConfirmationMsg] = useState('');
  const [modalStatus, setModalStatus] = useState('');

  let location = useLocation();

  let styles = {
    logo: 'logo',
    diary: 'fas fa-book',
    exercise: 'fas fa-dumbbell',
    metrics: 'far fa-chart-bar',
    settings: 'fas fa-cog',
    signin: 'fas fa-sign-in-alt',
    signout: 'fas fa-sign-out-alt',
  };

  // illuminate icon based on where the user is within the app
  switch (location.pathname) {
    case '/':
      styles.logo = 'logo';
      break;
    case '/diary':
      styles.diary = 'fas fa-book enabled';
      break;
    case '/exercises':
      styles.exercise = 'fas fa-dumbbell enabled';
      break;
    case '/metrics':
      styles.metrics = 'far fa-chart-bar enabled';
      break;
    case '/settings':
      styles.settings = 'fas fa-cog enabled';
      break;
    default:
      break;
  }

  const handleClose = () => {
    setModalStatus(null);
  };

  const handleSignOut = () => {
    // double check that user wants to sign out
    setConfirmationMsg({
      question: 'Are you sure you want to sign out?',
    });
    setModalStatus('visible');
  };

  const confirmSignOut = () => {
    signOut();
    setConfirmationMsg({
      success: 'You are now logged out.',
    });
  };

  let confirmationModal;

  let onConfirm;

  if (confirmationMsg.question) {
    // first click triggers the signout confirmation modal
    onConfirm = confirmSignOut;
  } else if (confirmationMsg.success) {
    // if signed out, the handleClose function is reassigned to onConfirm
    onConfirm = handleClose;
  }

  if (modalStatus === 'visible') {
    confirmationModal = (
      <ConfirmationModal
        messageObj={confirmationMsg}
        handleClose={handleClose}
        onConfirm={onConfirm}
      />
    );
  } else {
    confirmationModal = null;
  }

  let signInSignOut;
  let signInSignOutIcon;

  if (currentUser === null) {
    signInSignOut = '/signin';
    signInSignOutIcon = <i className={styles.signin}></i>;
  } else {
    signInSignOut = '/';
    signInSignOutIcon = (
      <i className={styles.signout} onClick={handleSignOut}></i>
    );
  }

  return (
    <div>
      {confirmationModal}
      <div className='rail-outer-container'>
        <Link to='/'>
          <div className={styles.logo}>K</div>
        </Link>
        <div>
          <Link to='/diary'>
            <i className={styles.diary}></i>
          </Link>
        </div>
        <div>
          <Link to='/exercises'>
            <i className={styles.exercise}></i>
          </Link>
        </div>
        <div>
          <Link to='/metrics'>
            <i className={styles.metrics}></i>
          </Link>
        </div>
        <div>
          <Link to='/settings'>
            <i className={styles.settings}></i>
          </Link>
        </div>
        <div>
          <Link to={signInSignOut}>{signInSignOutIcon}</Link>
        </div>
        <div className='empty'></div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Rail);
