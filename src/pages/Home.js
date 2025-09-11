// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home">
      {/* Topbar simples com botão de Login à direita */}
      <header className="home-topbar">
        <div className="brand">
          <div className="logo">🐷</div>
          <span className="name">Seu Porquinho</span>
        </div>
        <button className="btn outline" onClick={() => navigate("/login")}>
          Entrar
        </button>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1>Economize com leveza, <span className="highlight">avance todo dia</span>.</h1>
          <p className="subtitle">
            Transforme sua rotina financeira com desafios, ranking e um feed que motiva. 
            Simples, divertido e do seu jeito.
          </p>
          <div className="cta-row">
            <button className="btn primary" onClick={() => navigate("/login")}>Começar agora</button>
            <button className="btn ghost" onClick={() => navigate("/login")}>Já tenho conta</button>
          </div>
        </div>

        <div className="hero-art">
          <div className="pig-spot">
            <div className="pig-circle">
              <span role="img" aria-label="porquinho">🐷</span>
            </div>
            <div className="level">
              <div className="bar"><div className="fill" style={{ width: "68%" }} /></div>
              <small>Nível 3 — rumo ao próximo objetivo!</small>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="benefits">
        <div className="card">
          <div className="icon">🎯</div>
          <h3>Desafios Semanais</h3>
          <p>Metas curtas e alcançáveis para manter o foco e criar hábitos.</p>
        </div>
        <div className="card">
          <div className="icon">🏆</div>
          <h3>Ranking Motivador</h3>
          <p>Compare seu desempenho e celebre cada avanço.</p>
        </div>
        <div className="card">
          <div className="icon">📰</div>
          <h3>Feed Inteligente</h3>
          <p>Dicas, notícias e novidades para te inspirar todo dia.</p>
        </div>
      </section>

      {/* Call-to-Action final */}
      <section className="cta-final">
        <h2>Pronto para dar o primeiro passo?</h2>
        <p>Entre agora e comece a construir seu futuro financeiro.</p>
        <button className="btn primary big" onClick={() => navigate("/login")}>Entrar na plataforma</button>
      </section>

      <footer className="home-footer">
        <small>© {new Date().getFullYear()} Seu Porquinho — todos os direitos reservados.</small>
      </footer>
    </main>
  );
};

export default Home;
