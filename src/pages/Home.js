import React from "react";
import "../styles/Home.css";
import Dinheiro from "../assets/home/dinheiro.jpg"
import Ponto from "../assets/home/ponto.jpg"
import Troca from "../assets/home/troca.jpg"
import PorqAcenando from "../assets/home/porqAcenando.png"
import PorqLivro from "../assets/home/porqLivro.png"
import PorqFeliz from "../assets/home/porqFeliz.png"
import Logo from "../assets/logo.png"

function Home() {
  return (
    <div className="home-wrapper">
      {/* ===== HEADER ===== */}
      <header className="header">
  <div className="header-container">
    <div className="logo-area">
      <img src= {Logo} alt="Logo Cofrinho" className="logo" />
    </div>

    <nav className="nav">
      <a href="#sobre">Sobre</a>
      <a href="#funciona">Como Funciona</a>
      <a href="#institucional">Instituições</a>
    </nav>

    <div className="buttons">
      <a href="/login" className="btn-outline">Entrar</a>
      <a href="/ContatoInstitucional" className="btn-filled">Começar agora</a>
    </div>
  </div>
</header>


      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-content">
          <h2>Educação financeira e reciclagem de um jeito divertido</h2>
          <p>
            O Cofrinho dos 18 une sustentabilidade e aprendizado financeiro em uma
            jornada gamificada — com desafios, níveis e recompensas reais.
          </p>
          <div className="hero-actions">
            <a href="/login" className="btn-cta grande">Começar agora</a>
          </div>
        </div>

        <div className="hero-image">
          <img
            src= {PorqFeliz}
            alt="Porquinho feliz"
            className="hero-img"
          />
        </div>
      </section>

      {/* ===== SOBRE ===== */}
      <section id="sobre" className="sobre">
        <div className="sobre-text">
          <h2>O que é o Cofrinho dos 18?</h2>
          <p>
            O Cofrinho dos 18 é um projeto que une educação financeira e consciência ambiental. A cada moeda guardada e a cada material reciclado trocado, crianças e adolescentes aprendem que pequenas atitudes de hoje podem se transformar em grandes conquistas no futuro, chegando aos 18 anos com muito mais do que dinheiro: com disciplina, aprendizado e sonhos realizados.
          </p>
        </div>
        <img
          src= {PorqLivro}
          alt="Porquinho estudioso"
          className="sobre-img"
        />
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section id="funciona" className="funciona">
        <h2>Como funciona</h2>
        <div className="cards">
          <div className="card">
            <img src= {Ponto} alt="Reciclagem" />
            <h3>Entregue</h3>
            <p>Leve seus recicláveis aos pontos parceiros.</p>
          </div>
          <div className="card">
            <img src= {Troca} alt="Conversão" />
            <h3>Converta</h3>
            <p>Suas entregas viram moedas no cofrinho virtual.</p>
          </div>
          <div className="card">
            <img src= {Dinheiro} alt="Crescimento" />
            <h3>Progrida</h3>
            <p>Suba de nível e desbloqueie recompensas exclusivas.</p>
          </div>
        </div>

        <p className="funciona-descricao">
          As unidades do projeto funcionam como pontos de troca de recicláveis. Cada material entregue é convertido em valor depositado diretamente na poupança do participante. Tudo pode ser acompanhado no site, onde um porquinho virtual cresce a cada troca, o usuário sobe de nível, participa de desafios e aparece no ranking, tornando o processo divertido, educativo e sustentável.🌎
        </p>
      </section>

      {/* ===== PARTICIPE ===== */}
      <section id="institucional" className="participe">
        <div className="participe-content">
          <div className="participe-text">
            <h2>Faça parte</h2>
            <p>
              Instituições de ensino podem se cadastrar e participar do projeto.
              Juntos, podemos transformar a educação e o meio ambiente.
            </p>
            <a href="/contatoinstitucional" className="btn-cta grande">
              Saiba mais
            </a>
          </div>
          <img
            src= {PorqAcenando}
            alt="Porquinho acenando"
            className="participe-img"
          />
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>© 2025 Cofrinho dos 18 — todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;

