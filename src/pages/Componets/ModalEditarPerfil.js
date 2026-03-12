// src/components/ModalEditarPerfil.js
import { useState, useRef } from 'react';
import UserService from '../../services/UserService';
import '../../styles/ModalEditarPerfil.css';

const ModalEditarPerfil = ({ onClose }) => {
  const fileInputRef = useRef(null);
  
  // Estado para foto
  const [fotoPreview, setFotoPreview] = useState(null);
  
  // Estado para senha
  const [senha, setSenha] = useState({
    atual: '',
    nova: '',
    confirmacao: ''
  });
  
  // Estado para erros
  const [erro, setErro] = useState('');

  // Handler para selecionar foto
  const handleSelecionarFoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
  const novaFoto = reader.result;
  setFotoPreview(novaFoto);
  UserService.setFoto(novaFoto);
        };
      reader.readAsDataURL(file);
    }
  };

  // Handler para alterar senha
  const handleAlterarSenha = () => {
    // Validações básicas
    if (!senha.atual) {
      setErro('Digite sua senha atual');
      return;
    }
    
    if (!senha.nova) {
      setErro('Digite a nova senha');
      return;
    }
    
    if (senha.nova.length < 6) {
      setErro('A nova senha precisa ter pelo menos 6 caracteres');
      return;
    }
    
    if (senha.nova !== senha.confirmacao) {
      setErro('As senhas não coincidem');
      return;
    }
    
    // Se tudo ok
    setErro('');
    alert('Senha alterada com sucesso!');
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="modal-editar-perfil-simples">
      {/* FOTO DE PERFIL */}
      <div className="foto-container">
        <div 
          className="foto-wrapper"
          onClick={handleSelecionarFoto}
          title="Clique para alterar foto"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleSelecionarFoto()}
        >
          {fotoPreview ? (
            <img src={fotoPreview} alt="Nova foto" className="foto-preview" />
          ) : (
            <div className="foto-placeholder">
              <span className="foto-icon">👤</span>
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFotoChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        <button className="btn-foto" onClick={handleSelecionarFoto}>
          Alterar Foto
        </button>
      </div>

      {/* FORMULÁRIO DE SENHA */}
      <div className="senha-form">
        <div className="input-group">
          <input
            type="password"
            placeholder="Senha atual"
            value={senha.atual}
            onChange={(e) => setSenha(prev => ({...prev, atual: e.target.value}))}
          />
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="Nova senha"
            value={senha.nova}
            onChange={(e) => setSenha(prev => ({...prev, nova: e.target.value}))}
          />
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={senha.confirmacao}
            onChange={(e) => setSenha(prev => ({...prev, confirmacao: e.target.value}))}
          />
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <div className="botoes">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirmar" onClick={handleAlterarSenha}>
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarPerfil;