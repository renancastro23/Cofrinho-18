import "../styles/Sobre.css";

function Sobre() {
  return (
    <div className="sobre-container">
      <div className="sobre-card">
        <div className="sobre-header">
          <img
            src="/assets/logo.png" // Substitua pelo logo do Seu Porquinho
            alt="Logo Seu Porquinho"
            className="sobre-logo"
          />
          <h1 className="sobre-titulo">Sobre o Projeto</h1>
        </div>

        <div className="sobre-conteudo">
          <p>
            O <strong>Seu Porquinho</strong> é uma plataforma criada para
            estimular a educação financeira e o consumo consciente entre jovens.
            Através do sistema de desafios e metas, os usuários aprendem a
            economizar, investir e cuidar melhor do seu dinheiro.
          </p>

          <p>
            Nosso objetivo é criar um impacto positivo na forma como as pessoas
            lidam com suas finanças, tornando o aprendizado divertido, acessível
            e recompensador.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
