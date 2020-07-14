import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-stacked100';
import { connect, ConnectedProps } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectMetricsData } from '../../../redux/metrics/metrics.selectors';
import { MdArrowDropDown } from 'react-icons/md';
import { BsQuestionSquareFill } from 'react-icons/bs';
import './meal-chart.styles.scss';
import Tippy from '@tippyjs/react';
import { RootState } from '../../../redux/root-reducer';
import * as TMetrics from '../../../redux/metrics/metrics.types';

type Props = PropsFromRedux;

// Define the possible macro keys
type MacroKeys = 'f' | 'c' | 'k' | 'd' | 'p' | 'e';

// Define the possible meal keys
type MealKeys = 'b' | 'l' | 'd' | 's';

// Define the shape of the totals object, used to sum each respective macro
type Totals = {
  [K in MealKeys]: TMetrics.Macros;
};

// Define the shape of the Options object which will handle mapping macro keys to chart title displayed in UI
interface Options {
  f: 'Average Fats (g)';
  c: 'Average Carbs (g)';
  k: 'Average Net Carbs (g)';
  d: 'Average Fibre (g)';
  p: 'Average Protein (g)';
  e: 'Average Calories';
}

const MealChart = ({ data }: Props) => {
  const [chartData, setChartData] = useState({});
  const [target, setTarget] = useState<MacroKeys>('e');

  const OPTIONS: Options = {
    f: 'Average Fats (g)',
    c: 'Average Carbs (g)',
    k: 'Average Net Carbs (g)',
    d: 'Average Fibre (g)',
    p: 'Average Protein (g)',
    e: 'Average Calories',
  };

  useEffect(() => {
    if (data !== '') {
      let totals: Totals = {
        b: {
          f: 0,
          c: 0,
          k: 0,
          d: 0,
          p: 0,
          e: 0,
        },
        l: {
          f: 0,
          c: 0,
          k: 0,
          d: 0,
          p: 0,
          e: 0,
        },
        d: {
          f: 0,
          c: 0,
          k: 0,
          d: 0,
          p: 0,
          e: 0,
        },
        s: {
          f: 0,
          c: 0,
          k: 0,
          d: 0,
          p: 0,
          e: 0,
        },
      };

      let entryCount = 1;

      Object.keys(data).forEach((month) => {
        Object.keys(data[month]).forEach((date) => {
          Object.keys(totals).forEach((key) => {
            totals[key as MealKeys].f += data[month][date][key as MealKeys].f;
            totals[key as MealKeys].c += data[month][date][key as MealKeys].c;
            totals[key as MealKeys].k += data[month][date][key as MealKeys].k;
            totals[key as MealKeys].d += data[month][date][key as MealKeys].d;
            totals[key as MealKeys].p += data[month][date][key as MealKeys].p;
            totals[key as MealKeys].e += data[month][date][key as MealKeys].e;
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
                (totals.b[target] / entryCount).toFixed(2),
                (totals.l[target] / entryCount).toFixed(2),
                (totals.d[target] / entryCount).toFixed(2),
                (totals.s[target] / entryCount).toFixed(2),
              ],
              backgroundColor: ['#ffa053', '#ff5387', '#53a3ff', '#53f9ff'],
              borderWidth: 2,
              borderColor: '#2e2e2e',
            },
          ],
        });
      };

      chartPerformance();
    }
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

  const toggleTarget = (e: React.MouseEvent) => {
    switch ((e.target as HTMLElement).innerText) {
      case OPTIONS.e:
        setTarget('e');
        break;
      case OPTIONS.f:
        setTarget('f');
        break;
      case OPTIONS.c:
        setTarget('c');
        break;
      case OPTIONS.k:
        setTarget('k');
        break;
      case OPTIONS.d:
        setTarget('d');
        break;
      case OPTIONS.p:
        setTarget('p');
        break;
      // case OPTIONS.w:
      //   setTarget('w');
      //   break;
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
    let array: JSX.Element[] = [];

    keys.forEach((key) => {
      let styling;
      if (keys.indexOf(key) % 2 === 0) {
        styling = 'opt liEven';
      } else {
        styling = 'opt liOdd';
      }
      array.push(
        <li
          key={OPTIONS[key as MacroKeys]}
          className={styling}
          onClick={toggleTarget}
        >
          {OPTIONS[key as MacroKeys]}
        </li>
      );
    });

    return array;
  };

  console.log(data);

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

interface Selectors {
  data: TMetrics.Data | '';
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  data: selectMetricsData,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(MealChart);
