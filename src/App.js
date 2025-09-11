// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";            // ⬅️ NOVO
import Login from "./pages/Login";
import Principal from "./pages/Principal";
import Sobre from "./pages/Sobre";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import EditarPerfil from "./pages/EditarPerfil";

import "./styles/base.css";

const Protected = ({ isAuth, children }) => {
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};

const Layout = ({ isAuth, menuOpen, closeMenu, toggleMenu, toggleProfile, profileOpen }) => {
  const location = useLocation();
  const path = location.pathname;
  const hideChrome = path === "/login" || path === "/home"; // ⬅️ oculta header/sidebar também na Home

  if (hideChrome || !isAuth) return null;

  return (
    <>
      <Sidebar isOpen={menuOpen} onClose={closeMenu} onNavigate={closeMenu} />
      <Header
        onMenuClick={() => toggleMenu((v) => !v)}
        onProfileClick={() => toggleProfile((v) => !v)}
        profileOpen={profileOpen}
      />
    </>
  );
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("auth") === "true");

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = (updater) => setMenuOpen(typeof updater === "function" ? updater : !!updater);
  const toggleProfile = (updater) => setProfileOpen(typeof updater === "function" ? updater : !!updater);

  useEffect(() => {
    const updateAuth = () => setIsAuth(localStorage.getItem("auth") === "true");
    window.addEventListener("storage", updateAuth);
    window.addEventListener("auth-changed", updateAuth);
    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("auth-changed", updateAuth);
    };
  }, []);

  return (
    <Router>
      <Layout
        isAuth={isAuth}
        menuOpen={menuOpen}
        closeMenu={closeMenu}
        toggleMenu={toggleMenu}
        toggleProfile={toggleProfile}
        profileOpen={profileOpen}
      />

      <div style={{ paddingTop: !isAuth ? 0 : "0.5rem" }}>
        <Routes>
          {/* Se logado, vá para /principal; senão, para /home */}
          <Route path="/" element={<Navigate to={isAuth ? "/principal" : "/home"} replace />} />

          {/* Públicas */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protegidas */}
          <Route path="/principal" element={<Protected isAuth={isAuth}><Principal /></Protected>} />
          <Route path="/sobre" element={<Protected isAuth={isAuth}><Sobre /></Protected>} />
          <Route path="/quem-somos" element={<Protected isAuth={isAuth}><QuemSomos /></Protected>} />
          <Route path="/contato" element={<Protected isAuth={isAuth}><Contato /></Protected>} />
          <Route path="/editar-perfil" element={<Protected isAuth={isAuth}><EditarPerfil /></Protected>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuth ? "/principal" : "/home"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}
