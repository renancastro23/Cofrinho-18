// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Principal from "./pages/Principal";
import Sobre from "./pages/Sobre";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import EditarPerfil from "./pages/EditarPerfil"; // ⬅️ NOVO

import "./styles/base.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const toggleProfile = () => setProfileOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <Sidebar isOpen={menuOpen} onClose={toggleMenu} onNavigate={closeMenu} />
      <Header onMenuClick={toggleMenu} onProfileClick={toggleProfile} profileOpen={profileOpen} />

      <div style={{ paddingTop: "0.5rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/principal" replace />} />
          <Route path="/principal" element={<Principal />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} /> {/* ⬅️ NOVO */}
          <Route path="*" element={<Navigate to="/principal" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
