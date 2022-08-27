import { useSelector, useDispatch } from "react-redux";
import {
  closeModalAction,
  unloadDataModalAction,
} from "../../store/actions/uiAction";
import "./Modal.scss";

export const Modal = () => {
  const dispatch = useDispatch();

  const { modal } = useSelector((state) => state.ui);

  const handleClick = () => {
    dispatch(closeModalAction());
    dispatch(unloadDataModalAction());
  };

  return (
    <article className="modal">
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        <div class="modal__outer" onClick={handleClick} />
        {modal.data}
      </div>
    </article>
  );
};
