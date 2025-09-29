// src/pages/Home.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

/**
 * Home em formato de feed (seções empilhadas, 1 coluna).
 * Seções: Hero • O que é • O que você vai encontrar • Como funciona • Faça parte
 * Dica: substitua os <img src> pelos seus arquivos reais quando estiverem prontos.
 */
const Home = () => {
  const navigate = useNavigate();

  // Efeito de revelar blocos ao rolar
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="home-feed">
      {/* Topbar */}
      <header className="feed-topbar">
        <div className="brand">
          <div className="logo">🐷</div>
          <span className="name">Seu Porquinho</span>
        </div>
        <button className="btn outline" onClick={() => navigate("/login")}>Entrar</button>
      </header>

      {/* HERO */}
      <section className="feed-block hero reveal">
        <h1 className="hero-title">
          Bem-vindo ao <span className="highlight">Seu Porquinho</span>
        </h1>
        <p className="hero-subtitle">
          Educação financeira e reciclagem unidas em uma jornada gamificada — com desafios,
          níveis e um feed que te acompanha passo a passo.
        </p>
        <div className="level-box">
          <div className="bar"><div className="fill" style={{ width: "65%" }} /></div>
          <small>Nível demonstração • Progresso ilustrativo</small>
        </div>
        <div className="cta-row">
          <button className="btn primary" onClick={() => navigate("/login")}>Começar agora</button>
          <button className="btn ghost" onClick={() => document.getElementById("oque-e")?.scrollIntoView({ behavior: "smooth" })}>
            Conhecer o projeto
          </button>
        </div>
      </section>

      {/* O QUE É (texto em bloco + imagem abaixo) */}
      <section id="oque-e" className="feed-block reveal">
        <h2>O que é</h2>
        <p>
          O <strong>Seu Porquinho</strong> é um ecossistema educativo que une reciclagem e
          finanças pessoais. Você acompanha um feed de novidades, participa de desafios,
          sobe de nível e cria hábitos saudáveis — um pouquinho por vez.
        </p>

        {/* IMAGEM DO PORQUINHO — troque pelo seu arquivo */}
        <figure className="media-figure">
          <img
            src="/assets/home/porquinho-demo.png"
            alt="Símbolo do porquinho (placeholder)"
            className="img-cover"
          />
          <figcaption>Seu símbolo aqui ✨</figcaption>
        </figure>
      </section>

      {/* O QUE VOCÊ VAI ENCONTRAR (texto + imagens empilhadas) */}
      <section className="feed-block reveal">
        <h2>O que você vai encontrar</h2>
        <p>
          Um ambiente simples e motivador: desafios semanais com metas claras, um ranking
          para celebrar a evolução e um feed com dicas e notícias para inspirar seu dia a dia.
        </p>

        {/* Imagens do site — coloque seus screenshots reais abaixo */}
        <figure className="media-figure">
          <img src="/assets/home/tela-1.png" alt="Tela do site (placeholder 1)" className="img-cover" />
          <figcaption>Exemplo de tela 1</figcaption>
        </figure>
        <figure className="media-figure">
          <img src="/assets/home/tela-2.png" alt="Tela do site (placeholder 2)" className="img-cover" />
          <figcaption>Exemplo de tela 2</figcaption>
        </figure>
        <figure className="media-figure">
          <img src="/assets/home/tela-3.png" alt="Tela do site (placeholder 3)" className="img-cover" />
          <figcaption>Exemplo de tela 3</figcaption>
        </figure>
      </section>

      {/* COMO FUNCIONA (vários parágrafos empilhados) */}
      <section className="feed-block reveal">
        <h2>Como funciona</h2>
        <p>
          <strong>Trocas de material reciclável:</strong> leve seus materiais aos pontos de
          troca parceiros. Cada entrega gera pontuação e pode converter-se em benefícios
          definidos pelos organizadores.
        </p>
        <p>
          <strong>Desafios e níveis:</strong> cumpra desafios semanais, some pontos e avance de
          nível. A barra de progresso mostra sua evolução e seu perfil guarda suas conquistas.
        </p>
        <p>
          <strong>Dinheiro & educação financeira:</strong> conteúdos do feed ajudam a entender
          melhores práticas, enquanto você vivencia na prática o valor das pequenas ações.
        </p>

        {/* imagem opcional de fluxo */}
        <figure className="media-figure">
          <img
            src="/assets/home/como-funciona.png"
            alt="Fluxo do projeto (placeholder)"
            className="img-cover"
          />
          <figcaption>Fluxo ilustrativo do projeto</figcaption>
        </figure>
      </section>

      {/* FAÇA PARTE (call to action) */}
      <section className="feed-block cta reveal">
        <h2>Faça parte</h2>
        <p>
          Se você representa uma <strong>instituição de ensino</strong> e quer participar,
          fale com a gente. Vamos criar juntos uma rede de impacto positivo.
        </p>
        <button className="btn primary big" onClick={() => navigate("/contato")}>
          Saiba mais
        </button>
        <small className="muted">Você será direcionado para a página de Contato.</small>
      </section>

      <footer className="feed-footer">
        <small>© {new Date().getFullYear()} Seu Porquinho — todos os direitos reservados.</small>
      </footer>
    </main>
  );
};

export default Home;
