import '../../styles/Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Fundo escuro semi-transparente */}
      <div className="modal-backdrop" onClick={onClose} />
      
      {/* Janela do modal */}
      <div className="modal-window">
        {/* Cabeçalho com título centralizado */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>
        
        {/* Conteúdo (vai receber children dinamicamente) */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;