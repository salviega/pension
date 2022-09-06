import './Header.scss';
import logo from '../../asserts/images/pension.png';

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header(props) {
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  const [showMenu, setShowMenu] = useState(true);
  const handleShow = () => {
    setShowMenu((show) => !show);
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
            <div className="icon" onClick={handleShow}>
              <div className="icon__item"></div>
              <div className="icon__item"></div>
              <div className="icon__item"></div>
            </div>
            <div className={`main-nav__links ${showMenu && 'main-nav__links--show'}`} onClick={handleShow}>
              <div className="main-nav__container">
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
                {isVerified &&
                  (isRegisted ? (
                    <li className="main-nav__item">
                      <NavLink to="/mypensions" className={({ isActive }) => (isActive ? 'main-nav__link--active' : '')}>
                        My pensions
                      </NavLink>
                    </li>
                  ) : (
                    <li className="main-nav__item">
                      <NavLink to="/register" className={({ isActive }) => (isActive ? 'main-nav__link--active' : '')}>
                        Register
                      </NavLink>
                    </li>
                  ))}

                <li className="main-nav__item">{React.cloneElement(props.children, {})}</li>
              </div>
            </div>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export { Header };
