import { useState } from 'react';
import '../../styles/ModalLancamentos.css';

const ModalLancamentos = () => {
  const [visualizacaoAtiva, setVisualizacaoAtiva] = useState('historico'); // 'historico' ou 'grafico'

  // Dados estáticos
  const lancamentos = [
    { id: 1, data: '2/Out', material: 'Plástico', quantidade: '3.2 kg', valor: 'R$ 12,80' },
    { id: 2, data: '30/Set', material: 'Metal', quantidade: '0.5 kg', valor: 'R$ 1,50' },
    { id: 3, data: '20/Set', material: 'Papel', quantidade: '1.2 kg', valor: 'R$ 3,60' },
  ];

  // Dados para o gráfico
  const dadosGrafico = [
    { material: 'Plástico', porcentagem: 55, cor: '#3b82f6' },
    { material: 'Papel', porcentagem: 25, cor: '#60a5fa' },
    { material: 'Metal', porcentagem: 15, cor: '#93c5fd' },
    { material: 'Vidro', porcentagem: 5, cor: '#38bdf8' },
  ];

  return (
    <div className="modal-lancamentos">
      {/* TOGGLE DE VISUALIZAÇÃO */}
      <div className="visualizacao-toggle">
        <button
          className={`toggle-btn ${visualizacaoAtiva === 'historico' ? 'ativo' : ''}`}
          onClick={() => setVisualizacaoAtiva('historico')}
        >
          Histórico de Reciclagem
        </button>
        <button
          className={`toggle-btn ${visualizacaoAtiva === 'grafico' ? 'ativo' : ''}`}
          onClick={() => setVisualizacaoAtiva('grafico')}
        >
          Total de Material Reciclado
        </button>
      </div>

      {/* CONTEÚDO DINÂMICO */}
      <div className="visualizacao-conteudo">
        {/* VISUALIZAÇÃO: HISTÓRICO */}
        {visualizacaoAtiva === 'historico' && (
          <div className="historico-container">
            <div className="lancamentos-lista">
              {lancamentos.map((item) => (
                <div key={item.id} className="lancamento-item">
                  <div className="lancamento-data">{item.data}</div>
                  <div className="lancamento-detalhes">
                    <span className="lancamento-material">{item.material}</span>
                    <span className="lancamento-quantidade">({item.quantidade})</span>
                  </div>
                  <div className="lancamento-valor">{item.valor}</div>
                </div>
              ))}
            </div>
            
            <div className="lancamentos-resumo">
              <p>Total do período: <strong>R$ 17,90</strong></p>
              <p className="lancamentos-observacao">Valores baseados nas cotações do mês.</p>
            </div>
          </div>
        )}

        {/* VISUALIZAÇÃO: GRÁFICO */}
        {visualizacaoAtiva === 'grafico' && (
          <div className="grafico-container">
            <div className="grafico-titulo">Distribuição por Material (kg)</div>
            
            <div className="grafico-barras">
              {dadosGrafico.map((item, index) => (
                <div key={index} className="grafico-item">
                  <div className="grafico-rotulo">
                    <span className="grafico-material">{item.material}</span>
                    <span className="grafico-porcentagem">{item.porcentagem}%</span>
                  </div>
                  <div className="grafico-barra-container">
                    <div 
                      className="grafico-barra" 
                      style={{ 
                        width: `${item.porcentagem}%`,
                        backgroundColor: item.cor
                      }}
                    />
                  </div>
                  <div className="grafico-valor">
                    {item.material === 'Plástico' && '55 kg'}
                    {item.material === 'Papel' && '25 kg'}
                    {item.material === 'Metal' && '15 kg'}
                    {item.material === 'Vidro' && '5 kg'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grafico-legenda">
              <p><strong>Total: 100 kg reciclados</strong></p>
              <p className="grafico-observacao">Dados referentes ao último mês</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalLancamentos;