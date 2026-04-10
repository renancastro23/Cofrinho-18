import { useState } from 'react';
import '../../styles/ModalPersonalizarPorquinho.css';

// Imagem base do porquinho
import porquinhoBase from '../../assets/principal/porquinho.png';

// ÍCONES DAS ABAS
import iconeCabeca from '../../assets/principal/iconeabas/iconecabeca.jpg';
import iconeTorso from '../../assets/principal/iconeabas/iconetorso.jpg';
import iconeCintura from '../../assets/principal/iconeabas/iconecintura.jpg';
import iconePes from '../../assets/principal/iconeabas/iconepes.jpg';

// Imagens das roupas - CABEÇA
import bonezinho from '../../assets/roupasporquinho/Cabeça/bonezinho.png';
import chapeuaniversario from '../../assets/roupasporquinho/Cabeça/chapeuaniversario.png';
import chapeupalhaco from '../../assets/roupasporquinho/Cabeça/chapeupalhaco.png';
import chapeuverde from '../../assets/roupasporquinho/Cabeça/chapeuverde.png';

// Imagens das roupas - TRONCO
import camisabege from '../../assets/roupasporquinho/Torso/camisabege.png';
import camisalaranja from '../../assets/roupasporquinho/Torso/camisalaranja.png';
import camisaverde from '../../assets/roupasporquinho/Torso/camisaverde.png';
import camisavermelha from '../../assets/roupasporquinho/Torso/camisavermelha.png';
import jardineira from '../../assets/roupasporquinho/Torso/jardineira.png';

// Imagens das roupas - CINTURA
import shortazul from '../../assets/roupasporquinho/Cintura/shortazul.png';
import shortbolinha from '../../assets/roupasporquinho/Cintura/shortbolinha.png';
import shortlaranja from '../../assets/roupasporquinho/Cintura/shortlaranja.png';
import shortmarrom from '../../assets/roupasporquinho/Cintura/shortmarrom.png';
import shortpreto from '../../assets/roupasporquinho/Cintura/shortpreto.png';

// Imagens das roupas - PÉS
import tenisazul from '../../assets/roupasporquinho/Pés/tenisazul.png';
import tenisdepalhaco from '../../assets/roupasporquinho/Pés/tenisdepalhaco.png';
import tenismarrom from '../../assets/roupasporquinho/Pés/tenismarrom.png';
import tenispreto from '../../assets/roupasporquinho/Pés/tenispreto.png';
import tenisverde from '../../assets/roupasporquinho/Pés/tenisverde.png';

const ModalPersonalizarPorquinho = ({ roupasSelecionadas, setRoupasSelecionadas }) => {
  const [abaAtiva, setAbaAtiva] = useState('cabeca'); // cabeca, tronco, cintura, pes

  // Mapeamento de itens por categoria
  const itensPorAba = {
    cabeca: {
      itens: [
        { id: 'nenhum', nome: 'Nenhum', imagem: null },
        { id: 'bonezinho', nome: 'Bonezinho', imagem: bonezinho },
        { id: 'chapeuaniversario', nome: 'Chapéu Aniversário', imagem: chapeuaniversario },
        { id: 'chapeupalhaco', nome: 'Chapéu Palhaço', imagem: chapeupalhaco },
        { id: 'chapeuverde', nome: 'Chapéu Verde', imagem: chapeuverde },
      ]
    },
    tronco: {
      itens: [
        { id: 'nenhum', nome: 'Nenhum', imagem: null },
        { id: 'camisabege', nome: 'Camisa Bege', imagem: camisabege },
        { id: 'camisalaranja', nome: 'Camisa Laranja', imagem: camisalaranja },
        { id: 'camisaverde', nome: 'Camisa Verde', imagem: camisaverde },
        { id: 'camisavermelha', nome: 'Camisa Vermelha', imagem: camisavermelha },
        { id: 'jardineira', nome: 'Jardineira', imagem: jardineira },
      ]
    },
    cintura: {
      itens: [
        { id: 'nenhum', nome: 'Nenhum', imagem: null },
        { id: 'shortazul', nome: 'Short Azul', imagem: shortazul },
        { id: 'shortbolinha', nome: 'Short Bolinha', imagem: shortbolinha },
        { id: 'shortlaranja', nome: 'Short Laranja', imagem: shortlaranja },
        { id: 'shortmarrom', nome: 'Short Marrom', imagem: shortmarrom },
        { id: 'shortpreto', nome: 'Short Preto', imagem: shortpreto },
      ]
    },
    pes: {
      itens: [
        { id: 'nenhum', nome: 'Nenhum', imagem: null },
        { id: 'tenisazul', nome: 'Tênis Azul', imagem: tenisazul },
        { id: 'tenisdepalhaco', nome: 'Tênis Palhaço', imagem: tenisdepalhaco },
        { id: 'tenismarrom', nome: 'Tênis Marrom', imagem: tenismarrom },
        { id: 'tenispreto', nome: 'Tênis Preto', imagem: tenispreto },
        { id: 'tenisverde', nome: 'Tênis Verde', imagem: tenisverde },
      ]
    }
  };

  const abas = [
    { id: 'cabeca', icon: iconeCabeca, label: 'Cabeça' },
    { id: 'tronco', icon: iconeTorso, label: 'Tronco' },
    { id: 'cintura', icon: iconeCintura, label: 'Cintura' },
    { id: 'pes', icon: iconePes, label: 'Pés' }
  ];

  // Função para selecionar/deselecionar item
  const selecionarItem = (categoria, itemId) => {
    const novoItemId = roupasSelecionadas[categoria] === itemId ? null : itemId;
    
    setRoupasSelecionadas(prev => ({
      ...prev,
      [categoria]: novoItemId
    }));
  };

  // Função para obter a imagem selecionada de uma categoria
  const getImagemSelecionada = (categoria) => {
    const itemId = roupasSelecionadas[categoria];
    if (!itemId) return null;
    const item = itensPorAba[categoria]?.itens.find(i => i.id === itemId);
    return item?.imagem || null;
  };

  // Combina os itens para exibir na ordem correta
  const getItensParaPreview = () => {
    return {
      cabeca: getImagemSelecionada('cabeca'),
      tronco: getImagemSelecionada('tronco'),
      cintura: getImagemSelecionada('cintura'),
      pes: getImagemSelecionada('pes')
    };
  };

  const previewItens = getItensParaPreview();

  return (
    <div className="modal-personalizar">
      {/* ABAS DE NAVEGAÇÃO - APENAS ÍCONES */}
      <div className="personalizar-abas">
        {abas.map((aba) => (
          <button
            key={aba.id}
            className={`aba-btn ${abaAtiva === aba.id ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva(aba.id)}
            title={aba.label}
          >
            <img src={aba.icon} alt={aba.label} className="aba-icone-img" />
          </button>
        ))}
      </div>

      {/* ÁREA DE PREVIEW DO PORQUINHO COM SOBREPOSIÇÃO */}
      <div className="preview-porquinho">
        <div className="porquinho-layers">
          {/* CAMADA BASE */}
          <img src={porquinhoBase} alt="Porquinho base" className="porquinho-base" />
          
          {/* CAMADA DO TRONCO */}
          {previewItens.tronco && (
            <img src={previewItens.tronco} alt="Tronco" className="porquinho-layer tronco-layer" />
          )}
          
          {/* CAMADA DA CINTURA */}
          {previewItens.cintura && (
            <img src={previewItens.cintura} alt="Cintura" className="porquinho-layer cintura-layer" />
          )}
          
          {/* CAMADA DA CABEÇA */}
          {previewItens.cabeca && (
            <img src={previewItens.cabeca} alt="Cabeça" className="porquinho-layer cabeca-layer" />
          )}
          
          {/* CAMADA DOS PÉS */}
          {previewItens.pes && (
            <img src={previewItens.pes} alt="Pés" className="porquinho-layer pes-layer" />
          )}
        </div>
      </div>

      {/* LISTA DE ITENS DA ABA ATIVA */}
      <div className="itens-container">
        <div className="itens-lista">
          {itensPorAba[abaAtiva].itens.map((item) => (
            <button
              key={item.id}
              className={`item-card ${roupasSelecionadas[abaAtiva] === item.id ? 'selecionado' : ''}`}
              onClick={() => selecionarItem(abaAtiva, item.id)}
            >
              {item.imagem ? (
                <img src={item.imagem} alt={item.nome} className="item-imagem" />
              ) : (
                <div className="item-placeholder-icon">❌</div>
              )}
              <span className="item-nome">{item.nome}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalPersonalizarPorquinho;