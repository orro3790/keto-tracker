import React, { useState, useEffect } from 'react';
import './totals-chart.styles.scss';
import { connect } from 'react-redux';
import { createEntry } from './../../redux/food-diary/food-diary.actions.js';
import { Doughnut } from 'react-chartjs-2';

const TotalsChart = ({ entries, meal }) => {
  const [chartData, setChartData] = useState({});

  let currentDate = new Date();

  const [date, month, year] = [
    currentDate.getUTCDate(),
    currentDate.getUTCMonth(),
    currentDate.getUTCFullYear(),
  ];

  currentDate = `${month}-${date}-${year}`;

  const totalFats = entries[currentDate][meal]['totals']['fats'];
  const totalCarbs = entries[currentDate][meal]['totals']['carbs'];
  const totalProtein = entries[currentDate][meal]['totals']['protein'];
  const totalCalories = entries[currentDate][meal]['totals']['calories'];

  let totalsData;
  if (totalCalories === 0) {
    totalsData = [1];
  } else {
    totalsData = [
      totalFats.toFixed(2),
      totalCarbs.toFixed(2),
      totalProtein.toFixed(2),
    ];
  }

  let colors;
  if (totalCalories === 0) {
    colors = '#727378';
  } else {
    colors = [
      'rgba(255, 147, 64, 1)',
      'rgba(227, 28, 116, 1)',
      'rgba(64, 168, 255, 1)',
    ];
  }

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    // title: {
    //   display: true,
    //   text: [meal],
    // },
  };

  useEffect(() => {
    const chart = () => {
      setChartData({
        labels: ['fats', 'carbs', 'protein'],
        datasets: [
          {
            label: 'macro ratios',
            data: totalsData,
            backgroundColor: colors,
            borderWidth: 4,
            borderColor: '#222222',
          },
        ],
      });
    };

    chart();
  }, [totalFats, totalCarbs, totalProtein]);

  return (
    <div>
      <div className='meal-chart'>
        <Doughnut data={chartData} options={options} />
      </div>
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
