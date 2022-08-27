import './Header.scss';
import logo from '../../asserts/images/pension.png';

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadDataModalAction, openModalAction, closeModalAction, unloadDataModalAction } from '../../store/actions/uiAction';

function Header(props) {
  const dispatch = useDispatch();
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  const navLinks = () => {
    return (
      <div className="main-nav__container" onClick={handleCloseModal}>
        <li className="main-nav__item">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'main-nav__link--active' : '')}>
            Home
          </NavLink>
        </li>
        <li className="main-nav__item">
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'main-nav__link--active' : '')}>
            About
          </NavLink>
        </li>
        {isVerified && isRegisted && (
          <li className="main-nav__item">
            <NavLink to="/mypensions" className={({ isActive }) => (isActive ? 'main-nav__link--active' : '')}>
              My pensions
            </NavLink>
          </li>
        )}
        {isVerified && isRegisted && (
          <li className="main-nav__item">
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'main-nav__link--active' : '')}>
              Register
            </NavLink>
          </li>
        )}
        <li className="main-nav__item">{React.cloneElement(props.children, {})}</li>
      </div>
    );
  };

  const handleCloseModal = () => {
    dispatch(closeModalAction());
    dispatch(unloadDataModalAction());
  };

  const handleShowLinks = () => {
    dispatch(loadDataModalAction(navLinks()));
    dispatch(openModalAction());
  };

  return (
    <header className="Header">
      <nav>
        <ul className="main-nav">
          <figure className="main-nav__logo">
            <NavLink to="/" className={({ isActive }) => (isActive ? '' : 'isActive')}>
              <img src={logo} alt="logo" />
              <figcaption>Pension</figcaption>
            </NavLink>
          </figure>
          <div className="main-nav__rigth">
            <div className="icon" onClick={handleShowLinks}>
              <div className="icon__item"></div>
              <div className="icon__item"></div>
              <div className="icon__item"></div>
            </div>
            <div className="main-nav__links">{navLinks()}</div>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export { Header };
