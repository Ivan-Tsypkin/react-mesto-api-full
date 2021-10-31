import { useState } from 'react';


export default function Login({ onLoginSubmit }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLoginSubmit(password, email);
  }

  return (
    <div className="login">
      <h3 className="login__heading">Вход</h3>
      <form className={`login__form`} onSubmit = {handleSubmit}>

        <input
          type="email"
          className="login__form-item"
          placeholder="E-mail"
          name="email"
          id="email"
          required
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="login__form-item"
          placeholder="Пароль"
          name="password"
          id="password"
          required
          value={password || ''}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="login__submit-button"
          aria-label="Отправить данные"
        >Войти</button>

      </form>
    </div>
  )
}
