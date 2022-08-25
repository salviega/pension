import './Header.scss';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Header(props) {
  const [isRegisted, setIsRegisted] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {}, []);

  return (
    <header className="Header">
      <nav>
        <ul className="main-nav">
          <figure className="main-nav__logo">
            <img src="./assets/images/pension.png" alt="logo" />
            <figcaption>Pension</figcaption>
          </figure>
          <li className="main-nav__item">
            <NavLink to="/" className={({ isActive }) => (isActive && 'active')}>
              Home
            </NavLink>
          </li>
          <li className="main-nav__item">
            <NavLink to="/about" className={({ isActive }) => (isActive && 'active')}>
              About
            </NavLink>
          </li>
          {isVerified && !isRegisted && (
            <li className="main-nav__item">
              <NavLink to="/contribute" className={({ isActive }) => (isActive && 'active')}>
                Contribute
              </NavLink>
            </li>
          )}
          {isVerified && isRegisted && (
            <li className="main-nav__item">
              <NavLink to="/mypension" className={({ isActive }) => (isActive && 'active')}>
                My pension
              </NavLink>
            </li>
          )}
          {isVerified && !isRegisted && (
            <li className="main-nav__item">
              <NavLink to="/register" className={({ isActive }) => (isActive && 'active')}>
                Register
              </NavLink>
            </li>
          )}
          <li className="main-nav__item">{React.cloneElement(props.children, { setIsRegisted, setIsVerified })}</li>
        </ul>
      </nav>
    </header>
  );
}

export { Header };
