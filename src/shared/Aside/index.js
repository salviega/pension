import './Aside.scss';
import { useDispatch, useSelector } from 'react-redux';
import { activeSidebarAction, desactiveSidebarAction } from '../../store/actions/uiAction';

const Aside = ({ children }) => {
  const { sidebar } = useSelector(({ ui }) => ui);
  const dispatch = useDispatch();

  const handleActive = () => {
    dispatch(activeSidebarAction());
  };
  const handleClose = (e) => {
    e.stopPropagation();
    dispatch(desactiveSidebarAction());
  };
  return (
    <aside
      className={`aside ${sidebar.isActive && 'aside--show'}`}
      onClick={handleActive}
      onFocusCapture={() => {
        console.log('holfddsf');
      }}
    >
      <div className="aside__container">
        <button className="aside__btn" onClick={handleClose}>
          Close
        </button>
        {children}
      </div>
    </aside>
  );
};
export { Aside };
