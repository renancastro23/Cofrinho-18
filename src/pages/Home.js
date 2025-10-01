// src/pages/Home.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import porquinho from "../assets/home/porquinho.jpg";
import troca from "../assets/home/troca.jpg";
import dinheiro from "../assets/home/dinheiro.jpg";
import ponto from "../assets/home/ponto.jpg";



/**
 * Home em formato de feed (seções empilhadas, 1 coluna).
 * Seções: Hero • O que é • O que você vai encontrar • Como funciona • Faça parte
 * Dica: substitua os <img src> pelos seus arquivos reais quando estiverem prontos.
 */
const Home = () => {
  const navigate = useNavigate();

  // Efeito de revelar blocos ao rolar
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="home-feed">
      {/* Topbar */}
      <header className="feed-topbar">
        <div className="brand">
          <div className="logo">🐷</div>
          <span className="name">Seu Porquinho</span>
        </div>
        <button className="btn outline" onClick={() => navigate("/login")}>Entrar</button>
      </header>

      {/* HERO */}
      <section className="feed-block hero reveal">
        <h1 className="hero-title">
          Bem-vindo ao <span className="highlight">Cofrinho dos 18</span>
        </h1>
        <p className="hero-subtitle">
          Educação financeira e reciclagem unidas em uma jornada gamificada — com desafios,
          níveis e um feed que te acompanha passo a passo.
        </p>
        <div className="level-box">
          <div className="bar"><div className="fill" style={{ width: "65%" }} /></div>
         
        </div>
        <div className="cta-row">
          <button className="btn primary" onClick={() => navigate("/login")}>Começar agora</button>
          <button className="btn ghost" onClick={() => document.getElementById("oque-e")?.scrollIntoView({ behavior: "smooth" })}>
            Conhecer o projeto
          </button>
        </div>
      </section>

      {/* O QUE É (texto em bloco + imagem abaixo) */}
      <section id="oque-e" className="feed-block reveal">
        <h2>O que é</h2>
        <p>
          O <strong>Cofrinho dos 18</strong> é muito mais do que um simples cofrinho: é um projeto pensado para transformar a maneira como crianças e adolescentes enxergam o valor do dinheiro e o poder de construir sonhos a longo prazo.

            A ideia é simples e poderosa: incentivar desde cedo o hábito de poupar, mostrando que cada moeda guardada é um passo em direção a um futuro cheio de conquistas. Aos poucos, o cofrinho vai se enchendo e, junto com ele, cresce a consciência financeira, a disciplina e a responsabilidade.

            Mas o Cofrinho dos 18 não é só sobre guardar dinheiro. Ele representa um caminho até a maioridade, onde cada contribuição se torna parte de uma jornada especial. Ao chegar aos 18 anos, esse tesouro acumulado não será apenas financeiro, mas também simbólico: o resultado de anos de esforço, foco e aprendizado.

            Imagine a emoção de abrir esse cofrinho e perceber que ali está reunida não apenas economia, mas também histórias, metas e a possibilidade real de dar os primeiros passos rumo a uma vida adulta mais segura e independente.

            O Cofrinho dos 18 é um convite para sonhar grande, planejar desde cedo e transformar pequenas atitudes em grandes conquistas.
        </p>

        {/* IMAGEM DO PORQUINHO — troque pelo seu arquivo */}
        <figure className="media-figure">
          <img
            src= {porquinho}
            alt="Símbolo do porquinho (placeholder)"
            className="img-cover"
          />
        </figure>
      </section>

      {/* O QUE VOCÊ VAI ENCONTRAR (texto + imagens empilhadas) */}
      <section className="feed-block reveal">
        <h2>O que você vai encontrar</h2>
        <p>
          O Cofrinho dos 18 não é apenas um projeto — é uma experiência digital pensada para engajar, ensinar e motivar. Ao acessar o site, cada participante terá acesso a um universo interativo onde educação financeira e sustentabilidade se encontram de forma lúdica e divertida.
        </p>

        <p><strong>✨ Perfil do Usuário</strong></p>
          <p>Cada criança ou adolescente terá seu próprio espaço personalizado, com informações sobre suas trocas, conquistas e evolução dentro do projeto.
        </p>

        <p><strong>📊 Dashboard Inteligente</strong></p>
          <p>Administradores poderão acompanhar em tempo real os valores depositados, a quantidade de materiais reciclados e todo o progresso individual e coletivo.
        </p>

        <p><strong>🎮 Níveis do Usuário</strong></p>
          <p>A cada troca, o participante sobe de nível. É como um jogo: quanto mais recicla, mais cresce dentro da plataforma, desbloqueando novas conquistas e mantendo a motivação sempre em alta.
        </p>

        <p><strong>🏆 Desafios Periódicos e Ranking</strong></p>
          <p>O site traz desafios divertidos que incentivam a reciclagem e a economia, além de um ranking que mostra quem mais contribuiu no período. Isso cria um clima saudável de competição e cooperação entre os participantes.
        </p>

        <p><strong>🐷 Porquinho Virtual</strong></p>
          <p>O grande protagonista! O porquinho vai crescendo a cada depósito na poupança, tornando visível o progresso financeiro do participante. É um companheiro virtual que motiva e comemora cada conquista.
        </p>

        <p><strong>💡 Muito mais!</strong></p>
         <p> Conteúdos educativos, notificações de novos desafios e relatórios simples ajudam a tornar o processo ainda mais enriquecedor, conectando aprendizado, meio ambiente e futuro financeiro.</p>
      
        <p>O site do Cofrinho dos 18 é um portal de descobertas, conquistas e sonhos, feito para encantar as crianças, engajar as escolas e inspirar famílias.</p>

        <p>👉 Participe dessa experiência e veja o futuro tomando forma, uma troca de reciclável de cada vez! </p>
       

        {/* Imagens do site — coloque seus screenshots reais abaixo */}
      <div className="image-grid">
        <figure className="media-figure">
          <img src="/assets/home/tela-1.png" alt="Tela do site (placeholder 1)" className="img-cover" />
          <figcaption>Exemplo de tela 1</figcaption>
        </figure>
        <figure className="media-figure">
          <img src="/assets/home/tela-2.png" alt="Tela do site (placeholder 2)" className="img-cover" />
          <figcaption>Exemplo de tela 2</figcaption>
        </figure>
        <figure className="media-figure">
          <img src="/assets/home/tela-3.png" alt="Tela do site (placeholder 3)" className="img-cover" />
          <figcaption>Exemplo de tela 3</figcaption>
        </figure>
      </div>
      </section>

      {/* COMO FUNCIONA (vários parágrafos empilhados) */}
      <section className="feed-block reveal">
        <h2>Como funciona</h2>
        <p>
          No <strong>Cofrinho dos 18</strong>, cada garrafa plástica, latinha ou papel reciclado deixa de ser apenas “lixo” e se transforma em oportunidade. O funcionamento é simples, educativo e sustentável:

          As próprias unidades do projeto se tornam pontos de troca de materiais recicláveis. A cada entrega, os resíduos são pesados, avaliados e convertidos em valores que vão diretamente para a poupança do participante. Ou seja, quanto mais materiais recicláveis a criança ou adolescente acumular, maior será o valor depositado em seu cofrinho até os 18 anos.

          Esse processo cria um ciclo positivo:

          O planeta agradece, porque menos resíduos vão para o meio ambiente.

          A comunidade ganha, porque aprende a importância da reciclagem.

          O participante cresce, pois cada troca fortalece a disciplina financeira e enche de orgulho ao ver o resultado.

          E tem mais: tudo é acompanhado de forma divertida e interativa no site do Cofrinho dos 18. Lá, cada participante tem seu perfil com um porquinho virtual, que vai crescendo a cada troca realizada. Junto com o porquinho, o personagem também sobe de nível, como em um jogo, desbloqueando conquistas e visualizando o progresso rumo aos 18 anos.

          Assim, o Cofrinho dos 18 transforma reciclagem em aprendizado, resíduos em economia e pequenas atitudes em grandes conquistas para o futuro.
        </p>

        {/* imagem opcional de fluxo */}
      {/* imagens de fluxo (lado a lado) */}
<div className="image-grid">
  <figure className="media-figure">
    <img src={dinheiro} alt="Fluxo do projeto (placeholder)" className="img-cover" />
    <figcaption>Fluxo ilustrativo do projeto</figcaption>
  </figure>

  <figure className="media-figure">
    <img src={troca} alt="Fluxo do projeto (placeholder)" className="img-cover" />
    <figcaption>Fluxo ilustrativo do projeto</figcaption>
  </figure>

  <figure className="media-figure">
    <img src={ponto} alt="Fluxo do projeto (placeholder)" className="img-cover" />
    <figcaption>Fluxo ilustrativo do projeto</figcaption>
  </figure>
</div>

      </section>

      {/* FAÇA PARTE (call to action) */}
      <section className="feed-block cta reveal">
        <h2>Faça parte</h2>
        <p>
          Quer transformar a educação financeira e a consciência ambiental dos seus alunos de forma divertida e prática? 🚀
          Entre em contato conosco pelo formulário de e-mail e faça um orçamento personalizado para a sua <strong>instituição de ensino</strong>.
        </p>
        <p><strong>💡 Educação financeira e sustentabilidade na prática. Descubra como trazer o projeto para sua instituição — clique em Saiba Mais</strong>.</p>
        <button className="btn primary big" onClick={() => navigate("/contato-publico")}>
          Saiba mais
        </button>
      </section>

      <footer className="feed-footer">
        <small>© {new Date().getFullYear()} Cofrinho dos 18 — todos os direitos reservados.</small>
      </footer>
    </main>
  );
};

export default Home;
