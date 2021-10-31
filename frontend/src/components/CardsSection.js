export default function CardsSection(props) {
  return (
    <section className="cards">
      <ul className="cards__list">
        {props.children}
      </ul>
    </section>
  )
}
