import './CardItem.scss';

export const CardItem = ({ description, img, name, role }) => {
  const cupString = (str = '', lenght) => (str.length > lenght ? str.slice(0, lenght) + '...' : str);

  const handleModal = () => {
    console.log('hola');
  };
  
  return (
    <section className="Card" style={{ backgroundImage: `url(${img})` }} onClick={handleModal}>
      <div className="Card__layer">
        <div className="Card__info">
          <p className="Card__name">{cupString(name, 25)}</p>
          <em className="Card__role">{cupString(role, 25)}</em>
        </div>
      </div>
    </section>
  );
};
