import React, { useState, useEffect } from 'react';
import './totals-chart.styles.scss';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';

const TotalsChart = ({ entries, meal, searchModal }) => {
  const [chartData, setChartData] = useState({});
  const [totalsData, setTotalsData] = useState([1, 0, 0, 0]);

  useEffect(() => {
    // only try to chart once data has been loaded into state
    if (entries !== '') {
      // don't overwrite the default chart data unless there are actually calories present
      if (entries[meal]['foods'].length !== 0) {
        console.log(entries[meal]['totals']);
        const totalFats = entries[meal]['totals']['f'];
        const totalCarbs = entries[meal]['totals']['c'];
        const totalProtein = entries[meal]['totals']['p'];
        const totalCalories = entries[meal]['totals']['e'];
        setTotalsData([totalFats, totalCarbs, totalProtein, totalCalories]);
      }
      // when there are no foods in the meal array, set the chart data back to default values
      if (entries[meal]['foods'].length === 0) {
        setTotalsData([1, 0, 0, 0]);
        console.log('reset');
      }
    }
  }, [entries, meal]);

  // hide tooltip when no calories present (default state)
  let tooltipStatus = false;
  if (totalsData[3] !== 0) {
    tooltipStatus = true;
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
    let colors;
    if (totalsData[3] === 0) {
      colors = '#727378';
    } else {
      colors = [
        'rgba(255, 147, 64, 1)',
        'rgba(227, 28, 116, 1)',
        'rgba(64, 168, 255, 1)',
      ];
    }
    const chart = () => {
      setChartData({
        labels: ['fats', 'carbs', 'protein'],
        datasets: [
          {
            label: 'macro ratios',
            data: [totalsData[0], totalsData[1], totalsData[2]],
            backgroundColor: colors,
            borderWidth: 3,
            borderColor: '#222222',
          },
        ],
      });
    };
    chart();
    // use searchModal as useEffect trigger for updating charts because searchModal precedes all CRUD operations
  }, [totalsData]);

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
  searchModal: state.searchModal.searchModal,
});

export default connect(mapStateToProps)(TotalsChart);
