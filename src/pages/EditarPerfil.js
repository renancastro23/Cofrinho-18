import React, { useState } from "react";
import "../styles/EditarPerfil.css";

function EditarPerfil() {
  const [nome, setNome] = useState("Júlia B.");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Informações atualizadas com sucesso!");
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <img
          src="/assets/logo.png" // logo do projeto
          alt="Logo Seu Porquinho"
          className="perfil-logo"
        />

        <h1 className="perfil-titulo">Editar Perfil</h1>

        <div className="perfil-foto-container">
          <img
            src="/assets/avatar.png" // foto do usuário
            alt="Avatar do usuário"
            className="perfil-foto"
          />
          <button className="perfil-alterar-foto">Alterar foto</button>
        </div>

        <form className="perfil-form" onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label htmlFor="senha">Nova senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button type="submit" className="perfil-botao">
            Trocar senha
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarPerfil;
