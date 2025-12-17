import { useState } from 'react';
import '../../styles/ModalPersonalizarPorquinho.css';

const ModalPersonalizarPorquinho = () => {
  const [abaAtiva, setAbaAtiva] = useState('cabeca'); // cabeca, face, tronco, pes

  const abas = [
    { id: 'cabeca', label: '👑 Cabeça', icon: '👑' },
    { id: 'face', label: '😊 Face', icon: '😊' },
    { id: 'tronco', label: '👕 Tronco', icon: '👕' },
    { id: 'pes', label: '👟 Pés', icon: '👟' }
  ];

  const conteudoAba = {
    cabeca: {
      titulo: 'Cosméticos para Cabeça',
      descricao: 'Chapéus, coroas, óculos, orelhas e outros acessórios para a cabeça do seu porquinho.'
    },
    face: {
      titulo: 'Cosméticos para Face',
      descricao: 'Óculos, máscaras, pinturas faciais e expressões para dar personalidade ao seu porquinho.'
    },
    tronco: {
      titulo: 'Cosméticos para Tronco',
      descricao: 'Roupas, acessórios, medalhas e decorações para o corpo do seu porquinho.'
    },
    pes: {
      titulo: 'Cosméticos para Pés',
      descricao: 'Sapatos, meias, patins e outros acessórios para os pés do seu porquinho.'
    }
  };

  return (
    <div className="modal-personalizar">
      {/* ABAS DE NAVEGAÇÃO */}
      <div className="personalizar-abas">
        {abas.map((aba) => (
          <button
            key={aba.id}
            className={`aba-btn ${abaAtiva === aba.id ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            <span className="aba-icon">{aba.icon}</span>
            <span className="aba-label">{aba.label}</span>
          </button>
        ))}
      </div>

      {/* CONTEÚDO DA ABA ATIVA */}
      <div className="personalizar-conteudo">
        <div className="conteudo-cabecalho">
          <h4 className="conteudo-titulo">{conteudoAba[abaAtiva].titulo}</h4>
          <p className="conteudo-descricao">{conteudoAba[abaAtiva].descricao}</p>
        </div>

        {/* ÁREA DE PREVIEW DO PORQUINHO (Futuramente com sobreposição) */}
        <div className="preview-container">
          <div className="preview-aviso">
            <div className="preview-icone">🐷</div>
            <p className="preview-texto">
              Aqui será exibido o preview do porquinho com os cosméticos selecionados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPersonalizarPorquinho;