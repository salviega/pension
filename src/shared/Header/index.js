import './Header.scss'
import React from 'react'

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
            <a href='./' >Home</a>
          </li>
          <li className='main-nav__item'>
            <a href='./about' >About</a>
          </li>
          {isVerified && isRegisted && <li className='main-nav__item'>
            <a href='/contribute' >
              Contribute
            </a>
          </li>}
          {isVerified && isRegisted  && <li className='main-nav__item'>
            <a href='/mypension' >
                My pension
            </a>
          </li>}
          {isVerified && !isRegisted && <li className='main-nav__item'>
            <a href='/register' >
                Register
            </a>
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