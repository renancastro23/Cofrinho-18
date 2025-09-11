import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    if (!emailOk) return setStatus({ type: "error", msg: "Informe um e-mail válido." });
    if (!form.senha.trim()) return setStatus({ type: "error", msg: "Informe sua senha." });

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("auth", "true");
      window.dispatchEvent(new Event("auth-changed")); // 🔹 avisa o App

      setLoading(false);
      navigate("/principal", { replace: true });
    }, 500);
  };

  return (
    <main className="login-wrap">
      <section className="login-card">
        <h1>Login</h1>
        <form className="login-form" onSubmit={onSubmit}>
          <div className="field">
            <label>E-mail</label>
            <input name="email" type="email" value={form.email} onChange={onChange} />
          </div>
          <div className="field">
            <label>Senha</label>
            <input name="senha" type="password" value={form.senha} onChange={onChange} />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {status && <div className={`alert ${status.type}`}>{status.msg}</div>}
        </form>
      </section>
    </main>
  );
};

export default Login;
