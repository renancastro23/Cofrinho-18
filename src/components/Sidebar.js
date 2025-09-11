import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  // Fecha com tecla ESC quando o drawer estiver aberto
  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  // Handler único para links: fecha e navega
  const handleLinkClick = () => {
    onNavigate?.();
    onClose?.();
  };

  return (
    <nav className={`sidebar ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <button className="close-icon" onClick={onClose} aria-label="Fechar menu">
        ←
      </button>

      <ul className="sidebar-list">
        <li>
          <NavLink to="/principal" className="link" onClick={handleLinkClick}>
            Seu Porquinho
          </NavLink>
        </li>
        <li>
          <NavLink to="/sobre" className="link" onClick={handleLinkClick}>
            Sobre
          </NavLink>
        </li>
        <li>
          <NavLink to="/quem-somos" className="link" onClick={handleLinkClick}>
            Quem Somos
          </NavLink>
        </li>
        <li>
          <NavLink to="/contato" className="link" onClick={handleLinkClick}>
            Contato
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
