import React, { useState, useEffect } from 'react';
import './totals-chart.styles.scss';
import { connect } from 'react-redux';
import { createEntry } from './../../redux/food-diary/food-diary.actions.js';
import { Doughnut } from 'react-chartjs-2';

const TotalsChart = ({ entries }) => {
  const [chartData, setChartData] = useState({});

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

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Breakfast',
    },
  };

  useEffect(() => {
    const chart = () => {
      setChartData({
        labels: ['fats', 'carbs', 'protein'],
        datasets: [
          {
            label: 'macro ratios',
            data: [totalFats, totalCarbs, totalProtein],
            backgroundColor: [
              'rgba(255, 147, 64, 1)',
              'rgba(227, 28, 116, 1)',
              'rgba(64, 168, 255, 1)',
            ],
            borderWidth: 4,
          },
        ],
      });
    };

    chart();
  }, [totalFats, totalCarbs, totalProtein]);

  return (
    <div className='outer-chart-container'>
      <div className='inner-chart-container'>
        <div className='meal-chart'>
          <Doughnut data={chartData} options={options} />
        </div>
        <div className='meal-chart'>
          <Doughnut data={chartData} options={options} />
        </div>
        <div className='meal-chart'>
          <Doughnut data={chartData} options={options} />
        </div>
        <div className='meal-chart'>
          <Doughnut data={chartData} options={options} />
        </div>
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
