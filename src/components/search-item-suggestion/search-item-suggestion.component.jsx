import React, { useState, useEffect } from 'react';
import './search-item-suggestion.styles.scss';
import { connect } from 'react-redux';
import {
  ToggleAddFoodToDiaryModal,
  ToggleSuggestionWindow,
} from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { Doughnut } from 'react-chartjs-2';

const SearchItemSuggestion = ({
  food,
  ToggleAddFoodToDiaryModal,
  ToggleSuggestionWindow,
}) => {
  const [chartData, setChartData] = useState({});

  const chart = () => {
    setChartData({
      labels: ['fats', 'carbs', 'protein'],
      datasets: [
        {
          label: 'macro ratios',
          data: [food.fats, food.carbs, food.protein],
          backgroundColor: [
            'rgba(255, 147, 64, 1)',
            'rgba(227, 28, 116, 1)',
            'rgba(64, 168, 255, 1)',
          ],
          borderWidth: 4,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
  };

  useEffect(() => {
    chart();
  }, []);

  const handleClick = () => {
    ToggleAddFoodToDiaryModal(food);
    ToggleSuggestionWindow('hide window');
  };

  return (
    <div className='search-item-container' onClick={handleClick}>
      <div className='search-item-add-btn'>
        <i className='fas fa-plus-square'></i>
      </div>
      <div className='search-item-name'>{food.name}</div>
      <div className='search-item-macros'>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.meal.searchModal,
});

const mapDispatchToProps = (dispatch) => ({
  ToggleAddFoodToDiaryModal: (food) =>
    dispatch(ToggleAddFoodToDiaryModal(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchItemSuggestion);
