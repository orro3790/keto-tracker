import React, { useState, useEffect } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import 'chartjs-plugin-stacked100';
import { connect, ConnectedProps } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectMetricsData } from '../../../redux/metrics/metrics.selectors';
import { selectCarbSettings } from '../../../redux/user/user.selectors';
import { MdArrowDropDown } from 'react-icons/md';
import { BsQuestionSquareFill } from 'react-icons/bs';
import Tippy from '@tippyjs/react';
import './goal-hit-chart.styles.scss';
import * as TMetrics from '../../../redux/metrics/metrics.types';
import { CarbSettings as TCarbSettings } from '../../../redux/user/user.types';
import { RootState } from '../../../redux/root-reducer';

type Props = PropsFromRedux;

// Define the shape of the goal count object, which will be used to hold the calculated sum of hit vs missed goals
type GoalCount = {
  f: {
    hit: number;
    miss: number;
  };
  c: {
    hit: number;
    miss: number;
  };
  p: {
    hit: number;
    miss: number;
  };
  e: {
    hit: number;
    miss: number;
  };
  w: {
    hit: number;
    miss: number;
  };
  k: {
    hit: number;
    miss: number;
  };
  d: {
    hit: number;
    miss: number;
  };
};

type ThresholdKeys = '0.01' | '0.05' | '0.1' | '0.15' | '0.2';

const GoalHitChart = ({ data, carbSettings }: Props) => {
  const [chartData, setChartData] = useState({});
  const [threshold, setThreshold] = useState({ value: 0.05, label: '5%' });

  let thresholdMapper = {
    '0.01': '1%',
    '0.05': '5%',
    '0.1': '10%',
    '0.15': '15%',
    '0.2': '20%',
  };

  const toggleThreshold = (e: React.MouseEvent) => {
    switch ((e.target as HTMLElement).innerText) {
      case '1%':
        setThreshold({
          value: 0.01,
          label: '1%',
        });
        break;
      case '5%':
        setThreshold({
          value: 0.05,
          label: '5%',
        });
        break;
      case '10%':
        setThreshold({
          value: 0.1,
          label: '10%',
        });
        break;
      case '15%':
        setThreshold({
          value: 0.15,
          label: '15%',
        });
        break;
      case '20%':
        setThreshold({
          value: 0.2,
          label: '20%',
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (data !== '') {
      let goalCount: GoalCount = {
        f: {
          hit: 0,
          miss: 0,
        },
        c: {
          hit: 0,
          miss: 0,
        },
        p: {
          hit: 0,
          miss: 0,
        },
        e: {
          hit: 0,
          miss: 0,
        },
        w: {
          hit: 0,
          miss: 0,
        },
        k: {
          hit: 0,
          miss: 0,
        },
        d: {
          hit: 0,
          miss: 0,
        },
      };

      let range = {
        floor: 1 - threshold.value,
        ceil: 1 + threshold.value,
      };

      Object.keys(data).forEach((month) => {
        Object.keys(data[month]).forEach((date) => {
          Object.keys(goalCount).forEach((goal) => {
            let performance = data[month][date].g.p[goal as TMetrics.GoalKeys];
            // Ensure the user is tracking the goal before calculating performance (ex: carbs/net carbs/fiber/)
            if (performance === null) {
              // Still have to figure out how I want to calculate null values here..discard from dataset prob.. not yet complete, still have to implement feature
            } else {
              // if the goal is being tracked (!null), then calculate performance
              if (performance <= range.ceil && performance >= range.floor) {
                goalCount[goal as TMetrics.GoalKeys].hit++;
              } else {
                goalCount[goal as TMetrics.GoalKeys].miss++;
              }
            }
          });
        });
      });

      const chartPerformance = () => {
        let labels;

        labels = ['Fats', 'Carbs', 'Net Carbs', 'Protein', 'Calories', 'Water'];

        console.log(goalCount);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Goal Hit',
              data: [
                goalCount.f.hit,
                goalCount.c.hit,
                goalCount.k.hit,
                goalCount.p.hit,
                goalCount.e.hit,
                goalCount.w.hit,
              ],
              backgroundColor: [
                '#ffa053',
                '#ff5387',
                '#ff5387',
                '#53a3ff',
                '#fff',
                '#53f9ff',
              ],
              categoryPercentage: 1.0,
              barPercentage: 0.33,
            },
            {
              label: 'Goal Missed',
              data: [
                goalCount.f.miss,
                goalCount.c.miss,
                goalCount.k.miss,
                goalCount.p.miss,
                goalCount.e.miss,
                goalCount.w.miss,
              ],
              categoryPercentage: 1.0,
              barPercentage: 0.33,
              backgroundColor: '#222222',
            },
          ],
        });
      };

      chartPerformance();
    }
  }, [data, threshold, carbSettings]);

  // chart options config
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      stacked100: {
        enable: true,
      },
    },
    legend: {
      display: false,
    },
    animation: {
      duration: 1000,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            padding: 10,
            fontColor: '#fff',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: 'rgba(126, 126, 126, 0.3)',
            drawBorder: false,
          },
          ticks: {
            padding: 5,
            fontColor: '#fff',
          },
        },
      ],
    },
  };

  const renderThresholds = () => {
    // pull the keys from the thresholds obj to an array to allow indexing
    let keys = Object.keys(thresholdMapper);

    // remove the value currently being viewed, from the list of options to render

    keys.forEach((key) => {
      if (key === JSON.stringify(threshold.value)) {
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
          key={thresholdMapper[key as ThresholdKeys]}
          className={styling}
          onClick={toggleThreshold}
        >
          {thresholdMapper[key as ThresholdKeys]}
        </li>
      );
    });

    return array;
  };

  return (
    <div className='outer-chart-c'>
      <div className='header-c-3'>
        <div className='left-col'>
          <Tippy
            content={
              <div className='chart-desc-tooltip'>
                This chart displays the % of days that you hit your goals, as
                defined by your diet settings on each day.
                <br />
                <br />
                Accuracy refers to the range of error between your daily totals
                and your diet goals.
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
          <div className='chart-t'>% Of Days Goal Hit</div>
        </div>
        <div className='right-col'>
          <Tippy
            interactive={true}
            content={<ul className='opt-c'>{renderThresholds()}</ul>}
          >
            <div>
              <span className='clickable chart-t'>
                Accuracy {threshold.label}
              </span>
              <span className='dropdown-arrow clickable'>
                <MdArrowDropDown />
              </span>
            </div>
          </Tippy>
        </div>
      </div>
      <div className='chart-c'>
        <HorizontalBar data={chartData} options={options} />
      </div>
    </div>
  );
};

interface Selectors {
  data: TMetrics.Data | '';
  carbSettings: TCarbSettings | undefined;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  data: selectMetricsData,
  carbSettings: selectCarbSettings,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(GoalHitChart);
