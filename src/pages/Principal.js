import { useState } from 'react';
import BalanceBar from './Componets/Balancebar';
import RecentList from './Componets/Recentlist';
import '../styles/Principal.css';
import perfil from '../assets/principal/perfil.png';
import porquinho from '../assets/principal/porquinho-chapeu.png'; 
import logo from '../assets/principal/logov.png';

const Dashboard = () => {
  const [active, setActive] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleClick = (menu) => {
    setActive(menu);
    alert(`Você clicou em: ${menu}`);
  };

  const showReward = () => {
    alert('🎁 Parabéns! Você desbloqueou a recompensa do Porquinho de Ouro!');
  };

  return (
    <div className="container">
      {/* hamburger button for mobile */}
      <button className="hamburger" aria-label="Abrir menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span className="bar" />
      </button>
      {/* Sidebar (integrado) */}
  <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="profile">
          <img src={perfil} alt="Júlia B." className="avatar" />
          <p className="name">Júlia B.</p>
        </div>

        <nav className="menu">
          <button className={`menu-item ${active === 'Home' ? 'active' : ''}`} onClick={() => { handleClick('Home'); setSidebarOpen(false); }}>
            🏠 Home
          </button>
          <button className={`menu-item ${active === 'Lançamentos' ? 'active' : ''}`} onClick={() => { handleClick('Lançamentos'); setSidebarOpen(false); }}>
            🕒 Últimos Lançamentos
          </button>
          <button className={`menu-item ${active === 'Personalizar' ? 'active' : ''}`} onClick={() => { handleClick('Personalizar'); setSidebarOpen(false); }}>
            🎨 Personalizar Cofrinho
          </button>
        </nav>

        <div className="links-contato">
          <a href="#">Quem Somos</a>
          <a href="#">Fale Conosco</a>
        </div>
      </aside>

  {/* backdrop for mobile when sidebar is open */}
  {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

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

      {/* Right panel (integrado) */}
      <section className="right-panel">
        <div className="card orange">
          <h4>O Desafio do Dia</h4>
          <p>Recicle 400g em garrafas plásticas</p>
          <div className="deadline">⏰ Prazo: 24h</div>
        </div>

        <div className="card blue">
          <h4>Meta da Semana</h4>
          <p>Faça 5 envios de quaisquer materiais</p>
          <div className="status success">✅ Concluído</div>
        </div>

        <div className="card yellow">
          <h4>O Porquinho de Ouro</h4>
          <p>Acumule R$ 50,00 em valor total de reciclagem</p>
          <button className="reward-btn" onClick={showReward}>Ver Recompensa</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;