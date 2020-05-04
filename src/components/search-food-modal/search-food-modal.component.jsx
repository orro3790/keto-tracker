import React, { useState, useEffect } from 'react';
import './search-food-modal.styles.scss';
import { connect } from 'react-redux';
import Search from './../search/search.component';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { Bar } from 'react-chartjs-2';
import { createEntry } from '../../redux/date-selector/date-selector.actions';

const SearchFoodModal = ({
  toggleSearchModal,
  foodReference,
  createFoodReference,
  suggestionWindow,
  entries,
  searchModal,
  dates,
  userMacros,
}) => {
  const [chartData, setChartData] = useState({});
  const [sizeInput, setSizeInput] = useState('');

  // if entries obj in localStorage, use it for rendering, else use the entries object in state
  let entriesObj;
  entriesObj = JSON.parse(localStorage.getItem('entries'));
  if (entriesObj === undefined || entriesObj === null) {
    entriesObj = entries;
  }

  // hardcoded user profile settings for now, used to calculate daily %'s

  let calories;
  let fats;
  let carbs;
  let protein;

  if (sizeInput !== '') {
    // renders macros based on user's size input
    calories = (foodReference.caloriesPer * sizeInput).toFixed(1);
    fats = (foodReference.fatsPer * sizeInput).toFixed(1);
    carbs = (foodReference.carbsPer * sizeInput).toFixed(1);
    protein = (foodReference.proteinPer * sizeInput).toFixed(1);
  } else {
    //pulls and renders macros from the item that was clicked on in the meal component
    fats = foodReference.fats;
    carbs = foodReference.carbs;
    protein = foodReference.protein;
    calories = foodReference.calories;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: '% of daily allowance',
      fontColor: 'rgba(255, 255, 255, 1)',
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            color: '#373737',
          },
          ticks: {
            max: 100,
            min: 0,
            stepSize: 25,
            fontColor: 'rgba(255, 255, 255, 1)',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: '#373737',
          },
          ticks: {
            fontColor: 'rgba(255, 255, 255, 1)',
          },
        },
      ],
    },
  };

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

    switch (searchModal.editMode) {
      case false:
        if (sizeInput !== '') {
          // copy the foodReference obj but alter macro fields based off portion size
          const foodCopy = Object.assign({}, foodReference);

          foodCopy.fats = parseFloat(fats);
          foodCopy.carbs = parseFloat(carbs);
          foodCopy.protein = parseFloat(protein);
          foodCopy.calories = parseFloat(calories);
          foodCopy.size = parseFloat(sizeInput);

          // add foodCopy to the entries obj
          entriesObj[dates.currentDate][searchModal.meal]['foods'].push(
            foodCopy
          );

          // dispatch the new entry obj to state then close the window
          createEntry(entriesObj);

          // set in localStorage
          localStorage.setItem('entries', JSON.stringify(entriesObj));

          handleClose();
        }
        break;
      case true:
        if (sizeInput !== '') {
          // copy the foodReference obj but alter macro fields based off portion size
          const foodCopy = Object.assign({}, foodReference);

          foodCopy.fats = parseFloat(fats);
          foodCopy.carbs = parseFloat(carbs);
          foodCopy.protein = parseFloat(protein);
          foodCopy.calories = parseFloat(calories);
          foodCopy.size = parseFloat(sizeInput);

          // remove the edited food from the entries obj
          entriesObj[dates.currentDate][searchModal.meal]['foods'].splice(
            searchModal.listId,
            1
          );

          // add the updated food to the entries obj back where it used to be
          entriesObj[dates.currentDate][searchModal.meal]['foods'].splice(
            searchModal.listId,
            0,
            foodCopy
          );

          // dispatch the new entry obj to state
          createEntry(entriesObj);

          //remove the old entries obj from localStorage and replace it with the new one
          localStorage.removeItem(entriesObj);
          localStorage.setItem('entries', JSON.stringify(entriesObj));

          toggleSearchModal({
            status: 'hidden',
            meal: 'none',
          });
        }
        break;
      default:
        break;
    }
  };

  const handleDelete = () => {
    // remove the edited food from the entries obj
    entriesObj[dates.currentDate][searchModal.meal]['foods'].splice(
      searchModal.listId,
      1
    );

    // dispatch the new entry obj to state
    createEntry(entriesObj);

    // remove from localStorage and replace it with the new one
    localStorage.removeItem('entries');
    localStorage.setItem('entries', JSON.stringify(entriesObj));

    // reset foodReference
    createFoodReference('');

    toggleSearchModal({
      status: 'hidden',
      meal: 'none',
    });
  };

  useEffect(() => {
    if (foodReference !== '') {
      const fats = document.querySelector('.fats-value').innerHTML;
      const carbs = document.querySelector('.carbs-value').innerHTML;
      const protein = document.querySelector('.protein-value').innerHTML;
    }

    let fatsRemaining;
    let carbsRemaining;
    let proteinRemaining;
    let caloriesRemaining;

    // switch block controls all of the chart rendering logic
    switch (searchModal.editMode) {
      case true:
        if (sizeInput !== '') {
          // render chart data based on user input
          fatsRemaining = (fats / userMacros.fats).toFixed(1) * 100;
          carbsRemaining = (carbs / userMacros.carbs).toFixed(1) * 100;
          proteinRemaining = (protein / userMacros.protein).toFixed(1) * 100;
          caloriesRemaining = (calories / userMacros.calories).toFixed(1) * 100;
        } else {
          // render chart data based on foodToEdit's existing macro data
          fatsRemaining =
            (foodReference.fats / userMacros.fats).toFixed(1) * 100;
          carbsRemaining =
            (foodReference.carbs / userMacros.carbs).toFixed(1) * 100;
          proteinRemaining =
            (foodReference.protein / userMacros.protein).toFixed(1) * 100;
          caloriesRemaining =
            (foodReference.calories / userMacros.calories).toFixed(1) * 100;
        }
        break;
      case false:
        if (sizeInput !== '') {
          // render chart data based on user input
          fatsRemaining = (fats / userMacros.fats).toFixed(1) * 100;
          carbsRemaining = (carbs / userMacros.carbs).toFixed(1) * 100;
          proteinRemaining = (protein / userMacros.protein).toFixed(1) * 100;
          caloriesRemaining = (calories / userMacros.calories).toFixed(1) * 100;
        } else {
          // render chart data based on default macro data
          fatsRemaining =
            (foodReference.fats / userMacros.fats).toFixed(1) * 100;
          carbsRemaining =
            (foodReference.carbs / userMacros.carbs).toFixed(1) * 100;
          proteinRemaining =
            (foodReference.protein / userMacros.protein).toFixed(1) * 100;
          caloriesRemaining =
            (foodReference.calories / userMacros.calories).toFixed(1) * 100;
        }
        break;
      default:
        break;
    }

    const chart = () => {
      setChartData({
        labels: ['fats', 'carbs', 'protein', 'calories'],
        datasets: [
          {
            label: 'macro ratios',
            data: [
              fatsRemaining,
              carbsRemaining,
              proteinRemaining,
              caloriesRemaining,
            ],
            backgroundColor: [
              'rgba(255, 147, 64, 1)',
              'rgba(227, 28, 116, 1)',
              'rgba(64, 168, 255, 1)',
              'rgba(255, 255, 255, 1)',
            ],
            borderWidth: 2,
            borderColor: '#434250',
          },
        ],
      });
    };

    chart();
  }, [
    suggestionWindow,
    sizeInput,
    searchModal,
    userMacros.calories,
    userMacros.carbs,
    userMacros.fats,
    userMacros.protein,
    foodReference.calories,
    foodReference.carbs,
    foodReference.fats,
    foodReference.protein,
    calories,
    carbs,
    fats,
    protein,
    foodReference,
  ]);

  const getBtnStyle = () => {
    if (sizeInput !== '') {
      return 'submit-btn enabled';
    } else {
      return 'submit-btn';
    }
  };

  const getIconStyle = () => {
    if (sizeInput !== '') {
      return 'fas fa-check add-icon enabled';
    } else {
      return 'fas fa-check add-icon';
    }
  };

  let submitRow;

  if (searchModal.editMode === false) {
    submitRow = (
      <div className='submit-row'>
        <div></div>
        <div className={getBtnStyle()} onClick={handleSubmit}>
          <i className={getIconStyle()}></i>
        </div>
        <div></div>
      </div>
    );
  } else {
    submitRow = (
      <div className='submit-row-edit-mode'>
        <div className={getBtnStyle()} onClick={handleSubmit}>
          <i className={getIconStyle()}></i>
        </div>
        <div className='delete-btn' onClick={handleDelete}>
          <i className='fas fa-trash delete-icon'></i>
        </div>
      </div>
    );
  }

  let resultsContainer;
  if (foodReference !== '') {
    resultsContainer = (
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
          <div className='calories-column'>
            <span className='calories-value'>{calories}</span>
            <div className='label'>calories</div>
          </div>
        </div>
        <div className='graph-area'>
          <Bar data={chartData} options={options} />
        </div>
        {submitRow}
      </div>
    );
  } else {
    resultsContainer = <div className='results-container'></div>;
  }

  return (
    <div>
      <div className='search-food-modal'>
        <span className='close-search-modal-btn'>
          <i className='fas fa-times' onClick={handleClose}></i>
        </span>
        <div className='search-section'>
          <Search />
        </div>
        {resultsContainer}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foodReference: state.searchItemSuggestion.foodReference,
  suggestionWindow: state.searchItemSuggestion.suggestionWindow,
  entries: state.dateSelector.entries,
  searchModal: state.meal.searchModal,
  dates: state.dateSelector.dates,
  userMacros: state.user.userMacros,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createEntry: (entries) => dispatch(createEntry(entries)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodModal);
