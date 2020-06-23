import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import {
  GiWhiteBook,
  GiHeartBeats,
  GiExitDoor,
  GiEntryDoor,
  GiHistogram,
} from 'react-icons/gi';
import { MdNotifications, MdSettings } from 'react-icons/md';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import * as AlertModalTypes from '../../redux/alert-modal/alert-modal.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { User } from '../../redux/user/user.types';
import { RootState } from '../../redux/root-reducer';
import './rail.styles.scss';

type Props = PropsFromRedux;

const Rail = ({ toggleAlertModal, currentUser }: Props) => {
  let location = useLocation();

  let styles = {
    logo: 'logo',
    diary: 'fas fa-book',
    exercise: 'fas fa-dumbbell',
    metrics: 'far fa-chart-bar',
    settings: 'fas fa-cog',
    signin: 'fas fa-sign-in-alt signin',
    signout: 'fas fa-sign-out-alt',
  };

  // illuminate icon based on where the user is within the app
  switch (location.pathname) {
    case '/':
      styles.logo = 'logo';
      break;
    case '/diary':
      styles.diary = 'fas fa-book on';
      break;
    case '/exercises':
      styles.exercise = 'fas fa-dumbbell on';
      break;
    case '/metrics':
      styles.metrics = 'far fa-chart-bar on';
      break;
    case '/settings':
      styles.settings = 'fas fa-cog on';
      break;
    default:
      break;
  }

  const handleSignOut = () => {
    toggleAlertModal({
      title: 'SIGN OUT',
      msg: 'Are you sure you want to sign out?',
      img: 'confirm',
      status: 'visible',
      callback: 'signOut',
      sticky: false,
    });
  };

  let icon = <GiExitDoor className={styles.signin} />;
  let signInSignOut = <Link to='/signin'>{icon}</Link>;

  if (currentUser) {
    icon = <GiEntryDoor className={styles.signout} onClick={handleSignOut} />;
    signInSignOut = <div>{icon}</div>;
  }

  return (
    <div>
      <div className='rail-c'>
        <Link to='/'>
          <div className={styles.logo}>K</div>
        </Link>
        <div>
          <Link to='/diary'>
            <GiWhiteBook className={styles.diary} />
          </Link>
        </div>
        <div>
          <Link to='/exercises'>
            <GiHeartBeats className={styles.exercise} />
          </Link>
        </div>
        <div>
          <Link to='/metrics'>
            <GiHistogram className={styles.metrics} />
          </Link>
        </div>
        <div>
          <Link to='/settings'>
            <MdSettings className={styles.settings} />
          </Link>
        </div>
        <div>{signInSignOut}</div>
        <div className='empty'>
          <MdNotifications />
        </div>
      </div>
    </div>
  );
};

interface Selectors {
  currentUser: User | null;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (
  dispatch: Dispatch<AlertModalTypes.ToggleAlertModal>
) => ({
  toggleAlertModal: (object: AlertModalTypes.AlertModal) =>
    dispatch(toggleAlertModal(object)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Rail);
