import { Aside } from '../../shared/Aside';
import { HomeForm } from './HomeForm';
import './PensionHome.scss';

function PensionHome() {
  return (
    <div className="home">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa iure nihil porro quisquam, explicabo saepe ad cum et
        libero magnam, adipisci eveniet dolores! Aliquid, aspernatur numquam ut reprehenderit quasi impedit.
      </p>

      <Aside>
        <HomeForm />
      </Aside>
    </div>
  );
}

export { PensionHome };
