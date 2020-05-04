import React from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './rail.styles.scss';

const Rail = () => {
  let location = useLocation();

  let styles = {
    logo: 'logo',
    diary: 'fas fa-book',
    exercise: 'fas fa-dumbbell',
    metrics: 'far fa-chart-bar',
    settings: 'fas fa-cog',
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

  return (
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
      <div className='empty'></div>
      <div className='empty'></div>
    </div>
  );
};

export default Rail;
