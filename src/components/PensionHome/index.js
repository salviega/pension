import { Aside } from '../../shared/Aside'
import { HomeChart } from './HomeChart'
import { HomeForm } from './HomeForm'
import './PensionHome.scss'

function PensionHome () {
  return (
    <div className='home'>
      <div className='home__header'>
        <h1 className='home__title'>Pension system</h1>
        <p className='home__description'>
          calculate an approximate value of the amount you would like to have allocated to your pension based on your age, the
          monetary amount you want to invest monthly and other parameters ...
        </p>
      </div>
      <HomeChart />
      <Aside>
        <HomeForm />
      </Aside>
    </div>
  )
}

export { PensionHome }
