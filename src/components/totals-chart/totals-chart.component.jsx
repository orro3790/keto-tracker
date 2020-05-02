import React, { useState, useEffect } from 'react';
import './totals-chart.styles.scss';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';

const TotalsChart = ({ entries, meal, dates }) => {
  const [chartData, setChartData] = useState({});

  // if entries obj in localStorage, use it for rendering, else use the entries object in state
  let entriesObj;
  entriesObj = JSON.parse(localStorage.getItem('entries'));
  if (entriesObj !== undefined && entriesObj !== null) {
    // console.log('date selector retrieved entriesObj');
    // console.log(entriesObj);
  } else {
    entriesObj = entries;
  }

  const totalFats = entriesObj[dates.currentDate][meal]['totals']['fats'];
  const totalCarbs = entriesObj[dates.currentDate][meal]['totals']['carbs'];
  const totalProtein = entriesObj[dates.currentDate][meal]['totals']['protein'];
  const totalCalories =
    entriesObj[dates.currentDate][meal]['totals']['calories'];

  let totalsData;
  if (totalCalories === 0) {
    totalsData = [1];
  } else {
    totalsData = [
      totalFats.toFixed(1),
      totalCarbs.toFixed(1),
      totalProtein.toFixed(1),
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
  dates: state.foodDiary.dates,
});

export default connect(mapStateToProps)(TotalsChart);
