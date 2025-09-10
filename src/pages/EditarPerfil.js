// src/pages/EditarPerfil.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";

const EditarPerfil = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);      // DataURL da imagem
  const [status, setStatus] = useState(null);    // mensagens de feedback

  // Carrega dados salvos (se existirem)
  useEffect(() => {
    const savedName = localStorage.getItem("profileName") || "";
    const savedPhoto = localStorage.getItem("profilePhoto");
    setName(savedName);
    setPhoto(savedPhoto);
  }, []);

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", msg: "Selecione um arquivo de imagem." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const onRemovePhoto = () => {
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus({ type: "error", msg: "Informe um nome." });
      return;
    }
    localStorage.setItem("profileName", name.trim());
    if (photo) localStorage.setItem("profilePhoto", photo);
    else localStorage.removeItem("profilePhoto");

    // avisa o Header para recarregar avatar
    window.dispatchEvent(new Event("profile-updated"));

    setStatus({ type: "success", msg: "Perfil atualizado com sucesso!" });

    // Volta para a página principal após um pequeno feedback
    setTimeout(() => navigate("/principal"), 600);
  };

  return (
    <main className="page ep-page">
      <section className="card ep-card">
        <h1 className="title">Editar Perfil</h1>

        <form className="ep-form" onSubmit={onSave}>
          {/* Avatar */}
          <div className="ep-avatar-wrap">
            <div className={`ep-avatar ${photo ? "has-photo" : ""}`} style={photo ? { backgroundImage: `url(${photo})` } : {}}>
              {!photo && <span className="ep-avatar-initial">{name?.charAt(0)?.toUpperCase() || "?"}</span>}
            </div>
            <div className="ep-avatar-actions">
              <button type="button" className="btn" onClick={onPickFile}>Trocar foto</button>
              {photo && <button type="button" className="btn alt" onClick={onRemovePhoto}>Remover foto</button>}
              <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} hidden />
            </div>
          </div>

          {/* Nome */}
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Ações */}
          <div className="ep-actions">
            <button className="btn" type="submit">Salvar alterações</button>
            <button className="btn ghost" type="button" onClick={() => navigate(-1)}>Cancelar</button>
          </div>

          {status && <div className={`alert ${status.type}`}>{status.msg}</div>}
        </form>
      </section>
    </main>
  );
};

export default EditarPerfil;
