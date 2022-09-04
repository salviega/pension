import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CardItem } from './Card/CardItem';

import './PensionAbout.scss';
import data_team from '../../asserts/json/team-data.json';

function PensionAbout() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards(data_team);
  }, []);

  return (
    <div className="About">
      <div className="About__header">
        <h1 className="About__title">About Us</h1>
        <p className="About__description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit corrupti recusandae perspiciatis dolor voluptas
          veniam, odit ut impedit, ullam pariatur provident doloremque quibusdam laboriosam minus illo iusto in ducimus atque.
        </p>
      </div>
      <article className="About__body">
        {cards.map((item) => (
          <CardItem key={uuidv4()} {...item} />
        ))}
      </article>
    </div>
  );
}

export { PensionAbout };
