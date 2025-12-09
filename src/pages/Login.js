import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    senha: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        alert("E-mail ou senha incorretos.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Salva o usuário logado
      localStorage.setItem("usuario", JSON.stringify(data));

      // Redireciona conforme tipo de usuário
      if (data.role === "Admin") {
        navigate("/admin");
      } else if (data.role === "Diretor") {
        navigate("/diretor");
      } else {
        navigate("/principal");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LOGO NO TOPO */}
      <div className="login-logo-area">
        <img src={Logo} alt="Logo Cofrinho" className="login-logo" />
      </div>

      {/* CARD AZUL */}
      <div className="login-card">
        <h1>Bem-vindo de volta</h1>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="senha"
              placeholder="Sua senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="lembrar-me">
            <input id="lembrar" type="checkbox" />
            <label htmlFor="lembrar">Lembrar-me</label>
          </div>

          <button
            type="submit"
            className="btn-laranja"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="criar-conta">
            <span>Ainda não tem acesso?</span>{" "}
            <a href="/contato-institucional">Fale com a gente</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
