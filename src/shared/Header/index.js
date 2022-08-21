import './Header.scss'

function Header(props) {
  return(
    <header>
      <nav>
        <ul className='main-nav'>
          <figure className='main-nav__logo'>
            <img src='./assets/images/pension.png' alt='logo' />
          </figure>
          <li className='main-nav__item'>
            <a href='./' >Home</a>
          </li>
          <li className='main-nav__item'>
            <a href='/deposit' >
              Deposit
            </a>
          <li className='main-nav__item'>
            <a href='/address' >
                My pension
            </a>
          </li>
          </li>
          <li className='main-nav__item'>
            {props.children}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export { Header }