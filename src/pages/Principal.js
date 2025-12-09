// src/pages/Principal.js
import { useState } from "react";
import BalanceBar from "./Componets/Balancebar";
import RecentList from "./Componets/Recentlist";
import "../styles/Principal.css";
import perfil from "../assets/principal/perfil.png";
import porquinho from "../assets/principal/porquinho-chapeu.png";
import logo from "../assets/principal/logov.png";

const Dashboard = () => {
  const [active, setActive] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [desafios] = useState([
    {
      id: 1,
      titulo: "O Desafio do Dia",
      descricao: "Recicle 400g em garrafas plásticas",
      prazo: "⏰ Prazo: 24h",
      tipo: "Diário",
      cor: "orange",
      status: null,
    },
    {
      id: 2,
      titulo: "Meta da Semana",
      descricao: "Faça 5 envios de quaisquer materiais",
      prazo: "",
      tipo: "Semanal",
      cor: "blue",
      status: "✅ Concluído",
    },
    {
      id: 3,
      titulo: "O Porquinho de Ouro",
      descricao: "Acumule R$ 50,00 em valor total de reciclagem",
      prazo: "",
      tipo: "Especial",
      cor: "yellow",
      status: null,
      botaoRecompensa: true,
    },
  ]);

  const handleClick = (menu) => {
    setActive(menu);
    alert(`Você clicou em: ${menu}`);
  };

  const showReward = () => {
    alert("🎁 Parabéns! Você desbloqueou a recompensa do Porquinho de Ouro!");
  };

  return (
    <div className="container">
      {/* hamburger button for mobile */}
      <button
        className="hamburger"
        aria-label="Abrir menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="bar" />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="profile">
          <img src={perfil} alt="Júlia B." className="avatar" />
          <p className="name">Júlia B.</p>
        </div>

        <nav className="menu">
          <button
            className={`menu-item ${active === "Home" ? "active" : ""}`}
            onClick={() => {
              handleClick("Home");
              setSidebarOpen(false);
            }}
          >
            🏠 Home
          </button>
          <button
            className={`menu-item ${
              active === "Lançamentos" ? "active" : ""
            }`}
            onClick={() => {
              handleClick("Lançamentos");
              setSidebarOpen(false);
            }}
          >
            🕒 Últimos Lançamentos
          </button>
          <button
            className={`menu-item ${
              active === "Personalizar" ? "active" : ""
            }`}
            onClick={() => {
              handleClick("Personalizar");
              setSidebarOpen(false);
            }}
          >
            🎨 Personalizar Cofrinho
          </button>
        </nav>

        <div className="links-contato">
          <a href="#">Quem Somos</a>
          <a href="#">Fale Conosco</a>
        </div>
      </aside>

      {/* backdrop for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Centro - Dashboard principal */}
      <main className="dashboard">
        <div className="header">
          <img src={logo} alt="cofrinho18" className="logo" />
        </div>

        <div className="piggy-container">
          <img src={porquinho} alt="Porquinho" className="piggy" />
          <div className="balance-card">
            <p>Saldo atual para reciclagem:</p>
            <h2>R$ 1.458,75</h2>
          </div>
        </div>

        <BalanceBar />
        <RecentList />
      </main>

      {/* Painel direito com desafios dinâmicos */}
      <section className="right-panel">
        {desafios.map((d) => (
          <div key={d.id} className={`card ${d.cor}`}>
            <h4>{d.titulo}</h4>
            <p>{d.descricao}</p>
            {d.prazo && <div className="deadline">{d.prazo}</div>}

            {d.status && <div className="status success">{d.status}</div>}

            {d.botaoRecompensa && (
              <button className="reward-btn" onClick={showReward}>
                Ver Recompensa
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
