import "../styles/Sobre.css";
import Logo from "../assets/logo.png"

function Sobre() {
  return (
    <div className="sobre-container">
      <div className="sobre-card">
        <div className="sobre-header">
          <img
            src= {Logo} // Substitua pelo logo do Seu Porquinho
            alt="Logo Seu Porquinho"
            className="sobre-logo"
          />
          <h1 className="sobre-titulo">Sobre o Projeto</h1>
        </div>

        <div className="sobre-conteudo">
          <p>
            O <strong>Cofrinho dos 18</strong> O Cofrinho dos 18 nasceu com o propósito de unir educação financeira e consciência ambiental em uma experiência simples, prática e transformadora. A ideia é mostrar, desde cedo, que pequenas atitudes podem gerar grandes conquistas.
          </p>
          <p> No projeto, cada material reciclável entregue se transforma em valor depositado na poupança do participante, que cresce junto com ele até os 18 anos. Dessa forma, a criança aprende a importância de cuidar do planeta e, ao mesmo tempo, descobre o valor de planejar e poupar para o futuro.
          </p>
          <p>Além disso, o Cofrinho dos 18 conta com uma plataforma digital interativa que torna essa jornada ainda mais divertida. O participante acompanha sua evolução através de um porquinho virtual, que cresce a cada nova troca, participa de desafios, sobe de nível e se mantém motivado para continuar.
          </p>
          <p>Mais do que um projeto, o Cofrinho dos 18 é um caminho de aprendizado, sustentabilidade e esperança. Ele prepara os jovens para o futuro e mostra que reciclar é investir em si mesmo.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
