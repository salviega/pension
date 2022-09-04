import { Aside } from '../../shared/Aside';
import { HomeChart } from './HomeChart';
import { HomeForm } from './HomeForm';
import './PensionHome.scss';

function PensionHome() {
  return (
    <div className="home">
      <div className="home__header">
        <h1 className="home__title">Pension system</h1>
        <p className="home__description">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo nostrum, veniam nobis quis adipisci asperiores
          magnam?
        </p>
      </div>
      <HomeChart />
      <Aside>
        <HomeForm />
      </Aside>
    </div>
  );
}

export { PensionHome };
