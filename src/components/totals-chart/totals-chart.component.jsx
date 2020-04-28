import React from 'react';
import './totals-chart.styles.scss';
import { connect } from 'react-redux';
import { createEntry } from './../../redux/food-diary/food-diary.actions.js';

const TotalsChart = ({ entries }) => {
  let currentDate = new Date();

  const [date, month, year] = [
    currentDate.getUTCDate(),
    currentDate.getUTCMonth(),
    currentDate.getUTCFullYear(),
  ];

  currentDate = `${month}-${date}-${year}`;

  const totalFats = entries[currentDate]['Breakfast']['totals']['fats'];
  const totalCarbs = entries[currentDate]['Breakfast']['totals']['carbs'];
  const totalProtein = entries[currentDate]['Breakfast']['totals']['protein'];
  const totalCalories = entries[currentDate]['Breakfast']['totals']['calories'];

  return (
    <div>
      <div>Total Fats: {totalFats}</div>
      <div>Total Carbs: {totalCarbs}</div>
      <div>Total Protein: {totalProtein}</div>
      <div>Total Calories: {totalCalories}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  entries: state.foodDiary.entries,
});

const mapDispatchToProps = (dispatch) => ({
  createEntry: (entries) => dispatch(createEntry(entries)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TotalsChart);
