import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import {
  GiWhiteBook,
  GiHeartBeats,
  GiExitDoor,
  GiEntryDoor,
  GiHistogram,
} from 'react-icons/gi';
import { MdNotifications, MdSettings } from 'react-icons/md';
import './rail.styles.scss';

const Rail = ({ toggleAlertModal }) => {
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
    // double check that user wants to sign out
    // setConfirmationMsg({
    //   question: 'Are you sure you want to sign out?',
    // });
    // setModalStatus('visible');
    toggleAlertModal({
      title: 'SIGN OUT',
      msg: 'Are you sure you want to sign out?',
      img: 'confirm',
      status: 'visible',
      callback: 'signOut',
    });
  };

  let icon = <GiExitDoor className={styles.signin} />;
  let signInSignOut = <Link to='/signin'>{icon}</Link>;

  icon = <GiEntryDoor className={styles.signout} onClick={handleSignOut} />;
  signInSignOut = <div>{icon}</div>;

  return (
    <div>
      <div className='rail-c hidden'>
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

const mapDispatchToProps = (dispatch) => ({
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
  //add a confirmation modal
});

export default connect(null, mapDispatchToProps)(Rail);
