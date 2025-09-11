// src/components/Header.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ onMenuClick, onProfileClick, profileOpen }) => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  // Carrega avatar salvo e escuta atualizações
  useEffect(() => {
    const loadAvatar = () => {
      const stored = localStorage.getItem("profilePhoto");
      setAvatar(stored || null);
    };
    loadAvatar();

    const onUpdate = () => loadAvatar();
    window.addEventListener("storage", onUpdate);
    window.addEventListener("profile-updated", onUpdate);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("profile-updated", onUpdate);
    };
  }, []);

  const goEdit = () => {
    navigate("/editar-perfil");
    if (onProfileClick) onProfileClick(false); // fecha dropdown
  };

  const doLogout = () => {
    localStorage.removeItem("auth");
    window.dispatchEvent(new Event("auth-changed")); // avisa o App
    navigate("/login", { replace: true });
  };

  const avatarStyle = avatar
    ? {
        backgroundImage: `url(${avatar})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "transparent",
      }
    : {};

  return (
    <header className="header">
      <button className="menu-icon" onClick={onMenuClick} aria-label="Abrir menu">
        ☰
      </button>

      <div className="profile-container">
        <button
          className="profile-icon"
          style={avatarStyle}
          onClick={() => onProfileClick && onProfileClick((v) => !v)}
          aria-haspopup="true"
          aria-expanded={!!profileOpen}
          aria-label="Abrir menu do perfil"
        />
        {profileOpen && (
          <div className="profile-dropdown" role="menu">
            <button className="profile-item" onClick={goEdit}>
              Editar Perfil
            </button>
            <button className="profile-item" onClick={doLogout}>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


