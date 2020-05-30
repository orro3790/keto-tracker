import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Search from './../search/search.component';
import AddFavorite from '../../components/add-favorite/add-favorite.component';
import FoodFilter from '../../components/food-filter/food-filter.component';
import { HorizontalBar } from 'react-chartjs-2';
import {
  toggleSearchModal,
  updateTotals,
} from './../../redux/search-food-modal/search-food-modal.actions';
import { createFoodReference } from './../../redux/search-item/search-item.actions.js';
import { toggleFavsModal } from '../../redux/favs-modal/favs-modal.actions.js';
import { setEntry } from '../../redux/date-selector/date-selector.actions';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions';
import { toggleCustomFoodsModal } from '../../redux/custom-foods-modal/custom-foods-modal.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectDietSettings,
  selectCarbSettings,
  selectCurrentUserId,
} from '../../redux/user/user.selectors';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { selectEntries } from '../../redux/date-selector/date-selector.selectors';
import {
  selectSuggestionWindow,
  selectFoodReference,
} from '../../redux/search-item/search-item.selectors';

import './search-food-modal.styles.scss';
import { selectFavModalStatus } from '../../redux/favs-modal/favs-modal.selectors';
import { selectCustomFoodsModalStatus } from '../../redux/custom-foods-modal/custom-foods-modal.selectors';
import { MdCheck, MdDelete } from 'react-icons/md';
import { IoIosBookmark } from 'react-icons/io';
import { GiFruitBowl } from 'react-icons/gi';
import { FaUserTag, FaTimes } from 'react-icons/fa';

const SearchFoodModal = ({
  toggleSearchModal,
  toggleCreateFoodModal,
  toggleFavsModal,
  toggleCustomFoodsModal,
  updateTotals,
  foodReference,
  createFoodReference,
  suggestionWindow,
  entries,
  searchModal,
  setEntry,
  carbSettings,
  userId,
  diet,
  favModal,
  customFoodModal,
}) => {
  const [chartData, setChartData] = useState({});
  const [sizeInput, setSizeInput] = useState('');

  let calories;
  let fats;
  let carbs;
  let protein;
  let netCarbs;

  if (foodReference !== '') {
    if (sizeInput !== '') {
      // renders macros based on user's size input
      calories = ((foodReference.e / 100) * sizeInput).toFixed(1);
      fats = ((foodReference.f / 100) * sizeInput).toFixed(1);
      carbs = ((foodReference.c / 100) * sizeInput).toFixed(1);
      protein = ((foodReference.p / 100) * sizeInput).toFixed(1);
      netCarbs = ((foodReference.k / 100) * sizeInput).toFixed(1);
    } else {
      fats = foodReference.f.toFixed(1);
      carbs = foodReference.c.toFixed(1);
      protein = foodReference.p.toFixed(1);
      calories = foodReference.e.toFixed(1);
      netCarbs = foodReference.k.toFixed(1);
    }
  }

  const handleChange = (e) => {
    // regEx, allow empty string, or values from 0-9 and 0-4 digits
    const permitted = /^[ 0-9]{0,4}$/;
    if (e.target.value.match(permitted)) {
      setSizeInput(e.target.value);
    }
  };

  const handleClose = (maintainMeal) => {
    // pass handleClose anything, if it receives an input parameter, it will maintain the meal
    if (maintainMeal) {
      toggleSearchModal({
        status: 'hidden',
        meal: searchModal.meal,
        editMode: false,
        foodToEdit: '',
        listId: '',
      });
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: 'none',
        editMode: false,
        foodToEdit: '',
        listId: '',
      });
    }
  };

  const openAddCustomFoodModal = () => {
    handleClose();
    toggleCreateFoodModal({
      status: 'visible',
    });
  };

  const openViewFavsModal = () => {
    handleClose('maintainMeal');
    toggleFavsModal({
      status: 'visible',
    });
  };

  const openCustomFoodModal = () => {
    handleClose('maintainMeal');
    toggleCustomFoodsModal({
      status: 'visible',
    });
  };

  const recalculateTotals = (entry) => {
    if (entry !== '') {
      const fats = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.f);
        },
        0
      );
      const carbs = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.c);
        },
        0
      );
      const protein = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.p);
        },
        0
      );
      const calories = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.e);
        },
        0
      );
      const fiber = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.d);
        },
        0
      );
      const netCarbs = entry[searchModal.meal]['foods'].reduce(
        (accumulator, food) => {
          return (accumulator += food.k);
        },
        0
      );

      const copy = Object.assign({}, entry);

      copy[searchModal.meal]['totals']['f'] = parseFloat(fats.toFixed(1));
      copy[searchModal.meal]['totals']['c'] = parseFloat(carbs.toFixed(1));
      copy[searchModal.meal]['totals']['p'] = parseFloat(protein.toFixed(1));
      copy[searchModal.meal]['totals']['e'] = parseFloat(calories.toFixed(1));
      copy[searchModal.meal]['totals']['d'] = parseFloat(fiber.toFixed(1));
      copy[searchModal.meal]['totals']['k'] = parseFloat(netCarbs.toFixed(1));

      return copy;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (sizeInput !== '') {
      let foodCopy = Object.assign({}, foodReference);
      let entryCopy = Object.assign({}, entries);
      switch (searchModal.editMode) {
        case false:
          if (sizeInput !== '') {
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
            foodCopy.k = parseFloat(
              ((foodReference.k / 100) * sizeInput).toFixed(1)
            );
            foodCopy.size = parseFloat(sizeInput);

            entryCopy[searchModal.meal]['foods'].push(foodCopy);
          }
          break;
        case true:
          if (sizeInput !== '') {
            foodCopy.f = parseFloat(fats);
            foodCopy.c = parseFloat(carbs);
            foodCopy.k = parseFloat(netCarbs);
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

      if (favModal === 'visible') {
        toggleFavsModal({
          status: 'hidden',
        });
      }

      if (customFoodModal === 'visible') {
        toggleCustomFoodsModal({
          status: 'hidden',
        });
      }

      handleClose();
    }
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

  const recalculateDailyTotals = (entry) => {
    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

    let dailyFats = 0;
    let dailyProtein = 0;
    let dailyCarbs = 0;
    let dailyFiber = 0;
    let dailyNetCarbs = 0;
    let dailyCalories = 0;

    if (entries !== '') {
      meals.forEach((meal) => {
        dailyFats += entries[meal].totals.f;
        dailyProtein += entries[meal].totals.p;
        dailyCarbs += entries[meal].totals.c;
        dailyFiber += entries[meal].totals.d;
        dailyNetCarbs += entries[meal].totals.k;
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
      k: parseFloat(dailyNetCarbs.toFixed(1)),
    };

    return copy;
  };

  const getBtnStyle = () => {
    if (sizeInput !== '') {
      return 'submit-btn on';
    } else {
      return 'submit-btn';
    }
  };

  const getIconStyle = () => {
    if (sizeInput !== '') {
      return 'fas fa-check add-i on';
    } else {
      return 'fas fa-check add-i';
    }
  };

  let labels;
  if (carbSettings === 'n') {
    labels = ['fats', 'net carbs', 'protein', 'calories'];
  } else {
    labels = ['fats', 'carbs', 'protein', 'calories'];
  }

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
      fontColor: '#fff',
    },
    scales: {
      yAxes: [
        {
          type: 'category',
          labels: labels,

          display: false,
          gridLines: {
            color: '#373737',
            display: false,
          },
          ticks: {
            padding: 10,
            fontColor: '#fff',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: '#373737',
            drawBorder: false,
          },
          ticks: {
            max: 100,
            min: 0,
            stepSize: 20,
            padding: 5,
            fontColor: '#fff',
          },
        },
      ],
    },
  };

  // update chart rendering based on input values
  useEffect(() => {
    let fatsRemaining = 0;
    let carbsRemaining = 0;
    let proteinRemaining = 0;
    let caloriesRemaining = 0;
    let netCarbsRemaining = 0;

    // switch block controls all of the chart rendering logic
    switch (searchModal.editMode) {
      case true:
        if (sizeInput !== '') {
          // render chart data based on user input
          fatsRemaining = (fats / diet.fats) * 100;
          carbsRemaining = (carbs / diet.carbs) * 100;
          netCarbsRemaining = (netCarbs / diet.carbs) * 100;
          proteinRemaining = (protein / diet.protein) * 100;
          caloriesRemaining = (calories / diet.calories) * 100;
        } else {
          // render chart data based on foodToEdit's existing macro data
          fatsRemaining = (foodReference.f / diet.fats) * 100;
          carbsRemaining = (foodReference.c / diet.carbs) * 100;
          netCarbsRemaining = (foodReference.k / diet.carbs) * 100;
          proteinRemaining = (foodReference.p / diet.protein) * 100;
          caloriesRemaining = (foodReference.e / diet.calories) * 100;
        }
        break;
      case false:
        if (sizeInput !== '') {
          // render chart data based on user input
          fatsRemaining = (fats / diet.fats) * 100;
          carbsRemaining = (carbs / diet.carbs) * 100;
          netCarbsRemaining = (netCarbs / diet.carbs) * 100;
          proteinRemaining = (protein / diet.protein) * 100;
          caloriesRemaining = (calories / diet.calories) * 100;
        } else {
          // render chart data based on default macro data
          fatsRemaining = (foodReference.f / diet.fats) * 100;
          carbsRemaining = (foodReference.c / diet.carbs) * 100;
          netCarbsRemaining = (foodReference.k / diet.carbs) * 100;
          proteinRemaining = (foodReference.p / diet.protein) * 100;
          caloriesRemaining = (foodReference.e / diet.calories) * 100;
        }
        break;
      default:
        break;
    }

    const chart = () => {
      let data;
      if (carbSettings === 'n') {
        data = [
          fatsRemaining.toPrecision(3),
          netCarbsRemaining.toPrecision(3),
          proteinRemaining.toPrecision(3),
          caloriesRemaining.toPrecision(3),
        ];
      } else {
        data = [
          fatsRemaining.toPrecision(3),
          carbsRemaining.toPrecision(3),
          proteinRemaining.toPrecision(3),
          caloriesRemaining.toPrecision(3),
        ];
      }

      setChartData({
        datasets: [
          {
            data: data,
            backgroundColor: ['#ffa053', '#ff5387', '#53a3ff', '#fff'],
            categoryPercentage: 1.0,
            barPercentage: 0.8,
          },
        ],
      });
    };

    chart();
  }, [
    suggestionWindow,
    sizeInput,
    searchModal,
    calories,
    carbs,
    netCarbs,
    fats,
    protein,
    foodReference,
    diet,
    carbSettings,
  ]);

  let placeholder;

  switch (searchModal.editMode) {
    case false:
      placeholder = `100${foodReference.u}`;
      break;
    case true:
      if (foodReference.size !== undefined) {
        placeholder = `${foodReference.size}${foodReference.u}`;
      } else {
        placeholder = `100${foodReference.u}`;
      }
      break;
    default:
      break;
  }

  let submitRow;

  if (searchModal.editMode === false) {
    submitRow = (
      <div className='submit-r'>
        <div></div>
        <div className={getBtnStyle()} onClick={handleSubmit}>
          <MdCheck className={getIconStyle()} />
        </div>
        <div></div>
      </div>
    );
  } else {
    submitRow = (
      <div className='submit-r-edit-mode'>
        <div className={getBtnStyle()} onClick={handleSubmit}>
          <MdCheck className={getIconStyle()} />
        </div>
        <div className='delete-btn' onClick={handleDelete}>
          <MdDelete className='fas fa-trash delete-i' />
        </div>
      </div>
    );
  }

  let resultsContainer;
  let carbsOrNetCarbs;
  let carbsOrNetCarbsLabel;

  if (carbSettings === 'n') {
    carbsOrNetCarbs = netCarbs;
    carbsOrNetCarbsLabel = 'net carbs';
  } else {
    carbsOrNetCarbs = carbs;
    carbsOrNetCarbsLabel = 'carbs';
  }

  if (foodReference !== '') {
    resultsContainer = (
      <div className='results-c'>
        <div className='name'>
          <div>{foodReference.n}</div>
          <div className='fav-btn-c'>
            <AddFavorite />
          </div>
        </div>
        <div className='desc'>{foodReference.b}</div>
        <div className='portion-r'>
          <div></div>
          <div>
            <form onSubmit={handleSubmit}>
              <input
                id='in'
                className='in'
                type='number'
                placeholder={placeholder}
                onChange={handleChange}
                value={sizeInput}
              ></input>
            </form>
          </div>
          <div></div>
        </div>

        <div className='macro-r'>
          <div className='fats col'>
            <span>{fats}</span>g<div className='l'>fats</div>
          </div>
          <div className='carbs col'>
            <span>{carbsOrNetCarbs}</span>g
            <div className='l'>{carbsOrNetCarbsLabel}</div>
          </div>
          <div className='protein col'>
            <span>{protein}</span>g<div className='l'>protein</div>
          </div>
          <div className='calories col'>
            <span className='val'>{calories}</span>
            <div className='l'>calories</div>
          </div>
        </div>
        <div className='graph-s'>
          <HorizontalBar data={chartData} options={options} />
        </div>
        {submitRow}
      </div>
    );
  } else {
    resultsContainer = (
      <div className='hud'>
        <div className='hud-r'>
          <div>
            <GiFruitBowl
              className='fas fa-utensils add'
              onClick={openAddCustomFoodModal}
            />
          </div>
          <div onClick={openViewFavsModal}>
            <IoIosBookmark className='fas fa-bookmark fav' />
          </div>
          <div className='l'>Create Custom Food</div>
          <div className='l'>View Favorites</div>
        </div>

        <div className='hud-r-single'>
          <div>
            <FaUserTag
              className='fas fa-folder-open custom'
              onClick={openCustomFoodModal}
            />
          </div>
          <div className='l'>View Custom Foods</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='search-food-m'>
        <div className='btn-c'>
          <FoodFilter />
          <div className='close-btn' onClick={handleClose}>
            <FaTimes className='fas fa-times' />
          </div>
        </div>
        <div className='search-s'>
          <Search />
        </div>

        {resultsContainer}
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  foodReference: selectFoodReference,
  suggestionWindow: selectSuggestionWindow,
  entries: selectEntries,
  searchModal: selectModal,
  carbSettings: selectCarbSettings,
  diet: selectDietSettings,
  userId: selectCurrentUserId,
  favModal: selectFavModalStatus,
  customFoodModal: selectCustomFoodsModalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
  toggleFavsModal: (status) => dispatch(toggleFavsModal(status)),
  toggleCustomFoodsModal: (status) => dispatch(toggleCustomFoodsModal(status)),
  updateTotals: (status) => dispatch(updateTotals(status)),
  setEntry: (entries) => dispatch(setEntry(entries)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodModal);
