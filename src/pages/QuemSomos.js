import React from "react";
import "../styles/Pages.css";

const QuemSomos = () => {
  return (
    <main className="page">
      <section className="card">
        <h1 className="title">Quem Somos</h1>
        <p>
          Somos um time apaixonado por educação financeira. Unimos design, tecnologia e psicologia de hábitos
          para tornar a jornada de economizar mais leve e divertida.
        </p>
        <ul className="bullets">
          <li>💙 Compromisso com o usuário</li>
          <li>🧡 Transparência e simplicidade</li>
          <li>🚀 Evolução contínua do produto</li>
        </ul>
      </section>
    </main>
  );
};

export default QuemSomos;
