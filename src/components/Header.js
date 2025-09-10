// src/components/Header.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ onMenuClick, onProfileClick, profileOpen }) => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const load = () => setAvatar(localStorage.getItem("profilePhoto"));
    load();
    const onUpdate = () => load();
    window.addEventListener("storage", onUpdate);
    window.addEventListener("profile-updated", onUpdate);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("profile-updated", onUpdate);
    };
  }, []);

  const goEdit = () => {
    navigate("/editar-perfil");
    // fecha o dropdown se estiver aberto
    if (onProfileClick) onProfileClick();
  };

  const style = avatar
    ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "transparent" }
    : {};

  return (
    <header className="header">
      <button className="menu-icon" onClick={onMenuClick} aria-label="Abrir menu">☰</button>

      <div className="profile-container">
        <button className="profile-icon" style={style} onClick={onProfileClick} aria-haspopup="true" aria-expanded={profileOpen} />
        {profileOpen && (
          <div className="profile-dropdown" role="menu">
            <button className="profile-item" onClick={goEdit}>Editar Perfil</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

