
import porquinhokids from "../assets/principal/porquinho-kids.jpg";

const feedItems = [
  { type: "desafio", text: "Desafio: Economize 10% essa semana" },
  { type: "noticia", text: "Notícia: Novo recurso do porquinho chegou!" },
  { type: "desafio", text: "Desafio: Doe 5 vezes neste mês" },
  { type: "noticia", text: "Notícia: Ranking semanal atualizado" },
];

const Principal = () => {
  return (
    <main className="container">
      {/* ESQUERDA - menor */}
      <aside className="column side">
        <h2 className="card-title">Ranking Semanal</h2>
        <ul className="list">
          <li>🐷 João – 150 pts</li>
          <li>🐷 Maria – 135 pts</li>
          <li>🐷 Pedro – 120 pts</li>
          <li>🐷 Ana – 110 pts</li>
          <li>🐷 Lucas – 95 pts</li>
        </ul>
      </aside>

      {/* CENTRO - maior */}
      <section className="column center">
        <img className="pig" src= {porquinhokids} alt="Porquinho" />
        <div className="progress-bar" aria-label="Nível">
          <div className="progress" style={{ width: "60%" }} />
        </div>

        <div className="feed">
          {feedItems.map((item, i) => (
            <article key={i} className={`feed-item ${item.type}`}>
              <span className="badge">{item.type === "desafio" ? "Desafio" : "Notícia"}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* DIREITA - menor */}
      <aside className="column side">
        <h2 className="card-title">Atualizações</h2>
        <ul className="list">
          <li>🔥 Novo desafio disponível!</li>
          <li>💡 Dica da semana publicada.</li>
          <li>📢 Evento ao vivo às 20h.</li>
        </ul>
      </aside>
    </main>
  );
};

export default Principal;
