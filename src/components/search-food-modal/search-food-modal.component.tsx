import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import Search from '../search/search.component';
import AddFavorite from '../add-favorite/add-favorite.component';
import FoodFilter from '../food-filter/food-filter.component';
import { HorizontalBar } from 'react-chartjs-2';
import {
  toggleSearchModal,
  allowUpdateFirebase,
} from '../../redux/search-modal/search-modal.actions';
import { setEntry } from '../../redux/date-selector/date-selector.actions';
import { createFoodReference } from '../../redux/search-item/search-item.actions';
import { toggleFavsModal } from '../../redux/favs-modal/favs-modal.actions';
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
import { cloneDeep } from 'lodash';
import {
  dateWriteable,
  updateGoalsAndPrecision,
} from '../../firebase/firebase.utils';
import { RootState } from '../../redux/root-reducer';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';
import * as TSearchItem from '../../redux/search-item/search-item.types';
import * as TUser from '../../redux/user/user.types';
import * as TDateSelector from '../../redux/date-selector/date-selector.types';
import * as TFavsModal from '../../redux/favs-modal/favs-modal.types';
import * as TCustomFoodsModal from '../../redux/custom-foods-modal/custom-foods-modal.types';
import * as TWaterModal from '../../redux/water-modal/water-modal.types';
import * as TAlertModal from '../../redux/alert-modal/alert-modal.types';
import * as TCreateFoodModal from '../../redux/create-food/create-food.types';
import './search-food-modal.styles.scss';

type Props = PropsFromRedux;

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
  searchModal,
  setEntry,
  carbSettings,
  favModal,
  customFoodModal,
  waterSettings,
}: Props) => {
  const [chartData, setChartData] = useState<object>({});
  const [sizeInput, setSizeInput] = useState<string>('');

  interface MacrosCalculator {
    [index: string]: any;
    f: {
      refValue: number;
      mealTotal: number;
      dailyTotal: number;
    };
    c: {
      refValue: number;
      mealTotal: number;
      dailyTotal: number;
    };
    k: {
      refValue: number;
      mealTotal: number;
      dailyTotal: number;
    };
    d: {
      refValue: number;
      mealTotal: number;
      dailyTotal: number;
    };
    p: {
      refValue: number;
      mealTotal: number;
      dailyTotal: number;
    };
    e: {
      refValue: number;
      mealTotal: number;
      dailyTotal: number;
    };
  }

  // ref value is the macro value stored in the foodReference object
  const macros: MacrosCalculator = {
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

  // refers to the keys in the food entry, breakfast, lunch, dinner, snacks, used for iterators
  const meals = ['b', 'l', 'd', 's'];

  // Handles calculating macro values for food items
  if (foodReference !== '') {
    if (sizeInput !== '') {
      // Case 1: If editing an existing food item, pull the size value and calculate macros with it
      if (searchModal.editMode.enabled === true) {
        Object.keys(macros).forEach((macro) => {
          macros[macro].refValue = (
            (foodReference[macro] / foodReference.size!) *
            +sizeInput
          ).toFixed(1);
        });
      } else {
        // Case 2: If not editing an existing item display
        Object.keys(macros).forEach((macro) => {
          macros[macro].refValue = (
            (foodReference[macro] / 100) *
            +sizeInput
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // regEx, allow empty string, or values from 0-9 and 0-4 digits
    const permitted = /^[ 0-9]{0,4}$/;
    if (e.target.value.match(permitted)) {
      setSizeInput(e.target.value);
    }
  };

  // Can be passed either maintain meal: true/false, or receive mouse click event to close modal manually
  const handleClose = (
    maintainMeal: boolean | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // pass handleClose anything, if it receives an input parameter, it will maintain the meal
    if (maintainMeal === true) {
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

  // Calculate macro totals for the current meal
  const retotalMacros = () => {
    const entryCopy = cloneDeep(entry as TDateSelector.Entry);

    Object.keys(macros).forEach((macro) => {
      macros[macro].mealTotal = (entry as TDateSelector.Entry)[
        searchModal.meal
      ].f.reduce((accumulator: number, food: TSearchItem.Food) => {
        return (accumulator += food[macro]);
      }, 0);

      // push the total to the entry copy
      entryCopy[searchModal.meal].t[macro] = parseFloat(
        macros[macro].mealTotal.toFixed(1)
      );
    });

    // calculate daily totals for each macro
    meals.forEach((meal) => {
      Object.keys(macros).forEach((macro) => {
        macros[macro].dailyTotal += (entry as TDateSelector.Entry)[meal].t[
          macro
        ];
      });
    });

    // finally, push the daily totals to the entry copy
    Object.keys(macros).forEach((macro) => {
      entryCopy.m[macro] = parseFloat(macros[macro].dailyTotal.toFixed(1));
    });

    return entryCopy;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow updates to the entry if the entry date is +/- 7 days from today's date to limit abuse
    if (
      dateWriteable((entry as TDateSelector.Entry).t.seconds * 1000) === true
    ) {
      if (sizeInput !== '') {
        let foodCopy = Object.assign({}, foodReference);
        let entryCopy = cloneDeep(entry as TDateSelector.Entry);

        switch (searchModal.editMode.enabled) {
          case false:
            if (sizeInput !== '') {
              Object.keys(macros).forEach((macro) => {
                (foodCopy as TSearchItem.Food)[macro] = parseFloat(
                  (
                    ((foodReference as TSearchItem.Food)[macro] / 100) *
                    +sizeInput
                  ).toFixed(1)
                );
              });

              (foodCopy as TSearchItem.Food).size = parseFloat(sizeInput);

              (entryCopy as TDateSelector.Entry)[searchModal.meal].f.push(
                foodCopy
              );
            }
            break;
          case true:
            if (sizeInput !== '') {
              Object.keys(macros).forEach((macro) => {
                (foodCopy as TSearchItem.Food)[macro] = parseFloat(
                  macros[macro].refValue
                );
              });
              (foodCopy as TSearchItem.Food).size = parseFloat(sizeInput);

              // remove the edited food from the entry obj
              (entryCopy as TDateSelector.Entry)[searchModal.meal].f.splice(
                searchModal.editMode.index,
                1
              );

              // add the updated food to the entry obj back where it used to be
              (entryCopy as TDateSelector.Entry)[searchModal.meal].f.splice(
                searchModal.editMode.index,
                0,
                foodCopy
              );
            }
            break;
          default:
            break;
        }

        // recalculate meal and daily totals
        entryCopy = retotalMacros();

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
        entryCopy = updateGoalsAndPrecision(
          entryCopy,
          goals
        ) as TDateSelector.Entry;

        // before changing the entry state, we want to signal that we want to update the entry in firebase
        allowUpdateFirebase(true);

        // dispatch the new entry obj to state
        setEntry(entryCopy as TDateSelector.Entry);

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

        handleClose(false);
      }
    } else {
      toggleAlertModal({
        title: 'Sorry!',
        msg:
          "Entries can not be added, removed, or updated beyond one week from today's date.",
        icon: 'error',
        status: 'visible',
        sticky: false,
      });
    }
  };

  const handleDelete = () => {
    // Only allow updates to the entry if the entry date is +/- 7 days from today's date, to limit abuse
    if (
      dateWriteable((entry as TDateSelector.Entry).t.seconds * 1000) === true
    ) {
      // entry state is immutable so make a copy of it first because pushing the edited version
      let entryCopy = cloneDeep(entry as TDateSelector.Entry);

      // remove the edited food from the entry obj
      entryCopy[searchModal.meal].f.splice(searchModal.editMode.index, 1);

      // recalculate meal totals
      entryCopy = retotalMacros();

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
      entryCopy = updateGoalsAndPrecision(
        entryCopy,
        goals
      ) as TDateSelector.Entry;

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
        icon: 'error',
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
    handleClose(true);
    toggleCreateFoodModal({
      status: 'visible',
    });
  };

  const openWaterModal = () => {
    if ((waterSettings as TUser.WaterSettings).e === true) {
      handleClose(true);
      toggleWaterModal({
        status: 'visible',
      });
    } else {
      toggleAlertModal({
        title: 'TRACKING IS DISABLED',
        msg:
          'Click "Track Water" in your Water Settings to enable water tracking.',
        status: 'visible',
        sticky: false,
      });
    }
  };

  const openFavsModal = () => {
    handleClose(true);
    toggleFavsModal({
      status: 'visible',
    });
  };

  const openCustomFoodModal = () => {
    handleClose(true);
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
    interface Macros {
      [index: string]: any;
      f: number;
      c: number;
      d: number;
      k: number;
      p: number;
      e: number;
    }
    let remaining: Macros = {
      f: 0,
      c: 0,
      d: 0,
      k: 0,
      p: 0,
      e: 0,
    };

    // must point to primitive values in the obj as passing the entire object into useEffect causes loop rendering
    let macrosCopy: Macros = {
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
        remaining[macro] =
          (macrosCopy[macro] / (entry as TDateSelector.Entry).g.s[macro]) * 100;
      });
    } else {
      // render chart data based on foodToEdit's existing macro data
      Object.keys(remaining).forEach((macro) => {
        remaining[macro] =
          ((foodReference as TSearchItem.Food)[macro] /
            (entry as TDateSelector.Entry).g.s[macro]) *
          100;
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

  switch (searchModal.editMode.enabled) {
    case false:
      placeholder = `100${(foodReference as TSearchItem.Food).u}`;
      break;
    case true:
      if ((foodReference as TSearchItem.Food).size !== undefined) {
        placeholder = `${(foodReference as TSearchItem.Food).size}${
          (foodReference as TSearchItem.Food).u
        }`;
      } else {
        placeholder = `100${(foodReference as TSearchItem.Food).u}`;
      }
      break;
    default:
      break;
  }

  let submitRow;

  if (searchModal.editMode.enabled === false) {
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

interface Selectors {
  foodReference: TSearchItem.Food | '';
  suggestionWindow: boolean;
  entry: TDateSelector.Entry | '';
  searchModal: TSearchModal.Modal;
  carbSettings: TUser.CarbSettings | undefined;
  currentDiet: TUser.Diet | undefined;
  waterSettings: TUser.WaterSettings | undefined;
  userId: string | undefined;
  favModal: 'hidden' | 'visible';
  customFoodModal: 'hidden' | 'visible';
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  foodReference: selectFoodReference,
  suggestionWindow: selectSuggestionWindow,
  entry: selectEntry,
  searchModal: selectModal,
  carbSettings: selectCarbSettings,
  currentDiet: selectDietSettings,
  waterSettings: selectWaterSettings,
  userId: selectCurrentUserId,
  favModal: selectFavModalStatus,
  customFoodModal: selectCustomFoodsModalStatus,
});

type Actions =
  | TAlertModal.ToggleAlertModal
  | TSearchModal.ToggleSearchModal
  | TCreateFoodModal.ToggleCreateFoodModal
  | TFavsModal.ToggleFavsModal
  | TWaterModal.ToggleWaterModal
  | TCustomFoodsModal.ToggleCustomFoodsModal
  | TSearchModal.AllowUpdateFirebase
  | TDateSelector.SetEntry
  | TSearchItem.CreateFoodReference;

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  toggleAlertModal: (status: TAlertModal.Modal) =>
    dispatch(toggleAlertModal(status)),
  toggleSearchModal: (status: TSearchModal.Modal) =>
    dispatch(toggleSearchModal(status)),
  toggleCreateFoodModal: (status: TCreateFoodModal.Modal) =>
    dispatch(toggleCreateFoodModal(status)),
  toggleFavsModal: (status: TFavsModal.Modal) =>
    dispatch(toggleFavsModal(status)),
  toggleWaterModal: (status: TWaterModal.Modal) =>
    dispatch(toggleWaterModal(status)),
  toggleCustomFoodsModal: (status: TCustomFoodsModal.Modal) =>
    dispatch(toggleCustomFoodsModal(status)),
  allowUpdateFirebase: (status: boolean) =>
    dispatch(allowUpdateFirebase(status)),
  setEntry: (entry: TDateSelector.Entry) => dispatch(setEntry(entry)),
  createFoodReference: (food: TSearchItem.Food | '') =>
    dispatch(createFoodReference(food)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SearchFoodModal);
