import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const handleClick = () => {
    // fecha o drawer quando navegar
    if (onNavigate) onNavigate();
  };

  return (
    <nav className={`sidebar ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <button className="close-icon" onClick={onClose} aria-label="Fechar menu">←</button>

      <ul className="sidebar-list">
        <li>
          <NavLink to="/principal" className="link" onClick={handleClick}>
            Seu Porquinho
          </NavLink>
        </li>
        <li>
          <NavLink to="/sobre" className="link" onClick={handleClick}>
            Sobre
          </NavLink>
        </li>
        <li>
          <NavLink to="/quem-somos" className="link" onClick={handleClick}>
            Quem Somos
          </NavLink>
        </li>
        <li>
          <NavLink to="/contato" className="link" onClick={handleClick}>
            Contato
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
