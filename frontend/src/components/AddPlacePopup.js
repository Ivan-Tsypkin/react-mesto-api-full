import { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';


export default function AddPlacePopup(props) {

  const [link, setLink] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    setLink('');
    setName('')
  }, [props.isOpen])

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({
      link,
      name
    });
  }

  return (
    <PopupWithForm
      name="new-card"
      title="Новое место"
      isOpen = {props.isOpen}
      onClose = {props.onClose}
      buttonText="Создать"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="popup__form-item popup__form-item_value_pic-name"
        placeholder="Название"
        name="picName"
        id="pic-name"
        minLength="2"
        maxLength="30"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <span className="pic-name-error popup__form-error-msg"></span>
      <input
        type="url"
        className="popup__form-item popup__form-item_value_link"
        placeholder="Ссылка на картинку"
        name="picLink"
        id="pic-link"
        required
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <span className ="pic-link-error popup__form-error-msg popup__form-error-msg_pos_bottom"></span>
    </PopupWithForm>
  )
}
