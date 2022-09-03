import './HomeForm.scss';
import { useForm } from '../../../hooks/useForm';
import { useDispatch } from 'react-redux';

import { desactiveSidebarAction } from '../../../store/actions/uiAction';

export const HomeForm = () => {
  const dispatch = useDispatch();
  const [values, handleInputChange, reset] = useForm({
    age: 0,
    monthlyContribution: 0,
    sex: 'male',
  });

  const { age, monthlyContribution, sex } = values;
  const handleSubmit = (e) => {
    console.log(values);
    e.preventDefault();
    dispatch(desactiveSidebarAction());
    reset();
  };

  return (
    <form className="homeform" onSubmit={handleSubmit}>
      <div className="homeform__item">
        <label htmlFor="age" className="homeform__label">
          Age:
        </label>
        <input type="number" min={0} id="age" className="homeform__input" name="age" value={age} onChange={handleInputChange} />
      </div>
      <div className="homeform__item">
        <label htmlFor="monthlyContribution" className="homeform__label">
          Monthly contribution:
        </label>
        <input
          type="number"
          min={0}
          name="monthlyContribution"
          id="monthlyContribution"
          className="homeform__input"
          value={monthlyContribution}
          onChange={handleInputChange}
        />
      </div>
      <div className="homeform__item">
        <label htmlFor="sex" className="homeform__label">
          Sex:
        </label>
        <select name="sex" id="sex" className="homeform__input" value={sex} onChange={handleInputChange}>
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
