import React, { useState } from "react";
import "../styles/Login.css";
import Logo from "../assets/logo.png"

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Login efetuado com o e-mail: ${email}`);
  };

  return (
    <div className="login-container">
      {/* ===== LOGO FORA DO CARD ===== */}
      <div className="login-logo-area">
        <img src= {Logo} alt="Logo Seu Porquinho" className="login-logo" />
      </div>

      {/* ===== CARD DE LOGIN ===== */}
      <div className="login-card">
        <h1>Bem-vindo de volta!</h1>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="lembrar-me">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={() => setLembrar(!lembrar)}
              id="lembrar"
            />
            <label htmlFor="lembrar">Lembrar-me</label>
          </div>

          <button type="submit" className="btn-laranja">
            Entrar
          </button>
        </form>

        <p className="criar-conta">
          Ainda não tem uma conta?{" "}
          <a href="/contato">Crie a sua agora</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
