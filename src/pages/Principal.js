import { useState, useEffect } from 'react';
import Modal from './Componets/Modal';
import ModalLancamentos from './Componets/ModalLancamentos';
import ModalRankingSemanal from './Componets/ModalRankingSemanal';
import ModalEditarPerfil from './Componets/ModalEditarPerfil';
import ModalPersonalizarPorquinho from './Componets/ModalPersonalizarPorquinho';
import UserService from '../Services/UserService';
import '../styles/Principal.css';
import perfilPadrao from '../assets/principal/perfil.png';
import porquinho from '../assets/principal/porquinho2d.png'; 
import logo from '../assets/principal/logov.png';

const Dashboard = () => {
  const [active, setActive] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fotoUsuario, setFotoUsuario] = useState(UserService.getFoto());
  
  // Estado para controlar os modais
  const [modalAberto, setModalAberto] = useState({
    home: false,
    lancamentos: false,
    personalizar: false,
    perfil: false
  });
  
  // Monitora mudanças na foto do usuário
  useEffect(() => {
    const handleFotoChange = (event) => {
      setFotoUsuario(event.detail);
    };

    window.addEventListener('userFotoChanged', handleFotoChange);
    
    return () => {
      window.removeEventListener('userFotoChanged', handleFotoChange);
    };
  }, []);

  // Função para abrir cada modal
  const abrirModal = (tipo) => {
    setModalAberto({
      home: tipo === 'home',
      lancamentos: tipo === 'lancamentos',
      personalizar: tipo === 'personalizar',
      perfil: tipo === 'perfil'
    });
  };
  
  // Função para fechar todos os modais
  const fecharModal = () => {
    setModalAberto({ 
      home: false,
      lancamentos: false, 
      personalizar: false,
      perfil: false
    });
  };

  const handleClick = (menu) => {
    setActive(menu);
    
    // Mapeia os nomes dos botões para as chaves do modal
    const modalMap = {
      'Home': 'home',
      'Lançamentos': 'lancamentos',
      'Personalizar Cofrinho': 'personalizar'
    };
    
    const modalKey = modalMap[menu];
    if (modalKey) {
      abrirModal(modalKey);
    }
    
    setSidebarOpen(false); // Fecha sidebar no mobile
  };

  const showReward = () => {
    alert('🎁 Parabéns! Você desbloqueou a recompensa do Porquinho de Ouro!');
  };

  // Função para quando o modal de perfil fecha
  const handlePerfilModalClose = () => {
    fecharModal();
    // Atualiza a foto imediatamente após fechar o modal
    setFotoUsuario(UserService.getFoto());
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
      
      {/* Sidebar (integrado) */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="profile">
          <img 
            src={fotoUsuario || perfilPadrao} 
            alt="Júlia B." 
            className="avatar"
            style={{ cursor: 'pointer' }}
            onClick={() => abrirModal('perfil')}
          />
          <p className="name">Júlia B.</p>
        </div>

        <nav className="menu">
          <button 
            className={`menu-item ${active === 'Home' ? 'active' : ''}`} 
            onClick={() => handleClick('Home')}
          >
            Ranking
          </button>
          <button 
            className={`menu-item ${active === 'Lançamentos' ? 'active' : ''}`} 
            onClick={() => handleClick('Lançamentos')}
          >
            🕒 Últimos Lançamentos
          </button>
          <button 
            className={`menu-item ${active === 'Personalizar Cofrinho' ? 'active' : ''}`} 
            onClick={() => handleClick('Personalizar Cofrinho')}
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
          <button className="reward-btn" onClick={showReward}>
            Ver Recompensa
          </button>
        </div>
      </section>

      {/* MODAIS */}
      <Modal 
        isOpen={modalAberto.home}
        onClose={fecharModal}
        title="Ranking Semanal"
      >
        <ModalRankingSemanal />
      </Modal>
      
      <Modal 
        isOpen={modalAberto.lancamentos}
        onClose={fecharModal}
        title="Últimos Lançamentos"
      >
        <ModalLancamentos />
      </Modal>
      
      <Modal 
        isOpen={modalAberto.personalizar}
        onClose={fecharModal}
        title="🎨 Personalizar Porquinho"
      >
        <ModalPersonalizarPorquinho />
      </Modal>
      <Modal 
        isOpen={modalAberto.perfil}
        onClose={handlePerfilModalClose}
        title="Editar Perfil"
      >
        <ModalEditarPerfil onClose={handlePerfilModalClose} />
      </Modal>
    </div>
  );
};

export default Dashboard;