import React, { useState } from "react";
import "../styles/Pages.css";

const Contato = () => {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validação simples
    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) {
      setStatus({ type: "error", msg: "Preencha todos os campos." });
      return;
    }
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    if (!emailOk) {
      setStatus({ type: "error", msg: "Informe um e-mail válido." });
      return;
    }

    // aqui você chamaria sua API (fetch/axios). Por ora só simula sucesso:
    setStatus({ type: "success", msg: "Mensagem enviada! Em breve entraremos em contato." });
    setForm({ nome: "", email: "", mensagem: "" });
  };

  return (
    <main className="page">
      <section className="card">
        <h1 className="title">Contato</h1>
        <p>Tem dúvidas, sugestões ou quer falar com a gente? Envie sua mensagem:</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="voce@exemplo.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="mensagem">Mensagem</label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows="5"
              value={form.mensagem}
              onChange={handleChange}
              placeholder="Escreva sua mensagem..."
              required
            />
          </div>

          <button className="btn" type="submit">Enviar</button>

          {status && (
            <div className={`alert ${status.type}`}>
              {status.msg}
            </div>
          )}
        </form>
      </section>
    </main>
  );
};

export default Contato;
