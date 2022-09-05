import './HomeForm.scss';
import { useForm } from '../../../hooks/useForm';
import { useDispatch } from 'react-redux';

import { desactiveSidebarAction, uiUpdateHomeChartAction } from '../../../store/actions/uiAction';
import { getPensionFake } from '../../../utils/getPensionFake';
import { calculatePensionProjection } from '../calculatePensionProjection';

export const HomeForm = () => {
  const dispatch = useDispatch();

  const [values, handleInputChange, reset] = useForm({
    userAge: 0,
    monthlySalary: 0,
    userGender: 'male',
    birthdate: '',
  });

  const { userAge, monthlySalary, userGender, birthdate } = values;

  const handleSubmit = (e) => {
    const resultProjection = calculatePensionProjection(values)

    const dataToChart = resultProjection.coutesTodo.reduce((chartData, currentItem) => {
      chartData.labels.push(currentItem.couteNumber)
      chartData.data.push(currentItem.accumulatedInvestmentFund + currentItem.accumulatedSolidaryFund)
      return chartData
    }, { labels: [], data: [] })

    e.preventDefault();
    dispatch(desactiveSidebarAction());
    dispatch(uiUpdateHomeChartAction(dataToChart));
    reset();
  };

  return (
    <form className="homeform" onSubmit={handleSubmit}>
      <div className="homeform__item">
        <label htmlFor="userAge" className="homeform__label">
          userAge:
        </label>
        <input
          type="number"
          min={0}
          id="userAge"
          className="homeform__input"
          name="userAge"
          value={userAge}
          onChange={handleInputChange}
        />
      </div>
      <div className="homeform__item">
        <label htmlFor="monthlySalary" className="homeform__label">
          Monthly salary:
        </label>
        <input
          type="number"
          min={0}
          name="monthlySalary"
          id="monthlySalary"
          className="homeform__input"
          value={monthlySalary}
          onChange={handleInputChange}
        />
      </div>
      <div className="homeform__item">
        <label htmlFor="birthdate" className="homeform__label">
          Birth date:
        </label>
        <input
          type="date"
          name="birthdate"
          id="birthdate"
          value={birthdate}
          onChange={handleInputChange}
          className="homeform__input"
        />
      </div>
      <div className="homeform__item">
        <label htmlFor="userGender" className="homeform__label">
          userGender:
        </label>
        <select name="userGender" id="userGender" className="homeform__input" value={userGender} onChange={handleInputChange}>
          <option value="male" defaultValue>
            Male
          </option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="homeform__item">
        <input type="submit" value="Calculate" className="homeform__submit" />
      </div>
    </form>
  );
};
