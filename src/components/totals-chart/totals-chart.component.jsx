import React, { useState, useEffect } from 'react';
import './totals-chart.styles.scss';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';

const TotalsChart = ({ entry, meal, searchModal, currentUser }) => {
  const [chartData, setChartData] = useState({});
  const [totalsData, setTotalsData] = useState([1, 0, 0, 0]);

  useEffect(() => {
    // only try to chart once data has been loaded into state
    if (entry !== '') {
      // don't overwrite the default chart data unless there are actually calories present
      if (entry[meal].f.length !== 0) {
        const totalFats = entry[meal].t.f;
        const totalCarbs = entry[meal].t.c;
        const totalNetCarbs = entry[meal].t.k;
        const totalProtein = entry[meal].t.p;
        const totalCalories = entry[meal].t.e;
        if (currentUser.c === 'n') {
          setTotalsData([
            totalFats,
            totalNetCarbs,
            totalProtein,
            totalCalories,
          ]);
        } else {
          setTotalsData([totalFats, totalCarbs, totalProtein, totalCalories]);
        }
      }
      // when there are no foods in the meal array, set the chart data back to default values
      if (entry[meal].f.length === 0) {
        setTotalsData([1, 0, 0, 0]);
      }
    }
  }, [entry, meal, currentUser]);

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
    cutoutPercentage: 60,
  };

  useEffect(() => {
    let colors;
    let labels;
    if (currentUser.c === 'n') {
      labels = ['fats', 'net carbs', 'protein'];
    } else {
      labels = ['fats', 'carbs', 'protein'];
    }
    if (totalsData[3] === 0) {
      colors = '#727378';
    } else {
      colors = [
        'rgba(255,160,83,1)',
        'rgba(255,83,135,1)',
        'rgba(83,163,255,1)',
      ];
    }
    const chart = () => {
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'macro ratios',
            data: [totalsData[0], totalsData[1], totalsData[2]],
            backgroundColor: colors,
            borderWidth: 2.5,
            borderColor: '#222222',
          },
        ],
      });
    };
    chart();
    // use searchModal as useEffect trigger for updating charts because searchModal precedes all CRUD operations
  }, [totalsData, currentUser]);

  return (
    <div>
      <div className='meal-chart'>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  entry: state.dateSelector.entry,
  searchModal: state.searchModal.modal,
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(TotalsChart);
