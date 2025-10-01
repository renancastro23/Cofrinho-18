import React, { useEffect, useState } from "react";
import "../styles/PageBase.css";

const initial = {
  instituicao: "",
  representante: "",
  tipoInstituicao: "", // pública | privada | conveniada
  email: "",
  telefone: "",
  whatsapp: "",
  mensagem: "",
};

const ContatoPublico = () => {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState(null);

  // animação "reveal"
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.instituicao.trim()) return "Informe o nome da instituição.";
    if (!form.representante.trim()) return "Informe o nome do representante.";
    if (!form.tipoInstituicao) return "Selecione o tipo da instituição.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Informe um e-mail válido.";
    if (!form.telefone.trim()) return "Informe um telefone para contato.";
    if (!form.whatsapp.trim()) return "Informe um WhatsApp para contato.";
    if (!form.mensagem.trim()) return "Escreva uma mensagem.";
    return null;
    // Obs.: você pode sofisticar a validação (ex.: máscara BR), se quiser depois.
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    const error = validate();
    if (error) {
      setStatus({ type: "error", msg: error });
      return;
    }

    // Monta e abre o e-mail (mailto)
    const to = "contato@seudominio.com"; // <-- ajuste aqui o e-mail oficial
    const subject = "Solicitação de Orçamento"; // assunto fixo
    const bodyLines = [
      "Olá, equipe Seu Porquinho!",
      "",
      "Tenho interesse em orçamento/participação. Seguem os dados:",
      `Instituição: ${form.instituicao}`,
      `Representante: ${form.representante}`,
      `Tipo de Instituição: ${form.tipoInstituicao}`,
      `E-mail: ${form.email}`,
      `Telefone: ${form.telefone}`,
      `WhatsApp: ${form.whatsapp}`,
      "",
      "Mensagem:",
      form.mensagem,
      "",
      "— Enviado via formulário do site",
    ];
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    // abre o cliente de e-mail
    window.location.href = mailto;

    // feedback visual
    setStatus({ type: "success", msg: "Abrindo seu cliente de e-mail…" });
    setForm(initial);
  };

  return (
    <main className="page">
      <section className="page-content reveal">
        <div className="title-row">
  <h1>Contato para Instituições</h1>
</div>

        <p>
          Esta é a forma oficial para uma <strong>instituição de ensino</strong> entrar em contato com a nossa equipe.
          Preencha os campos abaixo e clique em enviar — seu cliente de e-mail abrirá com o assunto
          <em> “Solicitação de Orçamento”</em>.
        </p>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label>
            Nome da Instituição
            <input
              type="text"
              name="instituicao"
              placeholder="Ex.: Escola Municipal ABC"
              value={form.instituicao}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Nome do Representante
            <input
              type="text"
              name="representante"
              placeholder="Ex.: Maria Silva"
              value={form.representante}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Tipo de Instituição
            <select
              name="tipoInstituicao"
              value={form.tipoInstituicao}
              onChange={onChange}
              required
            >
              <option value="" disabled>Selecione</option>
              <option value="pública">Pública</option>
              <option value="privada">Privada</option>
              <option value="conveniada">Conveniada</option>
            </select>
          </label>

          <label>
            E-mail para contato
            <input
              type="email"
              name="email"
              placeholder="contato@instituicao.com.br"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Telefone
            <input
              type="tel"
              name="telefone"
              placeholder="(00) 0000-0000"
              value={form.telefone}
              onChange={onChange}
              required
            />
          </label>

          <label>
            WhatsApp
            <input
              type="tel"
              name="whatsapp"
              placeholder="(00) 00000-0000"
              value={form.whatsapp}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Mensagem
            <textarea
              name="mensagem"
              rows="6"
              placeholder="Conte-nos sobre sua instituição, objetivos e demandas…"
              value={form.mensagem}
              onChange={onChange}
              required
            />
          </label>

          <button className="btn primary" type="submit">Enviar</button>

          {status && (
            <div className={`alert ${status.type}`} role="status" aria-live="polite">
              {status.msg}
            </div>
          )}
        </form>
      </section>

      <footer className="page-footer">
        <small>© {new Date().getFullYear()} Seu Porquinho</small>
      </footer>
    </main>
  );
};

export default ContatoPublico;
