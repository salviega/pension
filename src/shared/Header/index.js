import './Header.scss'
import React from 'react'
import { NavLink } from 'react-router-dom'

function Header(props) {
  const [isRegisted, setIsRegisted] = React.useState(false)
  const [isVerified, setIsVerified] = React.useState(false)

  React.useEffect(() => {

  }, [])

  return(
    <header className='Header'>
      <nav>
        <ul className='main-nav'>
          <figure className='main-nav__logo'>
            <img src='./assets/images/pension.png' alt='logo' />
            <figcaption>Pension</figcaption>
          </figure>
          <li className='main-nav__item'>
            <NavLink to='/' >Home</NavLink>
          </li>
          <li className='main-nav__item'>
            <NavLink to='/about' >About</NavLink>
          </li>
          {isVerified && !isRegisted && <li className='main-nav__item'>
            <NavLink to='/contribute' >
              Contribute
            </NavLink>
          </li>}
          {isVerified && isRegisted  && <li className='main-nav__item'>
            <NavLink to='/mypension' >
                My pension
            </NavLink>
          </li>}
          {isVerified && !isRegisted && <li className='main-nav__item'>
            <NavLink to='/register' >
                Register
            </NavLink>
          </li>}
          <li className='main-nav__item'>
            {React.cloneElement(props.children, {setIsRegisted, setIsVerified})}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export { Header }