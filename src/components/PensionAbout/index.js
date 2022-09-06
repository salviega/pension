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
          We are a group of developers focused on solving problems through the development of software programs that can meet the
          needs in some aspect of society that has not yet been resolved and is persistent.
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
