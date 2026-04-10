import { useState, useEffect } from 'react';
import Modal from './Componets/Modal';
import ModalLancamentos from './Componets/ModalLancamentos';
import ModalRankingSemanal from './Componets/ModalRankingSemanal';
import ModalEditarPerfil from './Componets/ModalEditarPerfil';
import ModalPersonalizarPorquinho from './Componets/ModalPersonalizarPorquinho';
import UserService from '../services/UserService';
import '../styles/Principal.css';
import perfilPadrao from '../assets/principal/perfil.png';
import porquinhoBase from '../assets/principal/porquinho.png'; 
import logo from '../assets/principal/logov.png';

// Import das roupas para aplicar no dashboard principal
import bonezinho from '../assets/roupasporquinho/Cabeça/bonezinho.png';
import chapeuaniversario from '../assets/roupasporquinho/Cabeça/chapeuaniversario.png';
import chapeupalhaco from '../assets/roupasporquinho/Cabeça/chapeupalhaco.png';
import chapeuverde from '../assets/roupasporquinho/Cabeça/chapeuverde.png';

import camisabege from '../assets/roupasporquinho/Torso/camisabege.png';
import camisalaranja from '../assets/roupasporquinho/Torso/camisalaranja.png';
import camisaverde from '../assets/roupasporquinho/Torso/camisaverde.png';
import camisavermelha from '../assets/roupasporquinho/Torso/camisavermelha.png';
import jardineira from '../assets/roupasporquinho/Torso/jardineira.png';

import shortazul from '../assets/roupasporquinho/Cintura/shortazul.png';
import shortbolinha from '../assets/roupasporquinho/Cintura/shortbolinha.png';
import shortlaranja from '../assets/roupasporquinho/Cintura/shortlaranja.png';
import shortmarrom from '../assets/roupasporquinho/Cintura/shortmarrom.png';
import shortpreto from '../assets/roupasporquinho/Cintura/shortpreto.png';

import tenisazul from '../assets/roupasporquinho/Pés/tenisazul.png';
import tenisdepalhaco from '../assets/roupasporquinho/Pés/tenisdepalhaco.png';
import tenismarrom from '../assets/roupasporquinho/Pés/tenismarrom.png';
import tenispreto from '../assets/roupasporquinho/Pés/tenispreto.png';
import tenisverde from '../assets/roupasporquinho/Pés/tenisverde.png';

const Dashboard = () => {
  const [active, setActive] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fotoUsuario, setFotoUsuario] = useState(UserService.getFoto());
  
  // Estado das roupas selecionadas para o porquinho
  const [roupasSelecionadas, setRoupasSelecionadas] = useState({
    cabeca: null,
    tronco: null,
    cintura: null,
    pes: null
  });
  
  // Mapeamento de imagens para exibição
  const imagensPorId = {
    bonezinho, chapeuaniversario, chapeupalhaco, chapeuverde,
    camisabege, camisalaranja, camisaverde, camisavermelha, jardineira,
    shortazul, shortbolinha, shortlaranja, shortmarrom, shortpreto,
    tenisazul, tenisdepalhaco, tenismarrom, tenispreto, tenisverde
  };
  
  // Função para obter a imagem com base no ID
  const getImagemSelecionada = (categoria) => {
    const id = roupasSelecionadas[categoria];
    if (!id) return null;
    return imagensPorId[id];
  };
  
  // Estado para controlar os modais
  const [modalAberto, setModalAberto] = useState({
    home: false,
    lancamentos: false,
    personalizar: false,
    perfil: false
  });
  
  const [nivel, setNivel] = useState({
    atual: 3,
    xpAtual: 5,
    xpProximo: 10,
    titulo: "Reciclador Bronze"
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

  // Dados estáticos dos desafios
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
    
    const modalMap = {
      'Home': 'home',
      'Lançamentos': 'lancamentos',
      'Personalizar Cofrinho': 'personalizar'
    };
    
    const modalKey = modalMap[menu];
    if (modalKey) {
      abrirModal(modalKey);
    }
    
    setSidebarOpen(false);
  };

  const showReward = () => {
    alert("🎁 Parabéns! Você desbloqueou a recompensa do Porquinho de Ouro!");
  };

  const handlePerfilModalClose = () => {
    fecharModal();
    setFotoUsuario(UserService.getFoto());
  };

  const calcularProgresso = () => {
    return (nivel.xpAtual / nivel.xpProximo) * 100;
  };

  const previewItens = {
    tronco: getImagemSelecionada('tronco'),
    cintura: getImagemSelecionada('cintura'),
    cabeca: getImagemSelecionada('cabeca'),
    pes: getImagemSelecionada('pes')
  };

  return (
    <div className="container">
      <button 
        className="hamburger" 
        aria-label="Abrir menu" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="bar" />
      </button>
      
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
          
          <div className="nivel-container">
            <div className="nivel-info">
              <span className="nivel-numero">Nível {nivel.atual}</span>
              <span className="nivel-titulo">{nivel.titulo}</span>
            </div>
            
            <div className="progresso-container">
              <div className="progresso-barra">
                <div 
                  className="progresso-preenchido" 
                  style={{ width: `${calcularProgresso()}%` }}
                />
              </div>
              <div className="progresso-texto">
                {nivel.xpAtual}/{nivel.xpProximo} XP
              </div>
            </div>
          </div>
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

      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <main className="dashboard">
        <div className="header">
          <img src={logo} alt="cofrinho18" className="logo" />
        </div>

        <div className="piggy-container">
          <div className="porquinho-principal">
            <div className="porquinho-layers-principal">
              {/* CAMADA BASE */}
              <img src={porquinhoBase} alt="Porquinho" className="porquinho-principal-base" />
              
              {/* CAMADA DO TRONCO */}
              {previewItens.tronco && (
                <img src={previewItens.tronco} alt="Tronco" className="porquinho-principal-layer tronco-layer-principal" />
              )}
              
              {/* CAMADA DA CINTURA */}
              {previewItens.cintura && (
                <img src={previewItens.cintura} alt="Cintura" className="porquinho-principal-layer cintura-layer-principal" />
              )}
              
              {/* CAMADA DA CABEÇA */}
              {previewItens.cabeca && (
                <img src={previewItens.cabeca} alt="Cabeça" className="porquinho-principal-layer cabeca-layer-principal" />
              )}
              
              {/* CAMADA DOS PÉS */}
              {previewItens.pes && (
                <img src={previewItens.pes} alt="Pés" className="porquinho-principal-layer pes-layer-principal" />
              )}
            </div>
          </div>
          
          <div className="balance-card">
            <p>Saldo atual para reciclagem:</p>
            <h2>R$ 1.458,75</h2>
          </div>
        </div>
      </main>

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
        <ModalPersonalizarPorquinho 
          roupasSelecionadas={roupasSelecionadas}
          setRoupasSelecionadas={setRoupasSelecionadas}
        />
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