import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function Card(props) {

  const currentUser = useContext(CurrentUserContext);

  return (
    <li className="cards__item">
      {(props.card.owner === currentUser._id) &&
        <button
          type="button"
          className="cards__remove-button"
          aria-label="Удалить карточку"
          onClick = {() => props.onCardDelete(props.card)}
        ></button>
      }
      <img
        src = {props.card.link}
        alt = {props.card.name}
        className="cards__image"
        onClick = {() => props.onCardClick(props.card)}
      />
      <div className="cards__caption">
        <h2 className="cards__image-caption">{props.card.name}</h2>
        <div className="cards__likes">
          <button
            type="button"
            className={`cards__like-button ${(props.card.likes.some(i => i === currentUser._id)) ? 'cards__like-button_active' : ''}`}
            aria-label="Поставить лайк"
            onClick={()=> props.onCardLike(props.card)}
          ></button>
          <span className="cards__likes-number">{props.card.likes.length ? props.card.likes.length : ''}</span>
        </div>
      </div>
    </li>
  )
}
