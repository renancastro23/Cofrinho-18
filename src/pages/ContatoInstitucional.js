import React, { useState } from "react";
import "../styles/ContatoInstitucional.css";

function ContatoInstitucional() {
  const [formData, setFormData] = useState({
    instituicao: "",
    representante: "",
    tipo: "",
    email: "",
    whatsapp: "",
    mensagem: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const assunto = encodeURIComponent("Solicitação de Orçamento");
    const corpo = encodeURIComponent(
      `Nome da Instituição: ${formData.instituicao}\n` +
      `Nome do Representante: ${formData.representante}\n` +
      `Tipo de Instituição: ${formData.tipo}\n` +
      `E-mail: ${formData.email}\n` +
      `WhatsApp: ${formData.whatsapp}\n` +
      `Mensagem: ${formData.mensagem}`
    );

    // Abre o cliente de e-mail padrão
    window.location.href = `mailto:contato@seudominio.com?subject=${assunto}&body=${corpo}`;
  };

  return (
    <div className="institucional-container">
      <div className="institucional-card">
        <h1 className="institucional-titulo">Contato Institucional</h1>
        <p className="institucional-descricao">
          Esta é a forma oficial para uma <strong>instituição de ensino</strong> entrar em contato com nossa equipe.
          <br />
          Preencha os campos e clique em enviar — seu cliente de e-mail abrirá automaticamente.
        </p>

        <form className="institucional-form" onSubmit={handleSubmit}>
          <label>Nome da Instituição</label>
          <input
            type="text"
            name="instituicao"
            placeholder="Ex: Escola Municipal ABC"
            value={formData.instituicao}
            onChange={handleChange}
            required
          />

          <label>Nome do Representante</label>
          <input
            type="text"
            name="representante"
            placeholder="Ex: Maria Silva"
            value={formData.representante}
            onChange={handleChange}
            required
          />

          <label>Tipo de Instituição</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Pública">Pública</option>
            <option value="Privada">Privada</option>
            <option value="Conveniada">Conveniada</option>
          </select>

          <label>E-mail</label>
          <input
            type="email"
            name="email"
            placeholder="contato@instituicao.com.br"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>WhatsApp</label>
          <input
            type="tel"
            name="whatsapp"
            placeholder="(00) 00000-0000"
            value={formData.whatsapp}
            onChange={handleChange}
          />

          <label>Mensagem</label>
          <textarea
            name="mensagem"
            rows="4"
            placeholder="Conte-nos sobre sua instituição, objetivos e demandas..."
            value={formData.mensagem}
            onChange={handleChange}
          ></textarea>

          <button type="submit" className="institucional-botao">
            Enviar
          </button>
        </form>
      </div>

      <div className="dica-card">
        <h2>Dica do Dia</h2>
        <p>💧 Preserve os recursos do planeta!</p>
      </div>
    </div>
  );
}

export default ContatoInstitucional;
