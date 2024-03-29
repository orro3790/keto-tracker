import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { alertModal } from '../../redux/alert-modal/alert-modal.selectors';
import { signOut } from '../../firebase/firebase.utils';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import * as AlertModalTypes from '../../redux/alert-modal/alert-modal.types';
import { RootState } from '../../redux/root-reducer';
import { MdNotificationsActive, MdCheck, MdErrorOutline } from 'react-icons/md';
import { FiCheckCircle } from 'react-icons/fi';
import { GiLetterBomb, GiAchievement } from 'react-icons/gi';
import './alert-modal.styles.scss';

type PropsFromParent = {
  fadeClass: 'zero-opacity' | 'full-opacity';
};

type Props = PropsFromRedux & PropsFromParent;

const AlertModal = ({ alertModal, toggleAlertModal, fadeClass }: Props) => {
  let icon: any;

  switch (alertModal.icon) {
    case 'email':
      icon = <GiLetterBomb className='alert-email' />;
      break;
    case 'update':
      icon = <FiCheckCircle className='alert-success' />;
      break;
    case 'error':
      icon = <MdErrorOutline className='alert-error' />;
      break;
    case 'goal-reached':
      icon = <GiAchievement className='alert-goal-reached' />;
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
          icon: '',
          status: 'visible',
          callback: '',
          sticky: false,
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
    <div className={`alert-c ${fadeClass}`}>
      <div className='alert-t'>
        {alertModal.title}
        <div>
          <MdNotificationsActive className='bell-i' />
        </div>
      </div>
      <div className='alert-msg'>{alertModal.msg}</div>
      <div className='alert-icon-c'>{icon}</div>
      <div className='alert-btn-s'>{btn}</div>
    </div>
  );
};

interface Selectors {
  alertModal: AlertModalTypes.Modal;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  alertModal: alertModal,
});

const mapDispatchToProps = (
  dispatch: Dispatch<AlertModalTypes.ToggleAlertModal>
) => ({
  toggleAlertModal: (object: AlertModalTypes.Modal) =>
    dispatch(toggleAlertModal(object)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AlertModal);
