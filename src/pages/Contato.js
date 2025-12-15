import React, { useState } from "react";
import "../styles/Contato.css";
import Logo from "../assets/logo.png";

function Contato() {
  const [tipoContato, setTipoContato] = useState("institucional");
  
  // Estado para formulário INSTITUCIONAL
  const [formInstitucional, setFormInstitucional] = useState({
    instituicao: "",
    representante: "",
    tipo: "",
    email: "",
    whatsapp: "",
    mensagem: "",
  });

  // Estado para formulário de SUPORTE
  const [formSuporte, setFormSuporte] = useState({
    nomeResponsavel: "",
    cpfResponsavel: "",
    nomeCrianca: "",
    matricula: "",
    mensagem: "",
  });

  // Handlers para cada formulário
  const handleChangeInstitucional = (e) => {
    setFormInstitucional({ ...formInstitucional, [e.target.name]: e.target.value });
  };

  const handleChangeSuporte = (e) => {
    setFormSuporte({ ...formSuporte, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (tipoContato === "institucional") {
    // FORMULÁRIO INSTITUCIONAL - Backend automático
    try {
      const response = await fetch('http://localhost:5000/api/institutional', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify(formInstitucional)
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Email enviado com sucesso! Entraremos em contato em breve.");
        setFormInstitucional({ 
          instituicao: "", 
          representante: "", 
          tipo: "", 
          email: "", 
          whatsapp: "", 
          mensagem: "" 
        });
      } else {
        alert("Erro ao enviar email: " + data.message);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
    
  } else {
    // FORMULÁRIO SUPORTE - WhatsApp (JÁ FUNCIONA)
    try {
      const response = await fetch('http://localhost:5000/api/SupUser', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify(formSuporte)
      });

      const data = await response.json();
      
      if (data.success) {
        window.open(data.whatsappUrl, '_blank');
        alert("Redirecionando para WhatsApp...");
        setFormSuporte({ 
          nomeResponsavel: "", 
          cpfResponsavel: "", 
          nomeCrianca: "", 
          matricula: "", 
          mensagem: "" 
        });
      } else {
        alert("Erro ao preparar mensagem para WhatsApp");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
  }
};
  return (
    <div className="contato-container">
      {/* LOGO */}
      <div className="contato-logo-area">
        <img src={Logo} alt="Logo Cofrinho dos 18" className="contato-logo" />
      </div>

      {/* CARD DE CONTATO */}
      <div className="contato-card">
        <h1>Entre em contato conosco!</h1>

        {/* SELETOR DE TIPO DE CONTATO - APENAS 2 OPÇÕES */}
        <div className="tipo-contato-selector">
          <button 
            className={`tipo-btn ${tipoContato === "institucional" ? "ativo" : ""}`}
            onClick={() => setTipoContato("institucional")}
          >
            🏫 Institucional
          </button>
          <button 
            className={`tipo-btn ${tipoContato === "suporte" ? "ativo" : ""}`}
            onClick={() => setTipoContato("suporte")}
          >
            💬 Suporte
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contato-form">
          {/* FORMULÁRIO INSTITUCIONAL */}
          {tipoContato === "institucional" && (
            <>
              <input
                type="text"
                name="instituicao"
                placeholder="Nome da Instituição"
                value={formInstitucional.instituicao}
                onChange={handleChangeInstitucional}
                required
              />

              <input
                type="text"
                name="representante"
                placeholder="Nome do Representante"
                value={formInstitucional.representante}
                onChange={handleChangeInstitucional}
                required
              />

              <select
                name="tipo"
                value={formInstitucional.tipo}
                onChange={handleChangeInstitucional}
                required
              >
                <option value="">Tipo de Instituição</option>
                <option value="Pública">Pública</option>
                <option value="Privada">Privada</option>
                <option value="Conveniada">Conveniada</option>
              </select>

              <input
                type="email"
                name="email"
                placeholder="E-mail institucional"
                value={formInstitucional.email}
                onChange={handleChangeInstitucional}
                required
              />

              <input
                type="tel"
                name="whatsapp"
                placeholder="WhatsApp para contato"
                value={formInstitucional.whatsapp}
                onChange={handleChangeInstitucional}
              />

              <textarea
                name="mensagem"
                placeholder="Conte-nos sobre sua instituição, objetivos e demandas..."
                rows="4"
                value={formInstitucional.mensagem}
                onChange={handleChangeInstitucional}
                required
              ></textarea>
            </>
          )}

          {/* FORMULÁRIO SUPORTE */}
          {tipoContato === "suporte" && (
            <>
              <input
                type="text"
                name="nomeResponsavel"
                placeholder="Nome do responsável"
                value={formSuporte.nomeResponsavel}
                onChange={handleChangeSuporte}
                required
              />

              <input
                type="text"
                name="cpfResponsavel"
                placeholder="CPF do responsável"
                value={formSuporte.cpfResponsavel}
                onChange={handleChangeSuporte}
                required
              />

              <input
                type="text"
                name="nomeCrianca"
                placeholder="Nome da criança"
                value={formSuporte.nomeCrianca}
                onChange={handleChangeSuporte}
                required
              />

              <input
                type="text"
                name="matricula"
                placeholder="Matrícula da criança"
                value={formSuporte.matricula}
                onChange={handleChangeSuporte}
                required
              />

              <textarea
                name="mensagem"
                placeholder="Descreva seu problema ou dúvida"
                rows="4"
                value={formSuporte.mensagem}
                onChange={handleChangeSuporte}
                required
              ></textarea>
            </>
          )}

          <button type="submit" className="btn-laranja">
            {tipoContato === "institucional" ? "Abrir Email →" : "Solicitar suporte →"}
          </button>
        </form>

        <p className="contato-info">
          {tipoContato === "institucional" 
            ? "Seu cliente de email abrirá automaticamente. Obrigado pelo interesse no Cofrinho dos 18!"
            : "Entraremos em contato via WhatsApp em breve. Obrigado por fazer parte do Cofrinho dos 18!"
          }
        </p>
      </div>
    </div>
  );
}

export default Contato;