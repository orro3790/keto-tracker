import React from 'react';
import Rail from '../../components/rail/rail.component';
import './home.styles.scss';

const Home = () => {
  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>
      <div className='page-body-c'>
        <div className='t'>Home Page</div>
      </div>
    </div>
  );
};

export default Home;
