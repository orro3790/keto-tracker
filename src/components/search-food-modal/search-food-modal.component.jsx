import React, { useState, useEffect } from 'react';
import './search-food-modal.styles.scss';
import { connect } from 'react-redux';
import Search from './../search/search.component';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { Bar } from 'react-chartjs-2';
import { setEntry } from '../../redux/date-selector/date-selector.actions';

const SearchFoodModal = ({
  toggleSearchModal,
  foodReference,
  createFoodReference,
  suggestionWindow,
  entries,
  searchModal,
  dates,
  userMacros,
  setEntry,
}) => {
  const [chartData, setChartData] = useState({});
  const [sizeInput, setSizeInput] = useState('');

  // if entries obj in localStorage, use it for rendering, else use the entries object in state
  let entriesObj;
  entriesObj = JSON.parse(localStorage.getItem('entries'));
  if (entriesObj === undefined || entriesObj === null) {
    entriesObj = entries;
  }

  let calories;
  let fats;
  let carbs;
  let protein;

  if (foodReference !== '') {
    if (sizeInput !== '') {
      // renders macros based on user's size input
      calories = ((foodReference.e / 100) * sizeInput).toFixed(1);
      fats = ((foodReference.f / 100) * sizeInput).toFixed(1);
      carbs = ((foodReference.c / 100) * sizeInput).toFixed(1);
      protein = ((foodReference.p / 100) * sizeInput).toFixed(1);
    } else {
      fats = foodReference.f.toFixed(1);
      carbs = foodReference.c.toFixed(1);
      protein = foodReference.p.toFixed(1);
      calories = foodReference.c.toFixed(1);
    }
  }

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

          // adjust the food object based on user's input
          foodCopy.e = ((foodReference.e / 100) * sizeInput).toFixed(1);
          foodCopy.f = ((foodReference.f / 100) * sizeInput).toFixed(1);
          foodCopy.c = ((foodReference.c / 100) * sizeInput).toFixed(1);
          foodCopy.p = ((foodReference.p / 100) * sizeInput).toFixed(1);
          foodCopy.d = ((foodReference.d / 100) * sizeInput).toFixed(1);
          foodCopy.size = parseFloat(sizeInput);

          console.log(foodCopy);

          // // add foodCopy to the entries obj
          // entriesObj[dates.currentDate][searchModal.meal]['foods'].push(
          //   foodCopy
          // );

          // // dispatch the new entry obj to state then close the window
          // setEntry(entriesObj);

          // // set in localStorage
          // localStorage.setItem('entries', JSON.stringify(entriesObj));

          handleClose();
        }
        break;
      case true:
        if (sizeInput !== '') {
          // copy the foodReference obj but alter macro fields based off portion size
          const foodCopy = Object.assign({}, foodReference);

          foodCopy.f = parseFloat(fats);
          foodCopy.c = parseFloat(carbs);
          foodCopy.p = parseFloat(protein);
          foodCopy.e = parseFloat(calories);
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
          setEntry(entriesObj);

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
    setEntry(entriesObj);

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

  // chart options config
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

  // render chart based on input values
  useEffect(() => {
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

  let placeholder;

  if (searchModal.editMode === false) {
    placeholder = `100${foodReference.u}`;
  } else {
    placeholder = `${foodReference.size}${foodReference.u}`;
  }

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
        <div className='name'>{foodReference.n}</div>
        <div className='description'>{foodReference.b}</div>
        <div className='portion-input-row'>
          <div></div>
          <div>
            <form onSubmit={handleSubmit}>
              <input
                id='portion-input'
                className='portion-input'
                type='text'
                maxLength='4'
                placeholder={placeholder}
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
  setEntry: (entries) => dispatch(setEntry(entries)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodModal);
