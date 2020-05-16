import React, { useState, useEffect } from 'react';
import './search-food-modal.styles.scss';
import { connect } from 'react-redux';
import Search from './../search/search.component';
import {
  toggleSearchModal,
  updateTotals,
} from './../../redux/search-food-modal/search-food-modal.actions';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { Bar } from 'react-chartjs-2';
import { setEntry } from '../../redux/date-selector/date-selector.actions';

const SearchFoodModal = ({
  toggleSearchModal,
  updateTotals,
  foodReference,
  createFoodReference,
  suggestionWindow,
  entries,
  searchModal,
  setEntry,
  currentUser,
}) => {
  const [chartData, setChartData] = useState({});
  const [sizeInput, setSizeInput] = useState('');

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
    // regEx, allow empty string, or values from 0-9 and 0-4 digits
    const permitted = /^[ 0-9]{0,4}$/;
    if (e.target.value.match(permitted)) {
      setSizeInput(e.target.value);
    }
  };

  const handleClose = () => {
    toggleSearchModal({
      status: 'hidden',
      meal: 'none',
    });
  };

  const recalculateTotals = (entry) => {
    if (entry !== '' && currentUser !== null) {
      // total fats in meal
      const fats = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.f);
        },
        0
      );
      // total carbs in meal
      const carbs = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.c);
        },
        0
      );
      // total protein in meal
      const protein = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.p);
        },
        0
      );
      // total calories in meal
      const calories = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.e);
        },
        0
      );
      // total fiber in meal
      const fiber = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.d);
        },
        0
      );

      const copy = Object.assign({}, entry);

      copy[searchModal.meal]['totals']['f'] = parseFloat(fats.toFixed(1));
      copy[searchModal.meal]['totals']['c'] = parseFloat(carbs.toFixed(1));
      copy[searchModal.meal]['totals']['p'] = parseFloat(protein.toFixed(1));
      copy[searchModal.meal]['totals']['e'] = parseFloat(calories.toFixed(1));
      copy[searchModal.meal]['totals']['d'] = parseFloat(fiber.toFixed(1));

      return copy;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let foodCopy = Object.assign({}, foodReference);
    // entry state is immutable so make a copy of it first because pushing the edited version
    let entryCopy = Object.assign({}, entries);

    switch (searchModal.editMode) {
      case false:
        if (sizeInput !== '') {
          // adjust the food object based on user's input
          foodCopy.e = parseFloat(
            ((foodReference.e / 100) * sizeInput).toFixed(1)
          );
          foodCopy.f = parseFloat(
            ((foodReference.f / 100) * sizeInput).toFixed(1)
          );
          foodCopy.c = parseFloat(
            ((foodReference.c / 100) * sizeInput).toFixed(1)
          );
          foodCopy.p = parseFloat(
            ((foodReference.p / 100) * sizeInput).toFixed(1)
          );
          foodCopy.d = parseFloat(
            ((foodReference.d / 100) * sizeInput).toFixed(1)
          );
          foodCopy.size = parseFloat(sizeInput);

          entryCopy[searchModal.meal]['foods'].push(foodCopy);
        }
        break;
      case true:
        if (sizeInput !== '') {
          foodCopy.f = parseFloat(fats);
          foodCopy.c = parseFloat(carbs);
          foodCopy.p = parseFloat(protein);
          foodCopy.e = parseFloat(calories);
          foodCopy.size = parseFloat(sizeInput);

          // remove the edited food from the entries obj
          entryCopy[searchModal.meal]['foods'].splice(searchModal.listId, 1);

          // add the updated food to the entries obj back where it used to be
          entryCopy[searchModal.meal]['foods'].splice(
            searchModal.listId,
            0,
            foodCopy
          );
        }
        break;
      default:
        break;
    }

    // recalculate meal totals
    let updatedEntry = recalculateTotals(entryCopy);

    // recalculate daily totals
    updatedEntry = recalculateDailyTotals(updatedEntry);

    // before changing the entry state, we want to signal that we want to update the totals
    updateTotals(true);

    // dispatch the new entry obj to state
    setEntry(updatedEntry);

    handleClose();
  };

  const handleDelete = () => {
    // entry state is immutable so make a copy of it first because pushing the edited version
    const entryCopy = Object.assign({}, entries);

    // remove the edited food from the entries obj
    entryCopy[searchModal.meal]['foods'].splice(searchModal.listId, 1);

    // recalculate meal totals
    let updatedEntry = recalculateTotals(entryCopy);

    // recalculate daily totals
    updatedEntry = recalculateDailyTotals(updatedEntry);

    // signal that I want to update the totals and push them to firestore
    updateTotals(true);

    // dispatch the new entry obj to state
    setEntry(updatedEntry);

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

    if (currentUser !== null) {
      // switch block controls all of the chart rendering logic
      switch (searchModal.editMode) {
        case true:
          if (sizeInput !== '') {
            // render chart data based on user input
            fatsRemaining = (fats / currentUser.diet.fats).toFixed(1) * 100;
            carbsRemaining = (carbs / currentUser.diet.carbs).toFixed(1) * 100;
            proteinRemaining =
              (protein / currentUser.diet.protein).toFixed(1) * 100;
            caloriesRemaining =
              (calories / currentUser.diet.calories).toFixed(1) * 100;
          } else {
            // render chart data based on foodToEdit's existing macro data
            fatsRemaining =
              (foodReference.f / currentUser.diet.fats).toFixed(1) * 100;
            carbsRemaining =
              (foodReference.c / currentUser.diet.carbs).toFixed(1) * 100;
            proteinRemaining =
              (foodReference.p / currentUser.diet.protein).toFixed(1) * 100;
            caloriesRemaining =
              (foodReference.e / currentUser.diet.calories).toFixed(1) * 100;
          }
          break;
        case false:
          if (sizeInput !== '') {
            // render chart data based on user input
            fatsRemaining = (fats / currentUser.diet.fats).toFixed(1) * 100;
            carbsRemaining = (carbs / currentUser.diet.carbs).toFixed(1) * 100;
            proteinRemaining =
              (protein / currentUser.diet.protein).toFixed(1) * 100;
            caloriesRemaining =
              (calories / currentUser.diet.calories).toFixed(1) * 100;
          } else {
            // render chart data based on default macro data
            fatsRemaining =
              (foodReference.f / currentUser.diet.fats).toFixed(1) * 100;
            carbsRemaining =
              (foodReference.c / currentUser.diet.carbs).toFixed(1) * 100;
            proteinRemaining =
              (foodReference.p / currentUser.diet.protein).toFixed(1) * 100;
            caloriesRemaining =
              (foodReference.e / currentUser.diet.calories).toFixed(1) * 100;
          }
          break;
        default:
          break;
      }
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
    currentUser,
    calories,
    carbs,
    fats,
    protein,
    foodReference,
  ]);

  // update daily totals
  const recalculateDailyTotals = (entry) => {
    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

    let dailyFats = 0;
    let dailyProtein = 0;
    let dailyCarbs = 0;
    let dailyFiber = 0;
    let dailyCalories = 0;

    if (entries !== '') {
      meals.forEach((meal) => {
        dailyFats += entries[meal].totals.f;
        dailyProtein += entries[meal].totals.p;
        dailyCarbs += entries[meal].totals.c;
        dailyFiber += entries[meal].totals.d;
        dailyCalories += entries[meal].totals.e;
      });
    }

    const copy = Object.assign({}, entry);

    copy.dailyMacros = {
      f: parseFloat(dailyFats.toFixed(1)),
      p: parseFloat(dailyProtein.toFixed(1)),
      c: parseFloat(dailyCarbs.toFixed(1)),
      d: parseFloat(dailyFiber.toFixed(1)),
      e: parseFloat(dailyCalories.toFixed(1)),
    };

    return copy;
  };

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
                type='number'
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
  searchModal: state.searchModal.searchModal,
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  updateTotals: (status) => dispatch(updateTotals(status)),
  setEntry: (entries) => dispatch(setEntry(entries)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodModal);
