import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Logo from "../assets/logo.png";
import { login } from "../api/cofrinhoApi";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const data = await login({
        email: form.email,
        password: form.password
      });

      // salva usuário logado
      localStorage.setItem("user", JSON.stringify(data));

      // mantém compatibilidade temporária com o restante do sistema
      if (data?.role === "DIRECTOR") {
        localStorage.setItem("C18_DIRECTOR_ID", String(data.id));
        localStorage.setItem("C18_DIRECTOR_EMAIL", data.email || "");
        navigate("/diretor");
        return;
      }

      if (data?.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      if (data?.role === "USER") {
      navigate("/principal");
      return;
      }

      setErro("Perfil sem dashboard configurado.");
    } catch (err) {
      console.error(err);
      const msg = String(err?.message || "").toLowerCase();

      if (msg.includes("inválido") || msg.includes("incorreto") || msg.includes("unauthorized")) {
        setErro("E-mail ou senha incorretos.");
      } else if (msg.includes("inativo")) {
        setErro("Usuário inativo. Procure o administrador.");
      } else {
        setErro("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo-area">
        <img src={Logo} alt="Logo Cofrinho" className="login-logo" />
      </div>

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
              name="password"
              placeholder="Sua senha"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {erro && (
            <div className="login-error" style={{ marginBottom: "12px", color: "#b00020", fontSize: "14px" }}>
              {erro}
            </div>
          )}

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