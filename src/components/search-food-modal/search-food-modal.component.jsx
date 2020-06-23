import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Search from './../search/search.component';
import AddFavorite from '../../components/add-favorite/add-favorite.component';
import FoodFilter from '../../components/food-filter/food-filter.component';
import { HorizontalBar } from 'react-chartjs-2';
import {
  toggleSearchModal,
  allowUpdateFirebase,
} from '../../redux/search-modal/search-modal.actions';
import { setEntry } from '../../redux/date-selector/date-selector.actions';
import { createFoodReference } from './../../redux/search-item/search-item.actions';
import { toggleFavsModal } from '../../redux/favs-modal/favs-modal.actions.js';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions';
import { toggleCustomFoodsModal } from '../../redux/custom-foods-modal/custom-foods-modal.actions';
import { toggleWaterModal } from '../../redux/water-modal/water-modal.actions';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectDietSettings,
  selectCarbSettings,
  selectCurrentUserId,
  selectWaterSettings,
} from '../../redux/user/user.selectors';
import { selectModal } from '../../redux/search-modal/search-modal.selectors';
import { selectEntry } from '../../redux/date-selector/date-selector.selectors';
import {
  selectSuggestionWindow,
  selectFoodReference,
} from '../../redux/search-item/search-item.selectors';
import { selectFavModalStatus } from '../../redux/favs-modal/favs-modal.selectors';
import { selectCustomFoodsModalStatus } from '../../redux/custom-foods-modal/custom-foods-modal.selectors';
import { MdCheck, MdDelete } from 'react-icons/md';
import { IoIosBookmark } from 'react-icons/io';
import { GiFruitBowl, GiWaterBottle } from 'react-icons/gi';
import { FaUserTag, FaTimes } from 'react-icons/fa';
import {
  dateWriteable,
  updateGoalsAndPrecision,
} from '../../firebase/firebase.utils';
import './search-food-modal.styles.scss';

const SearchFoodModal = ({
  toggleSearchModal,
  toggleCreateFoodModal,
  toggleFavsModal,
  toggleCustomFoodsModal,
  toggleWaterModal,
  toggleAlertModal,
  allowUpdateFirebase,
  foodReference,
  createFoodReference,
  entry,
  currentDiet,
  searchModal,
  setEntry,
  carbSettings,
  favModal,
  customFoodModal,
  waterSettings,
}) => {
  const [chartData, setChartData] = useState({});
  const [sizeInput, setSizeInput] = useState('');

  // ref value is the macro value stored in the foodReference object
  const macros = {
    f: {
      refValue: 0,
      mealTotal: 0,
      dailyTotal: 0,
    },
    c: {
      refValue: 0,
      mealTotal: 0,
      dailyTotal: 0,
    },
    k: {
      refValue: 0,
      mealTotal: 0,
      dailyTotal: 0,
    },
    d: {
      refValue: 0,
      mealTotal: 0,
      dailyTotal: 0,
    },
    p: {
      refValue: 0,
      mealTotal: 0,
      dailyTotal: 0,
    },
    e: {
      refValue: 0,
      mealTotal: 0,
      dailyTotal: 0,
    },
  };

  // refers to the keys in the food entry, breakfast, lunch, dinner, snacks
  const meals = ['b', 'l', 'd', 's'];

  // Handles calculating macro values for food items
  if (foodReference !== '') {
    if (sizeInput !== '') {
      // Case 1: If editing an existing food item, pull the size value and calculate macros with it
      if (searchModal.editMode) {
        Object.keys(macros).forEach((macro) => {
          macros[macro].refValue = (
            (foodReference[macro] / foodReference.size) *
            sizeInput
          ).toFixed(1);
        });
      } else {
        // Case 2: If not editing an existing item display
        Object.keys(macros).forEach((macro) => {
          macros[macro].refValue = (
            (foodReference[macro] / 100) *
            sizeInput
          ).toFixed(1);
        });
      }
    }
    // Case 3: if no size input supplied, display the macros as they are stored in the database, based per 100g
    else {
      Object.keys(macros).forEach((macro) => {
        macros[macro].refValue = foodReference[macro].toFixed(1);
      });
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
        editMode: {
          enabled: false,
          food: '',
          index: '',
        },
      });
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: '',
        editMode: {
          enabled: false,
          food: '',
          index: '',
        },
      });
    }
  };

  const retotalMacros = () => {
    const entryCopy = Object.assign({}, entry);

    // calculate each macro total for the current meal (stored in searchModal.meal)
    Object.keys(macros).forEach((macro) => {
      macros[macro].mealTotal = entry[searchModal.meal].f.reduce(
        (accumulator, food) => {
          return (accumulator += food[macro]);
        },
        0
      );

      // push the total to the entry copy
      entryCopy[searchModal.meal].t[macro] = parseFloat(
        macros[macro].mealTotal.toFixed(1)
      );
    });

    // calculate daily totals for each macro
    meals.forEach((meal) => {
      Object.keys(macros).forEach((macro) => {
        macros[macro].dailyTotal += entry[meal].t[macro];
      });
    });

    // finally, push the daily totals to the entry copy
    Object.keys(macros).forEach((macro) => {
      entryCopy.m[macro] = parseFloat(macros[macro].dailyTotal.toFixed(1));
    });

    return entryCopy;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only allow updates to the entry if the entry date is +/- 7 days from today's date to limit abuse
    if (dateWriteable(entry.t.seconds * 1000) === true) {
      if (sizeInput !== '') {
        let foodCopy = Object.assign({}, foodReference);
        let entryCopy = Object.assign({}, entry);
        switch (searchModal.editMode) {
          case false:
            if (sizeInput !== '') {
              Object.keys(macros).forEach((macro) => {
                foodCopy[macro] = parseFloat(
                  ((foodReference[macro] / 100) * sizeInput).toFixed(1)
                );
              });

              foodCopy.size = parseFloat(sizeInput);

              entryCopy[searchModal.meal].f.push(foodCopy);
            }
            break;
          case true:
            if (sizeInput !== '') {
              Object.keys(macros).forEach((macro) => {
                foodCopy[macro] = parseFloat(macros[macro].refValue);
              });
              foodCopy.size = parseFloat(sizeInput);

              // remove the edited food from the entry obj
              entryCopy[searchModal.meal].f.splice(searchModal.index, 1);

              // add the updated food to the entry obj back where it used to be
              entryCopy[searchModal.meal].f.splice(
                searchModal.index,
                0,
                foodCopy
              );
            }
            break;
          default:
            break;
        }

        // recalculate meal and daily totals
        entryCopy = retotalMacros(entryCopy);

        // create a goals object to pass to updateGoalsAndPrecision
        let goals = {
          c: entryCopy.g.s.c,
          d: entryCopy.g.s.d,
          k: entryCopy.g.s.k,
          e: entryCopy.g.s.e,
          f: entryCopy.g.s.f,
          p: entryCopy.g.s.p,
          w: entryCopy.g.s.w,
        };

        // update the goal snapshot and precision where necessary
        entryCopy = updateGoalsAndPrecision(entryCopy, goals);

        // before changing the entry state, we want to signal that we want to update the entry in firebase
        allowUpdateFirebase(true);

        // dispatch the new entry obj to state
        setEntry(entryCopy);

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
    } else {
      toggleAlertModal({
        title: 'Sorry!',
        msg:
          "Entries can not be added, removed, or updated beyond one week from today's date.",
        img: 'error',
        status: 'visible',
        sticky: false,
      });
    }
  };

  const handleDelete = () => {
    // Only allow updates to the entry if the entry date is +/- 7 days from today's date, to limit abuse
    if (dateWriteable(entry.t.seconds * 1000) === true) {
      // entry state is immutable so make a copy of it first because pushing the edited version
      let entryCopy = Object.assign({}, entry);

      // remove the edited food from the entry obj
      entryCopy[searchModal.meal].f.splice(searchModal.index, 1);

      // recalculate meal totals
      entryCopy = retotalMacros(entryCopy);

      // create a goals object to pass to updateGoalsAndPrecision
      let goals = {
        c: entryCopy.g.s.c,
        d: entryCopy.g.s.d,
        k: entryCopy.g.s.k,
        e: entryCopy.g.s.e,
        f: entryCopy.g.s.f,
        p: entryCopy.g.s.p,
        w: entryCopy.g.s.w,
      };

      // update the goal snapshot and precision where necessary
      entryCopy = updateGoalsAndPrecision(entryCopy, goals);

      // signal that I want to update the totals and push them to firestore
      allowUpdateFirebase(true);

      // dispatch the new entry obj to state
      setEntry(entryCopy);

      // reset foodReference
      createFoodReference('');

      toggleSearchModal({
        status: 'hidden',
        meal: '',
        editMode: {
          enabled: false,
          food: '',
          index: '',
        },
      });
    } else {
      toggleAlertModal({
        title: 'Sorry!',
        msg:
          "Entries can not be added, removed, or updated beyond one week from today's date.",
        img: 'error',
        status: 'visible',
        sticky: false,
      });
    }
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

  let labels = ['fats', 'carbs', 'protein', 'calories'];
  if (carbSettings === 'n') {
    labels = ['fats', 'net carbs', 'protein', 'calories'];
  }

  const openCreateFoodModal = () => {
    handleClose('maintainMeal');
    toggleCreateFoodModal({
      status: 'visible',
    });
  };

  const openWaterModal = () => {
    handleClose('maintainMeal');
    toggleWaterModal({
      status: 'visible',
    });
  };

  const openFavsModal = () => {
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
    let remaining = {
      f: 0,
      c: 0,
      d: 0,
      k: 0,
      p: 0,
      e: 0,
    };

    // must point to primitive values in the obj as passing the entire object into useEffect causes loop rendering
    let macrosCopy = {
      f: macros.f.refValue,
      c: macros.c.refValue,
      d: macros.d.refValue,
      k: macros.k.refValue,
      p: macros.p.refValue,
      e: macros.e.refValue,
    };

    // switch block controls all of the chart rendering logic
    if (sizeInput !== '') {
      // render chart data based on user input
      Object.keys(remaining).forEach((macro) => {
        remaining[macro] = (macrosCopy[macro] / entry.g.s[macro]) * 100;
      });
    } else {
      // render chart data based on foodToEdit's existing macro data
      Object.keys(remaining).forEach((macro) => {
        remaining[macro] = (foodReference[macro] / entry.g.s[macro]) * 100;
      });
    }

    const chart = () => {
      let data;
      if (carbSettings === 'n') {
        data = [
          remaining.f.toPrecision(3),
          remaining.k.toPrecision(3),
          remaining.p.toPrecision(3),
          remaining.e.toPrecision(3),
        ];
      } else {
        data = [
          remaining.f.toPrecision(3),
          remaining.c.toPrecision(3),
          remaining.p.toPrecision(3),
          remaining.e.toPrecision(3),
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
    entry,
    macros.f.refValue,
    macros.c.refValue,
    macros.d.refValue,
    macros.k.refValue,
    macros.p.refValue,
    macros.e.refValue,
    sizeInput,
    searchModal,
    foodReference,
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
    carbsOrNetCarbs = macros.k.refValue;
    carbsOrNetCarbsLabel = 'net carbs';
  } else {
    carbsOrNetCarbs = macros.c.refValue;
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
            <span>{macros.f.refValue}</span>g<div className='l'>fats</div>
          </div>
          <div className='carbs col'>
            <span>{carbsOrNetCarbs}</span>g
            <div className='l'>{carbsOrNetCarbsLabel}</div>
          </div>
          <div className='protein col'>
            <span>{macros.p.refValue}</span>g<div className='l'>protein</div>
          </div>
          <div className='calories col'>
            <span className='val'>{macros.e.refValue}</span>
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
              onClick={openCreateFoodModal}
            />
          </div>
          <div onClick={openFavsModal}>
            <IoIosBookmark className='fas fa-bookmark fav' />
          </div>
          <div className='l'>Create Custom Food</div>
          <div className='l'>View Favorites</div>
        </div>

        <div className='hud-r'>
          <div>
            <GiWaterBottle
              className='fas fa-folder-open custom'
              onClick={openWaterModal}
            />
          </div>
          <div>
            <FaUserTag
              className='fas fa-folder-open custom'
              onClick={openCustomFoodModal}
            />
          </div>
          <div className='l'>Add Water</div>
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
  entry: selectEntry,
  searchModal: selectModal,
  carbSettings: selectCarbSettings,
  currentDiet: selectDietSettings,
  userId: selectCurrentUserId,
  favModal: selectFavModalStatus,
  customFoodModal: selectCustomFoodsModalStatus,
  waterSettings: selectWaterSettings,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
  toggleFavsModal: (status) => dispatch(toggleFavsModal(status)),
  toggleWaterModal: (status) => dispatch(toggleWaterModal(status)),
  toggleCustomFoodsModal: (status) => dispatch(toggleCustomFoodsModal(status)),
  allowUpdateFirebase: (status) => dispatch(allowUpdateFirebase(status)),
  setEntry: (entry) => dispatch(setEntry(entry)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodModal);
