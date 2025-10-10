import React, { useState } from "react";
import "../styles/Contato.css";
import Logo from "../assets/logo.png"


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
      {/* ===== LOGO FORA DO CARD ===== */}
      <div className="contato-logo-area">
        <img
          src= {Logo}
          alt="Logo Seu Porquinho"
          className="contato-logo"
        />
      </div>

      {/* ===== CARD DE CONTATO ===== */}
      <div className="contato-card">
        <h1>Entre em contato com nossa equipe!</h1>

        <form onSubmit={handleSubmit} className="contato-form">
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
            required
          />

          <textarea
            name="mensagem"
            placeholder="Mensagem"
            rows="4"
            value={formData.mensagem}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="btn-laranja">
            Enviar mensagem →
          </button>
        </form>

        <p className="contato-info">
          Responderemos o mais rápido possível. Obrigado por fazer parte do{" "}
          <strong>Cofrinho dos 18!</strong>
        </p>
      </div>
    </div>
  );
}

export default Contato;
