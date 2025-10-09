import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Porquinho from "../assets/home/porquinho.jpg"

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      {/* ===== CABEÇALHO ===== */}
      <header className="home-header">
        <div className="logo-area">
          <img src= {Porquinho} alt="Logo Seu Porquinho" className="logo" />
          <h2>Seu Porquinho</h2>
        </div>
        <button className="btn-entrar-topo" onClick={() => navigate("/login") }>
  Entrar
</button>

      </header>

      {/* ===== SEÇÃO HERO ===== */}
      <section className="hero">
        <div className="hero-texto">
          <h1>
            Bem-vindo ao <span className="destaque">Cofrinho dos 18</span>
          </h1>
          <p>
            Educação financeira e reciclagem unidas em uma jornada gamificada —
            com desafios, níveis e um feed que te acompanha.
          </p>
          <div className="hero-botoes">
            <button className="btn-laranja" onClick={() => navigate("/contatoinstitucional") }>
  Começar agora
</button>

            <button className="btn-branco" onClick={() => navigate("/Login")}>
  Entrar
</button>

          </div>
        </div>

        <div className="hero-imagem">
          <img src="/assets/porquinho-sorriso.png" alt="Porquinho feliz" />
        </div>
      </section>

      {/* ===== SEÇÃO O QUE É ===== */}
      <section className="info-section">
        <h2>O que é</h2>
        <div className="info-content">
          <p>
            O <strong>Cofrinho dos 18</strong> é uma plataforma educativa que
            combina sustentabilidade e finanças pessoais. A cada desafio e ação
            de reciclagem, você soma pontos, sobe de nível e aprende a
            economizar brincando!
          </p>

          <div className="info-grid">
            <div className="info-item">
              <img src="/assets/porquinho-oculos.png" alt="Porquinho estudioso" />
            </div>
            <div className="info-item">
              <div className="card-feature">
                <img src="/assets/icon-usuario.png" alt="Ícone perfil" />
                <p>Perfil do Usuário</p>
              </div>
              <div className="card-feature">
                <img src="/assets/icon-dashboard.png" alt="Ícone dashboard" />
                <p>Dashboard</p>
              </div>
              <div className="card-feature">
                <img src="/assets/icon-desafio.png" alt="Ícone desafios" />
                <p>Desafios & Ranking</p>
              </div>
              <div className="card-feature">
                <img src="/assets/icon-porquinho.png" alt="Ícone porquinho" />
                <p>Porquinho Virtual</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO COMO FUNCIONA ===== */}
      <section className="funciona-section">
        <h2>Como funciona</h2>
        <p className="funciona-descricao">♻️ Entrega de recicláveis</p>

        <div className="funciona-etapas">
          <div className="etapa">
            <img src="/assets/icon-reciclagem.png" alt="Reciclagem" />
            <p>Entrega de recicláveis</p>
          </div>
          <div className="seta">➜</div>
          <div className="etapa">
            <img src="/assets/icon-moedas.png" alt="Conversão" />
            <p>Conversão em valores</p>
          </div>
          <div className="seta">➜</div>
          <div className="etapa">
            <img src="/assets/icon-cofrinho.png" alt="Crescimento" />
            <p>Crescimento do cofrinho</p>
          </div>
        </div>

        <div className="faca-parte">
          <h3>Faça Parte</h3>
          <p>
            Sua escola ou instituição também pode participar e ajudar a formar
            jovens mais conscientes!
          </p>
          <button className="btn-laranja" onClick={() => navigate("/contatoinstitucional")}>Saiba mais</button>
          <img
            src="/assets/porquinho-tchau.png"
            alt="Porquinho acenando"
            className="faca-parte-img"
          />
        </div>
      </section>

      {/* ===== RODAPÉ ===== */}
      <footer className="home-footer">
        <p>© 2025 <strong>Cofrinho dos 18</strong> — todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
