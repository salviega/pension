import { useSelector, useDispatch } from 'react-redux';
import { closeModalAction, unloadDataModalAction } from '../../store/actions/uiAction';
import './Modal.scss';

export const Modal = () => {
  const dispatch = useDispatch();

  const { modal } = useSelector((state) => state.ui);

  const handleClick = () => {
    dispatch(closeModalAction());
    dispatch(unloadDataModalAction());
  };

  return (
    <article className="Modal" onClick={handleClick}>
      <div className="Container" onClick={(e) => e.stopPropagation()}>
        {modal.data}
      </div>
    </article>
  );
};
