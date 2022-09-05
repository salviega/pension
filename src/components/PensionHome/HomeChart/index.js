import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { AreaChart } from '../../charts/AreaChart';
import { activeSidebarAction } from '../../../store/actions/uiAction';

import './HomeChart.scss';

export const HomeChart = () => {
  const dispatch = useDispatch();
  const { homeChart } = useSelector(({ ui }) => ui);

  const handleClick = () => {
    dispatch(activeSidebarAction());
  };

  return (
    <div className="homechart">
      <div className="homechart__chart">
        <AreaChart {...homeChart} />
      </div>
      <button className="homechart__btn" onClick={handleClick}>
        Calculate Pention
      </button>
    </div>
  );
};
