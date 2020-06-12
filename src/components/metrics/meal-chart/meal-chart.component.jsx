import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-stacked100';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectMetricsData } from '../../../redux/metrics/metrics.selectors';
import { MdArrowDropDown } from 'react-icons/md';
import { BsQuestionSquareFill } from 'react-icons/bs';
import './meal-chart.styles.scss';
import Tippy from '@tippyjs/react';

const MealChart = ({ data }) => {
  const [chartData, setChartData] = useState({});
  const [target, setTarget] = useState('e');

  // Define the keys and their corresponding titles
  const OPTIONS = {
    f: 'Avergae Fats (g)',
    c: 'Average Carbs (g)',
    p: 'Average Protein (g)',
    e: 'Average Calories',
  };

  useEffect(() => {
    let totals = {
      Breakfast: {
        f: 0,
        c: 0,
        p: 0,
        e: 0,
      },
      Lunch: {
        f: 0,
        c: 0,
        p: 0,
        e: 0,
      },
      Dinner: {
        f: 0,
        c: 0,
        p: 0,
        e: 0,
      },
      Snacks: {
        f: 0,
        c: 0,
        p: 0,
        e: 0,
      },
    };

    let entryCount = 1;

    Object.keys(data).forEach((month) => {
      Object.keys(data[month]).forEach((date) => {
        Object.keys(totals).forEach((key) => {
          totals[key].f += parseFloat(data[month][date][key].f);
          totals[key].c += parseFloat(data[month][date][key].c);
          totals[key].p += parseFloat(data[month][date][key].p);
          totals[key].e += parseFloat(data[month][date][key].e);
        });
        // Keep count of how many dates are processed, for calculating the averages
        entryCount += 1;
      });
    });

    const chartPerformance = () => {
      setChartData({
        labels: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
        datasets: [
          {
            label: 'Meal Breakdown',
            data: [
              (totals.Breakfast[target] / entryCount).toFixed(2),
              (totals.Lunch[target] / entryCount).toFixed(2),
              (totals.Dinner[target] / entryCount).toFixed(2),
              (totals.Snacks[target] / entryCount).toFixed(2),
            ],
            backgroundColor: ['#ffa053', '#ff5387', '#53a3ff', '#53f9ff'],
            borderWidth: 2,
            borderColor: '#2e2e2e',
          },
        ],
      });
    };

    chartPerformance();
  }, [data, target]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      labels: {
        fontSize: 12,
        fontColor: '#fff',
        boxWidth: 10,
      },
    },
    animation: {
      duration: 1000,
    },
    plugins: {
      // Change options for ALL labels of THIS CHART
      datalabels: {
        color: '#36A2EB',
      },
    },
  };

  const toggleTarget = (e) => {
    switch (e.target.innerText) {
      case OPTIONS.e:
        setTarget('e');
        break;
      case OPTIONS.f:
        setTarget('f');
        break;
      case OPTIONS.c:
        setTarget('c');
        break;
      case OPTIONS.p:
        setTarget('p');
        break;
      case OPTIONS.w:
        setTarget('w');
        break;
      default:
        break;
    }
  };

  const renderOptions = () => {
    // pull the keys from the TITLES obj to an array to allow indexing
    let keys = Object.keys(OPTIONS);

    // remove the macro currently being viewed, from the list of options to render
    keys.forEach((key) => {
      if (key === target) {
        let position = keys.indexOf(key);
        keys.splice(position, 1);
      }
    });

    // assemble the option rows and tag each option as either even or odd for styling purposes
    let array = [];

    keys.forEach((key) => {
      let styling;
      if (keys.indexOf(key) % 2 === 0) {
        styling = 'opt liEven';
      } else {
        styling = 'opt liOdd';
      }
      array.push(
        <li key={OPTIONS[key]} className={styling} onClick={toggleTarget}>
          {OPTIONS[key]}
        </li>
      );
    });

    return array;
  };

  return (
    <div className='outer-chart-c'>
      <div className='header-c-1'>
        <div className='left-col'>
          <Tippy
            content={
              <div className='chart-desc-tooltip'>
                This chart displays the average amount of calories or
                macronutrients consumed for breakfast, lunch, dinner, and
                snacks.
              </div>
            }
            animation={'scale'}
          >
            <div>
              <BsQuestionSquareFill className='question-i' />
            </div>
          </Tippy>
        </div>
        <div className='center-col'>
          <Tippy
            interactive={true}
            content={<ul className='opt-c'>{renderOptions()}</ul>}
          >
            <div>
              <span className='chart-t clickable'>{OPTIONS[target]}</span>
              <span className='dropdown-arrow clickable'>
                <MdArrowDropDown />
              </span>
            </div>
          </Tippy>
        </div>
        <div className='right-col'></div>
      </div>
      <div className='meal-chart-c'>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  data: selectMetricsData,
});

export default connect(mapStateToProps, null)(MealChart);
