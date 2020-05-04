import React, { useState, useEffect } from 'react';
import './totals-chart.styles.scss';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';

const TotalsChart = ({ entries, meal, dates, searchModal }) => {
  const [chartData, setChartData] = useState({});

  // if entries obj in localStorage, use it for rendering, else use the entries object in state
  let entriesObj;
  entriesObj = JSON.parse(localStorage.getItem('entries'));
  if (entriesObj === undefined || entriesObj === null) {
    entriesObj = entries;
  }

  const totalFats = entriesObj[dates.currentDate][meal]['totals']['fats'];
  const totalCarbs = entriesObj[dates.currentDate][meal]['totals']['carbs'];
  const totalProtein = entriesObj[dates.currentDate][meal]['totals']['protein'];
  const totalCalories =
    entriesObj[dates.currentDate][meal]['totals']['calories'];

  let totalsData;
  let tooltipStatus;

  if (totalCalories === 0) {
    totalsData = [1];
    tooltipStatus = false;
  } else {
    totalsData = [
      totalFats.toFixed(1),
      totalCarbs.toFixed(1),
      totalProtein.toFixed(1),
    ];
    tooltipStatus = true;
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
    tooltips: {
      enabled: tooltipStatus,
    },
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
            borderWidth: 3,
            borderColor: '#222222',
          },
        ],
      });
    };

    chart();
    // use searchModal as useEffect trigger for updating charts because searchModal precedes all CRUD operations
  }, [searchModal, dates]);

  return (
    <div>
      <div className='meal-chart'>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  entries: state.dateSelector.entries,
  dates: state.dateSelector.dates,
  searchModal: state.meal.searchModal,
});

export default connect(mapStateToProps)(TotalsChart);
