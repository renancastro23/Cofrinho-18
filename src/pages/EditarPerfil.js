import React, { useState } from "react";
import "../styles/EditarPerfil.css";
import Logo from "../assets/logo.png"

function EditarPerfil() {
  const [nome, setNome] = useState("Júlia B.");
  const [senha, setSenha] = useState("");
  const [foto, setFoto] = useState("/assets/avatar.png");

  const handleTrocarSenha = (e) => {
    e.preventDefault();
    alert("Senha atualizada com sucesso!");
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="editar-container">
      {/* ===== LOGO ===== */}
      <div className="editar-logo-area">
        <img src= {Logo} alt="Logo Seu Porquinho" className="editar-logo" />
      </div>

      {/* ===== CARD DO PERFIL ===== */}
      <div className="editar-card">
        <h1>Editar Perfil</h1>

        {/* Avatar e botão de alterar foto */}
        <div className="perfil-foto-container">
          <img src={foto} alt="Avatar do usuário" className="perfil-foto" />
          <label htmlFor="input-foto" className="btn-alterar-foto">
            Alterar foto
          </label>
          <input
            id="input-foto"
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Formulário */}
        <form onSubmit={handleTrocarSenha} className="editar-form">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Nova senha</label>
          <input
            type="password"
            placeholder="Digite a nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button type="submit" className="btn-laranja">
            Trocar senha
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarPerfil;
