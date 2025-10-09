import React from "react";
import "../styles/QuemSomos.css";

function QuemSomos() {
  return (
    <div className="quem-container">
      <div className="quem-card">
        <div className="quem-header">
          <img
            src="/assets/logo.png" // substitua pelo logo do Seu Porquinho
            alt="Logo Seu Porquinho"
            className="quem-logo"
          />
          <h1 className="quem-titulo">Quem somos</h1>
        </div>

        <div className="quem-conteudo">
          <img
            src="/assets/porquinho.png" // coloque aqui sua imagem do porquinho
            alt="Porquinho mascote"
            className="quem-img"
          />
          <p>
            Somos uma plataforma de recompensas que incentiva a educação
            financeira de maneira divertida e educativa.
          </p>
          <p>
            Nosso objetivo é tornar o aprendizado sobre finanças mais acessível
            e inspirador, premiando quem faz a diferença com suas boas práticas
            e metas alcançadas.
          </p>
        </div>
      </div>

      <div className="dica-card">
        <h2>Dica do Dia</h2>
        <p>💡 Economize parte da sua mesada todo mês e veja seu porquinho crescer!</p>
      </div>
    </div>
  );
}

export default QuemSomos;
