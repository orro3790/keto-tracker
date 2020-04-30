import React, { useState, useEffect } from 'react';
import './search-food-modal.styles.scss';
import { connect } from 'react-redux';
import Search from './../search/search.component';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { ToggleSuggestionWindow } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { Doughnut } from 'react-chartjs-2';

const SearchFoodModal = ({
  toggleSearchModal,
  foodItemToAdd,
  ToggleSuggestionWindow,
}) => {
  const [chartData, setChartData] = useState({});

  const handleClose = () => {
    toggleSearchModal({
      status: 'hidden',
      meal: 'none',
    });
  };

  const macrosPer = [
    foodItemToAdd.fatsPer,
    foodItemToAdd.carbsPer,
    foodItemToAdd.proteinPer,
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
  };

  useEffect(() => {
    const chart = () => {
      setChartData({
        labels: ['fats', 'carbs', 'protein'],
        datasets: [
          {
            label: 'macro ratios',
            data: macrosPer,
            backgroundColor: [
              'rgba(255, 147, 64, 1)',
              'rgba(227, 28, 116, 1)',
              'rgba(64, 168, 255, 1)',
            ],
            borderWidth: 4,
            borderColor: '#434250',
          },
        ],
      });
    };
    chart();
  }, [foodItemToAdd]);

  return (
    <div>
      <div className='search-food-modal'>
        <span className='close-search-modal-btn'>
          <i className='fas fa-times' onClick={handleClose}></i>
        </span>
        <div className='search-section'>
          <Search />
        </div>
        <div className='results-container'>
          <div className='name'>{foodItemToAdd.name}</div>
          <div className='description'>{foodItemToAdd.description}</div>

          <div className='portion-input-row'>
            <div></div>
            <div>
              <input
                className='portion-input'
                type='number'
                placeholder={foodItemToAdd.unit}
              ></input>
            </div>
            <div></div>
          </div>
          <div className='macro-row'>
            <div className='fats'>
              <div className='fats'>{foodItemToAdd.fats}g</div>
              <div className='label'>fats</div>
            </div>
            <div className='carbs'>
              <div>{foodItemToAdd.carbs}g</div>
              <div className='label'>carbs</div>
            </div>
            <div className='protein'>
              <div>{foodItemToAdd.protein}g</div>
              <div className='label'>protein</div>
            </div>
          </div>
          <div className='graph-area'>
            <Doughnut data={chartData} options={options} />
          </div>
          {/* 
          <div>{foodItemToAdd.calories}</div> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foodItemToAdd: state.searchItemSuggestion.foodItemToAdd,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodModal);
