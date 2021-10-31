export default function ImagePopup(props) {
  return (
    <div
      className={`popup popup_type_image ${props.isOpen ? 'popup_opened' : ''}`}
      onClick = {props.onClose}
    >
      <figure className="popup__figure" onClick = {(e) => e.stopPropagation()}>
        <button
          type="button"
          className="popup__close-button"
          aria-label="Закрыть окно"
          onClick={props.onClose}
        ></button>
        <img src={props.data.link} alt={props.data.name} className="popup__image"/>
        <figcaption className="popup__caption">{props.data.name}</figcaption>
      </figure>
    </div>
  )
}
