import './Header.scss';
import logo from '../../asserts/images/pension.png';

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header(props) {
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

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
            <li className="main-nav__item">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
            </li>
            <li className="main-nav__item">
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                About
              </NavLink>
            </li>
            {isVerified && isRegisted && (
              <li className="main-nav__item">
                <NavLink to="/mypensions" className={({ isActive }) => (isActive ? 'active' : '')}>
                  My pensions
                </NavLink>
              </li>
            )}
            {isVerified && isRegisted && (
              <li className="main-nav__item">
                <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Register
                </NavLink>
              </li>
            )}
            <li className="main-nav__item">{React.cloneElement(props.children, {})}</li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export { Header };
