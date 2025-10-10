import { useState, useRef, useEffect } from 'react';
import '../../styles/Balancebar.css';

const BalanceBar = () => {
  const [visualizacao, setView] = useState('graph'); // 'graph' or 'ranking'

  const ranking = [
    { name: 'João', pts: 150 },
    { name: 'Maria', pts: 135 },
    { name: 'Pedro', pts: 120 },
    { name: 'Ana', pts: 110 },
    { name: 'Lucas', pts: 95 },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (isOpen && listRef.current && !listRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const options = [
    { key: 'graph', label: 'Gráfico' },
    { key: 'ranking', label: 'Ranking' },
  ];

  return (
    <div className="material-summary">
      <div className="material-header">
        <h4
          className="graph-title"
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((s) => !s)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen((s) => !s); if (e.key === 'Escape') setIsOpen(false); }}
        >
          Total de Material Reciclado (Mês)
          <span className="caret">▾</span>
        </h4>

        <div className="listbox" ref={listRef}>
          {isOpen && (
            <div className="listbox-options" role="listbox" aria-label="Escolha visualização">
              {visualizacao !== 'ranking' ? (
                <div
                  role="option"
                  tabIndex={0}
                  className="listbox-option"
                  onClick={() => { setView('ranking'); setIsOpen(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setView('ranking'); setIsOpen(false); } }}
                >
                  Ranking Semanal
                </div>
              ) : (
                <div
                  role="option"
                  tabIndex={0}
                  className="listbox-option"
                  onClick={() => { setView('graph'); setIsOpen(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setView('graph'); setIsOpen(false); } }}
                >
                  Total de Material Reciclado (Mês)
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {visualizacao === 'graph' ? (
        <div className="bar" aria-hidden={visualizacao !== 'graph'}>
          <div className="plastic" style={{ width: '55%' }} data-tooltip="plastico">Plástico (55 kg)</div>
          <div className="paper" style={{ width: '15%' }}>Papel (15 kg)</div>
          <div className="metal" style={{ width: '10%' }}>Metal (10 kg)</div>
          <div className="glass" style={{ width: '10%' }}>Vidro (10 kg)</div>
        </div>
      ) : (
        <div className="week-ranking" aria-hidden={visualizacao !== 'ranking'}>
          <ol>
            {ranking.map((r) => (
              <li key={r.name}>{r.name} — {r.pts} pts</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default BalanceBar;
