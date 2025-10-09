import "../styles/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email || email.trim() === "") {
      errs.email = "O e-mail é obrigatório.";
    } else if (!email.includes("@")) {
      errs.email = "O e-mail precisa conter @.";
    }

    if (!senha || senha.trim() === "") {
      errs.senha = "A senha é obrigatória.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Se passar na validação, navega para /principal
    navigate("/principal");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="/assets/logo.png" // substitua pelo logo do Seu Porquinho
          alt="Logo Seu Porquinho"
          className="login-logo"
        />

        <h1 className="login-title">Bem-vindo de volta!</h1>

  <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="visually-hidden">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="senha" className="visually-hidden">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              className="login-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {errors.senha && <div className="field-error">{errors.senha}</div>}
          </div>

          <div className="remember-me">
            <input type="checkbox" id="lembrar" />
            <label htmlFor="lembrar">Lembrar-me</label>
          </div>

          <button type="submit" className="login-button" >
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
