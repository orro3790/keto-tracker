import React, { useState, useEffect } from 'react';
import './search-food-modal.styles.scss';
import { connect } from 'react-redux';
import Search from './../search/search.component';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { ToggleSuggestionWindow } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { Bar } from 'react-chartjs-2';

const SearchFoodModal = ({
  toggleSearchModal,
  foodReference,
  ToggleSuggestionWindow,
  suggestionWindow,
}) => {
  const [chartData, setChartData] = useState({});
  const [sizeInput, setSizeInput] = useState('');
  const [foodToAdd, setFoodToAdd] = useState({});

  const handleChange = (e) => {
    setSizeInput(e.target.value);
  };

  const handleClose = () => {
    toggleSearchModal({
      status: 'hidden',
      meal: 'none',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const dietLimits = {
    carbs: 30,
    fats: 150,
    protein: 100,
    calories: 1870,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: '% of daily allowance',
    },
    scales: {
      yAxes: [
        {
          ticks: {
            max: 100,
            min: 0,
            stepSize: 25,
          },
        },
      ],
    },
  };

  useEffect(() => {
    const fats = document.querySelector('.fats-value').innerHTML;
    const carbs = document.querySelector('.carbs-value').innerHTML;
    const protein = document.querySelector('.protein-value').innerHTML;

    let fatsRemaining;
    let carbsRemaining;
    let proteinRemaining;

    if (sizeInput !== '') {
      fatsRemaining = (fats / dietLimits.fats).toFixed(2) * 100;
      carbsRemaining = (carbs / dietLimits.carbs).toFixed(2) * 100;
      proteinRemaining = (protein / dietLimits.protein).toFixed(2) * 100;
    } else {
      fatsRemaining = foodReference.fats;
      carbsRemaining = foodReference.carbs;
      proteinRemaining = foodReference.protein;
    }

    setFoodToAdd({
      fats: fatsRemaining,
      carbs: carbsRemaining,
      protein: proteinRemaining,
    });
    // console.log(`${fatsRemaining} fats remaining`);

    const chart = () => {
      setChartData({
        labels: ['fats', 'carbs', 'protein'],
        datasets: [
          {
            label: 'macro ratios',
            data: [fatsRemaining, carbsRemaining, proteinRemaining],
            backgroundColor: [
              'rgba(255, 147, 64, 1)',
              'rgba(227, 28, 116, 1)',
              'rgba(64, 168, 255, 1)',
            ],
            borderWidth: 2,
            borderColor: '#434250',
          },
        ],
      });
    };

    chart();
  }, [suggestionWindow, sizeInput]);

  let calories;
  let fats;
  let carbs;
  let protein;
  if (sizeInput === '') {
    calories = foodReference.calories;
    fats = foodReference.fats;
    carbs = foodReference.carbs;
    protein = foodReference.protein;
  } else {
    calories = (foodReference.caloriesPer * sizeInput).toFixed(2);
    fats = (foodReference.fatsPer * sizeInput).toFixed(2);
    carbs = (foodReference.carbsPer * sizeInput).toFixed(2);
    protein = (foodReference.proteinPer * sizeInput).toFixed(2);
  }

  const getBtnStyle = () => {
    if (sizeInput !== '') {
      return 'submit-btn enabled';
    } else {
      return 'submit-btn';
    }
  };

  const getIconStyle = () => {
    if (sizeInput !== '') {
      return 'fas fa-check add-btn enabled';
    } else {
      return 'fas fa-check add-btn';
    }
  };

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
          <div className='name'>{foodReference.name}</div>
          <div className='description'>{foodReference.description}</div>

          <div className='portion-input-row'>
            <div></div>
            <div>
              <form onSubmit={handleSubmit}>
                <input
                  id='portion-input'
                  className='portion-input'
                  type='number'
                  placeholder={`${foodReference.size}${foodReference.unit}`}
                  onChange={handleChange}
                  value={sizeInput}
                ></input>
              </form>
            </div>
            <div></div>
          </div>
          <div className='calories-column'>
            <span className='calories-value'>{calories}</span>
            cal
          </div>
          <div className='macro-row'>
            <div className='fats-column'>
              <span className='fats-value'>{fats}</span>g
              <div className='label'>fats</div>
            </div>
            <div className='carbs-column'>
              <span className='carbs-value'>{carbs}</span>g
              <div className='label'>carbs</div>
            </div>
            <div className='protein-column'>
              <span className='protein-value'>{protein}</span>g
              <div className='label'>protein</div>
            </div>
          </div>
          <div className='graph-area'>
            <Bar data={chartData} options={options} />
          </div>
          <div className='submit-row'>
            <div></div>
            <div className={getBtnStyle()}>
              <i className={getIconStyle()}></i>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foodReference: state.searchItemSuggestion.foodReference,
  suggestionWindow: state.searchItemSuggestion.suggestionWindow,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodModal);
