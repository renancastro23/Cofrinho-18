import "../styles/QuemSomos.css";
import Logo from "../assets/logo.png"
import Cae from "../assets/cae.png"

function QuemSomos() {
  return (
    <div className="quem-container">
      <div className="quem-card">
        <div className="quem-header">
          <img
            src= {Logo} // substitua pelo logo do Seu Porquinho
            alt="Logo Seu Porquinho"
            className="quem-logo"
          />
          <h1 className="quem-titulo">Quem somos</h1>
        </div>

        <div className="quem-conteudo">
          <img
            src= {Cae} // coloque aqui sua imagem do porquinho
            alt="Porquinho mascote"
            className="quem-img"
          />
          <p>
            O Centro de Apoio Escolar (CAE) é mais do que uma empresa: somos um movimento dedicado a transformar a educação e gerar impacto social positivo. Nosso compromisso é criar projetos inovadores que unam aprendizado, inclusão e desenvolvimento humano, sempre com foco em preparar crianças e jovens para um futuro melhor.
          </p>
          <p>
            Com uma atuação voltada principalmente para regiões periféricas, acreditamos que a educação de qualidade é uma das ferramentas mais poderosas de transformação social. Por isso, trabalhamos lado a lado com escolas, instituições e comunidades para oferecer soluções que vão além da sala de aula.
          </p>
          <p>
            Nossos projetos unem criatividade, tecnologia e responsabilidade social, proporcionando experiências educativas que incentivam o pensamento crítico, a sustentabilidade e a cidadania.
          </p>
          <p>
            Entre nossas iniciativas está o Cofrinho dos 18, um projeto que une educação financeira e consciência ambiental de forma prática e divertida, mostrando que pequenas atitudes podem gerar grandes conquistas.
          </p>
          <p>
            O Centro de Apoio Escolar é movido por uma certeza: toda criança merece oportunidades para crescer, aprender e realizar seus sonhos. É com esse propósito que seguimos desenvolvendo programas, parcerias e ferramentas que impactam vidas e abrem caminhos para um futuro mais justo e sustentável.
          </p>
        </div>
      </div>

      <div className="dica-card">
        <h2>Dica do Dia</h2>
        <p>💡 Proteja o meio ambiente, pois nosso futuro depende dele!</p>
      </div>
    </div>
  );
}

export default QuemSomos;
