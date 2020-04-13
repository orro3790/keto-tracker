import React from 'react';
import './food-diary.styles.scss';

const Diary = () => {
  return (
    <div className='outer-container'>
      <div className='food-row'>
        <div>food title</div>
        <div>fats</div>
        <div>carbs</div>
        <div>protein</div>
        <div>calories</div>
      </div>
    </div>
  );
};

export default Diary;
