// src/components/ModalRankingSemanal.js
import { useState } from 'react';
import '../../styles/ModalRankingSemanal.css';

const ModalRankingSemanal = () => {
  const [visualizacao, setVisualizacao] = useState('semanal'); // 'semanal' ou 'mensal'
  
  // Ranking Semanal (dados originais do BalanceBar)
  const rankingSemanal = [
    { posicao: 1, nome: 'João', pontos: 150, avatar: '🥇' },
    { posicao: 2, nome: 'Maria', pontos: 135, avatar: '🥈' },
    { posicao: 3, nome: 'Pedro', pontos: 120, avatar: '🥉' },
    { posicao: 4, nome: 'Ana', pontos: 110, avatar: '⭐' },
    { posicao: 5, nome: 'Lucas', pontos: 95, avatar: '⭐' },
    { posicao: 6, nome: 'Carla', pontos: 85, avatar: '⭐' },
    { posicao: 7, nome: 'Júlia B.', pontos: 80, avatar: '⭐' }, // Usuário atual
    { posicao: 8, nome: 'Marcos', pontos: 70, avatar: '⭐' },
  ];
  
  // Ranking Mensal (dados adicionais)
  const rankingMensal = [
    { posicao: 1, nome: 'Maria', pontos: 520, avatar: '🥇' },
    { posicao: 2, nome: 'João', pontos: 485, avatar: '🥈' },
    { posicao: 3, nome: 'Ana', pontos: 450, avatar: '🥉' },
    { posicao: 4, nome: 'Pedro', pontos: 420, avatar: '⭐' },
    { posicao: 5, nome: 'Júlia B.', pontos: 380, avatar: '⭐' },
    { posicao: 6, nome: 'Lucas', pontos: 350, avatar: '⭐' },
    { posicao: 7, nome: 'Carla', pontos: 310, avatar: '⭐' },
    { posicao: 8, nome: 'Marcos', pontos: 280, avatar: '⭐' },
  ];
  
  const rankingAtivo = visualizacao === 'semanal' ? rankingSemanal : rankingMensal;

  return (
    <div className="modal-ranking">
      {/* TOGGLE SEMANAL/MENSAL */}
      <div className="ranking-toggle">
        <button
          className={`toggle-btn ${visualizacao === 'semanal' ? 'ativo' : ''}`}
          onClick={() => setVisualizacao('semanal')}
        >
          Ranking Semanal
        </button>
        <button
          className={`toggle-btn ${visualizacao === 'mensal' ? 'ativo' : ''}`}
          onClick={() => setVisualizacao('mensal')}
        >
          Ranking Mensal
        </button>
      </div>
      
      {/* PERÍODO ATUAL */}
      <div className="ranking-periodo">
        <h3>
          {visualizacao === 'semanal' ? 'Semana: 04 a 10/Nov' : 'Mês: Novembro 2024'}
        </h3>
        <p className="ranking-descricao">
          {visualizacao === 'semanal' 
            ? 'Pontos baseados em reciclagem dos últimos 7 dias'
            : 'Pontuação acumulada durante o mês'}
        </p>
      </div>
      
      {/* LISTA DE RANKING */}
      <div className="ranking-lista">
        {rankingAtivo.map((participante) => (
          <div 
            key={`${visualizacao}-${participante.posicao}`}
            className={`ranking-item ${participante.nome === 'Júlia B.' ? 'usuario-atual' : ''}`}
          >
            {/* POSIÇÃO E AVATAR */}
            <div className="ranking-posicao">
              <span className="ranking-avatar">{participante.avatar}</span>
              <span className="ranking-numero">#{participante.posicao}</span>
            </div>
            
            {/* NOME */}
            <div className="ranking-nome">
              <span className="nome-texto">{participante.nome}</span>
              {participante.nome === 'Júlia B.' && (
                <span className="badge-usuario">Você</span>
              )}
            </div>
            
            {/* PONTOS */}
            <div className="ranking-pontos">
              <span className="pontos-valor">{participante.pontos}</span>
              <span className="pontos-texto">pts</span>
            </div>
            
            {/* BARRA DE PROGRESSO */}
            <div className="ranking-barra-container">
              <div 
                className="ranking-barra" 
                style={{ 
                  width: `${(participante.pontos / rankingAtivo[0].pontos) * 100}%`,
                  backgroundColor: participante.posicao === 1 ? '#f59e0b' : 
                                  participante.posicao === 2 ? '#94a3b8' : 
                                  participante.posicao === 3 ? '#d97706' : '#3b82f6'
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ModalRankingSemanal;