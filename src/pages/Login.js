import React from "react";
import "../styles/Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="/assets/logo.png" // substitua pelo logo do Seu Porquinho
          alt="Logo Seu Porquinho"
          className="login-logo"
        />

        <h1 className="login-title">Bem-vindo de volta!</h1>

        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="visually-hidden">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha" className="visually-hidden">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              className="login-input"
            />
          </div>

          <div className="remember-me">
            <input type="checkbox" id="lembrar" />
            <label htmlFor="lembrar">Lembrar-me</label>
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>

          <p className="login-footer">
            Ainda não tem uma conta?{" "}
            <a href="#" className="create-account">
              Crie a sua agora
            </a>
          </p>
        </form>
      </div>

      <img
        src="/assets/porquinho.png" // imagem do seu porquinho mascote
        alt="Porquinho mascote"
        className="login-pig"
      />
    </div>
  );
}

export default Login;
