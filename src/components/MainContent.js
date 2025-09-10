import React from "react";
import "../styles/MainContent.css";

const feedItems = [
  "Desafio 1: Economize 10% essa semana",
  "Notícia: Novo recurso de porquinho chegou!",
  "Desafio 2: Doe 5 vezes",
  "Notícia: Ranking atualizado",
];

const MainContent = () => (
  <main className="container">
    <div className="column side">
      <h2>Ranking Semanal</h2>
      <ul>
        <li>João – 150 pts</li>
        <li>Maria – 135 pts</li>
        <li>Pedro – 120 pts</li>
        <li>Ana – 110 pts</li>
        <li>Lucas – 95 pts</li>
      </ul>
    </div>

    <div className="column center">
      <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Porquinho" />
      <div className="progress-bar">
        <div className="progress"></div>
      </div>
      <div className="feed">
        {feedItems.map((item, idx) => (
          <div key={idx} className="feed-item">{item}</div>
        ))}
      </div>
    </div>

    <div className="column side">
      <h2>Atualizações</h2>
      <ul>
        <li>Novo desafio disponível!</li>
        <li>Dica da semana publicada.</li>
        <li>Evento ao vivo às 20h.</li>
      </ul>
    </div>
  </main>
);

export default MainContent;
