import React, { useState } from "react";
import "../styles/Contato.css";

function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  return (
    <div className="contato-container">
      <div className="contato-card">
        <img
          src="/assets/logo.png" // substitua pelo logo do Seu Porquinho
          alt="Logo Seu Porquinho"
          className="contato-logo"
        />

        <h1 className="contato-titulo">
          📣 Entre em contato com nossa equipe!
        </h1>

        <form className="contato-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="assunto"
            placeholder="Assunto"
            value={formData.assunto}
            onChange={handleChange}
          />

          <textarea
            name="mensagem"
            placeholder="Mensagem"
            rows="4"
            value={formData.mensagem}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="contato-botao">
            Enviar mensagem →
          </button>
        </form>

        <p className="contato-info">
          Responderemos o mais rápido possível. Obrigado por fazer parte do{" "}
          <strong>Seu Porquinho!</strong>
        </p>
      </div>

      <div className="dica-card">
        <h2>Dica do Dia</h2>
        <p>💬 Sua opinião nos ajuda a crescer!</p>
      </div>
    </div>
  );
}

export default Contato;
