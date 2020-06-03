import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectAlertModal } from '../../redux/alert-modal/alert-modal.selectors';
import { signOut } from '../../firebase/firebase.utils';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { MdNotificationsActive, MdCheck, MdErrorOutline } from 'react-icons/md';
import { FiCheckCircle } from 'react-icons/fi';
import { GiLetterBomb, GiAchievement } from 'react-icons/gi';

import './alert-modal.styles.scss';

const AlertModal = ({ alertModal, enabled, toggleAlertModal }) => {
  let img;
  switch (alertModal.img) {
    case 'email':
      img = <GiLetterBomb className='alert-email' />;
      break;
    case 'update':
      img = <FiCheckCircle className='alert-success' />;
      break;
    case 'error':
      img = <MdErrorOutline className='alert-error' />;
      break;
    case 'goal-reached':
      img = <GiAchievement className='alert-goal-reached' />;
      break;
    default:
      break;
  }

  let callback;

  switch (alertModal.callback) {
    case 'signOut':
      const signOutAndNotify = () => {
        signOut();
        toggleAlertModal({
          title: 'SUCCESS!',
          msg: 'You are now signed out.',
          img: '',
          status: 'visible',
          callback: '',
        });
      };
      callback = signOutAndNotify;
      break;
    default:
      break;
  }

  let btn;
  switch (alertModal.callback) {
    case 'signOut':
      btn = (
        <div className='submit-r'>
          <div></div>
          <div className='submit-btn on' onClick={callback}>
            <MdCheck className='add-i' />
          </div>
          <div></div>
        </div>
      );
      break;
    default:
      break;
  }

  return (
    <div className={`alert-c ${enabled}`}>
      <div className='alert-t'>
        {alertModal.title}
        <div>
          <MdNotificationsActive className='bell-i' />
        </div>
      </div>
      <div className='alert-msg'>{alertModal.msg}</div>
      <div className='alert-img-c'>{img}</div>
      <div className='alert-btn-s'>{btn}</div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  // createdFoods is only used here to check the state after adding an item. It's not really necessary
  // currentUser: selectCurrentUser,
  alertModal: selectAlertModal,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
  //add a confirmation modal
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertModal);
