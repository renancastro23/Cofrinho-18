import { useMemo, useState } from "react";
import "../styles/management.css";

export default function DirectorDashboard() {
  // Unidades/turmas sob gestão desse diretor
  const [unidades, setUnidades] = useState([
    {
      id: 1,
      nome: "Turma Pré I - Manhã",
    },
    {
      id: 2,
      nome: "Maternal B - Tarde",
    },
  ]);

  // Usuários subordinados ao diretor, SEMPRE ligados a uma unidade
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Prof. Lucas",
      tipo: "Professor",
      unidadeId: 1,
      unidadeNome: "Turma Pré I - Manhã",
      email: "lucas@escola.com",
      materiaisKg: 4.2,
      valorTotal: 120.5,
      trocas: 3,
    },
    {
      id: 2,
      nome: "Tia Ana",
      tipo: "Auxiliar",
      unidadeId: 2,
      unidadeNome: "Maternal B - Tarde",
      email: "ana@escola.com",
      materiaisKg: 1.8,
      valorTotal: 48.75,
      trocas: 2,
    },
  ]);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    tipo: "",
    email: "",
  });
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(
    unidades[0] ? unidades[0].id : ""
  );

  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenacao, setOrdenacao] = useState("nomeAsc");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // Desafios atrelados à unidade do diretor
  const [desafios, setDesafios] = useState([
    {
      id: 1,
      titulo: "Desafio do Dia",
      tipo: "Diário",
      descricao: "Recicle 400g em garrafas plásticas",
      prazo: "24h",
      metaKg: 0.4,
      recompensa: "1 moeda extra",
    },
    {
      id: 2,
      titulo: "Meta da Semana",
      tipo: "Semanal",
      descricao: "Realizar 5 entregas de material",
      prazo: "7 dias",
      metaKg: 3,
      recompensa: "Medalha dourada",
    },
  ]);

  const [novoDesafio, setNovoDesafio] = useState({
    titulo: "",
    tipo: "Diário",
    descricao: "",
    prazo: "",
    metaKg: "",
    recompensa: "",
  });

  // Nova unidade/turma que o diretor pode criar
  const [novoNomeUnidade, setNovoNomeUnidade] = useState("");

  function handleChangeUsuario(e) {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  }

  function handleCriarUsuario(e) {
    e.preventDefault();

    if (!unidadeSelecionada) {
      alert("Selecione uma unidade/turma para o usuário.");
      return;
    }

    const unidade = unidades.find(
      (u) => u.id === Number(unidadeSelecionada)
    );

    if (!unidade) {
      alert("Unidade inválida.");
      return;
    }

    const novo = {
      id: Date.now(),
      nome: novoUsuario.nome,
      tipo: novoUsuario.tipo,
      unidadeId: unidade.id,
      unidadeNome: unidade.nome,
      email: novoUsuario.email,
      materiaisKg: 0,
      valorTotal: 0,
      trocas: 0,
    };

    // futuramente: POST /usuarios, garantindo UnidadeId vinculada a esse diretor
    setUsuarios((prev) => [...prev, novo]);
    setNovoUsuario({ nome: "", tipo: "", email: "" });
  }

  function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  function handleSelecionarUsuario(u) {
    setUsuarioSelecionado(u);
  }

  function compararUsuarios(a, b) {
    switch (ordenacao) {
      case "nomeAsc":
        return a.nome.localeCompare(b.nome);
      case "nomeDesc":
        return b.nome.localeCompare(a.nome);
      case "materialDesc":
        return b.materiaisKg - a.materiaisKg;
      case "valorDesc":
        return b.valorTotal - a.valorTotal;
      case "trocasDesc":
        return b.trocas - a.trocas;
      default:
        return 0;
    }
  }

  const usuariosFiltrados = useMemo(() => {
    return [...usuarios]
      .filter((u) => {
        const texto = filtroTexto.toLowerCase();
        return (
          u.nome.toLowerCase().includes(texto) ||
          u.email.toLowerCase().includes(texto) ||
          u.unidadeNome.toLowerCase().includes(texto) ||
          u.tipo.toLowerCase().includes(texto)
        );
      })
      .sort(compararUsuarios);
  }, [usuarios, filtroTexto, ordenacao]);

  const totalMateriais = usuarios.reduce(
    (acc, u) => acc + u.materiaisKg,
    0
  );
  const totalValor = usuarios.reduce((acc, u) => acc + u.valorTotal, 0);

  // total de usuários por unidade (para mostrar na lista de unidades)
  function contarUsuariosDaUnidade(unidadeId) {
    return usuarios.filter((u) => u.unidadeId === unidadeId).length;
  }

  function handleChangeDesafio(e) {
    const { name, value } = e.target;
    setNovoDesafio((prev) => ({ ...prev, [name]: value }));
  }

  function handleCriarDesafio(e) {
    e.preventDefault();

    const novo = {
      id: Date.now(),
      titulo: novoDesafio.titulo,
      tipo: novoDesafio.tipo,
      descricao: novoDesafio.descricao,
      prazo: novoDesafio.prazo,
      metaKg: parseFloat(novoDesafio.metaKg || "0"),
      recompensa: novoDesafio.recompensa,
    };

    // futuramente: POST /desafios, vinculando às unidades do diretor
    setDesafios((prev) => [...prev, novo]);
    setNovoDesafio({
      titulo: "",
      tipo: "Diário",
      descricao: "",
      prazo: "",
      metaKg: "",
      recompensa: "",
    });
  }

  function handleCriarUnidade(e) {
    e.preventDefault();
    const nome = novoNomeUnidade.trim();
    if (!nome) return;

    const novaUnidade = {
      id: Date.now(),
      nome,
    };

    // futuramente: POST /unidades com DiretorId = diretor logado
    setUnidades((prev) => [...prev, novaUnidade]);
    setNovoNomeUnidade("");
    if (!unidadeSelecionada) {
      setUnidadeSelecionada(novaUnidade.id);
    }
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        {/* topo */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="app-logo-circle">18</div>
            <div className="app-title-group">
              <h1 className="app-title">Cofrinho dos 18</h1>
              <span className="app-subtitle">
                Painel do diretor da unidade
              </span>
            </div>
          </div>

          <div className="topbar-right">
            <span className="user-email">
              Olá, diretor@cofrinho18.com
            </span>
            <button className="btn-outline" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        <div className="dashboard-main">
          {/* Abas focadas no diretor */}
          <nav className="dashboard-tabs">
            <button className="tab-item tab-active">Visão geral</button>
          </nav>

          {/* Indicadores principais da unidade do diretor */}
          <section className="dashboard-summary">
            <div className="dash-card">
              <span className="dash-card-label">
                Unidades/Turmas sob gestão
              </span>
              <strong className="dash-card-number">
                {unidades.length}
              </strong>
              <p className="dash-card-foot">
                Cada usuário é vinculado a uma dessas unidades
              </p>
            </div>

            <div className="dash-card">
              <span className="dash-card-label">
                Usuários da unidade
              </span>
              <strong className="dash-card-number">
                {usuarios.length}
              </strong>
              <p className="dash-card-foot">
                Professores e colaboradores cadastrados
              </p>
            </div>

            <div className="dash-card">
              <span className="dash-card-label">
                Material total trocado
              </span>
              <strong className="dash-card-number">
                {totalMateriais.toFixed(2)} kg
              </strong>
              <p className="dash-card-foot">
                Resultado da sua unidade no programa
              </p>
            </div>

            <div className="dash-card dash-card-pill">
              <span className="dash-card-label">Desafios ativos</span>
              <strong className="dash-card-number">
                {desafios.length}
              </strong>
              <p className="dash-card-foot">
                Disponíveis para os alunos no Cofrinho
              </p>
            </div>
          </section>

          {/* Cadastro de usuários + equipe */}
          <section className="dashboard-content-grid">
            <div className="dash-card">
              <h2 className="dash-section-title">Novo usuário</h2>
              <p className="dash-section-subtitle">
                Cadastre professores, auxiliares e demais membros da
                equipe, sempre vinculados a uma unidade/turma.
              </p>

              <form className="dash-form" onSubmit={handleCriarUsuario}>
                <div className="dash-form-group">
                  <label>Nome completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={novoUsuario.nome}
                    onChange={handleChangeUsuario}
                    required
                  />
                </div>

                <div className="dash-form-group">
                  <label>Função</label>
                  <select
                    name="tipo"
                    value={novoUsuario.tipo}
                    onChange={handleChangeUsuario}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Professor">Professor</option>
                    <option value="Auxiliar">Auxiliar</option>
                    <option value="Secretaria">Secretaria</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Unidade / Turma</label>
                  <select
                    value={unidadeSelecionada}
                    onChange={(e) =>
                      setUnidadeSelecionada(Number(e.target.value))
                    }
                    required
                  >
                    {unidades.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                    {unidades.length === 0 && (
                      <option value="">
                        Nenhuma unidade cadastrada ainda
                      </option>
                    )}
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>E-mail (opcional)</label>
                  <input
                    type="email"
                    name="email"
                    value={novoUsuario.email}
                    onChange={handleChangeUsuario}
                  />
                </div>

                <button type="submit" className="btn-laranja btn-full">
                  Criar usuário
                </button>
              </form>
            </div>

            <div className="dash-card">
              <h2 className="dash-section-title">Equipe cadastrada</h2>

              <div className="dash-filters">
                <input
                  type="text"
                  placeholder="Buscar por nome, função, unidade..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="dash-filter-input"
                />

                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="dash-filter-select"
                >
                  <option value="nomeAsc">Nome (A–Z)</option>
                  <option value="nomeDesc">Nome (Z–A)</option>
                  <option value="materialDesc">
                    Mais material trocado
                  </option>
                  <option value="valorDesc">
                    Maior valor gerado
                  </option>
                  <option value="trocasDesc">
                    Mais trocas registradas
                  </option>
                </select>
              </div>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Função</th>
                      <th>Unidade/Turma</th>
                      <th>Material (kg)</th>
                      <th>Valor (R$)</th>
                      <th>Trocas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u) => (
                      <tr
                        key={u.id}
                        onClick={() => handleSelecionarUsuario(u)}
                        className={
                          usuarioSelecionado &&
                          usuarioSelecionado.id === u.id
                            ? "dash-row-selected"
                            : ""
                        }
                      >
                        <td>{u.nome}</td>
                        <td>{u.tipo}</td>
                        <td>{u.unidadeNome}</td>
                        <td>{u.materiaisKg.toFixed(2)}</td>
                        <td>R$ {u.valorTotal.toFixed(2)}</td>
                        <td>{u.trocas}</td>
                      </tr>
                    ))}
                    {usuariosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="6">Nenhum usuário encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {usuarioSelecionado && (
                <div className="dash-detail-card">
                  <h3>Resumo do usuário</h3>
                  <p>
                    <strong>Nome:</strong> {usuarioSelecionado.nome}
                  </p>
                  <p>
                    <strong>Função:</strong> {usuarioSelecionado.tipo}
                  </p>
                  <p>
                    <strong>Unidade/Turma:</strong>{" "}
                    {usuarioSelecionado.unidadeNome}
                  </p>
                  <p>
                    <strong>E-mail:</strong>{" "}
                    {usuarioSelecionado.email || "-"}
                  </p>
                  <p>
                    <strong>Material trocado:</strong>{" "}
                    {usuarioSelecionado.materiaisKg.toFixed(2)} kg
                  </p>
                  <p>
                    <strong>Valor gerado:</strong> R$
                    {usuarioSelecionado.valorTotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>Trocas registradas:</strong>{" "}
                    {usuarioSelecionado.trocas}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Unidades/turmas + Desafios */}
          <section className="dashboard-extra-grid">
            {/* Minhas unidades/turmas */}
            <div className="dash-card">
              <h2 className="dash-section-title">
                Minhas unidades / turmas
              </h2>
              <p className="dash-section-subtitle">
                Cada unidade agrupa usuários e alunos que participam do
                Cofrinho dos 18 sob sua gestão.
              </p>

              {unidades.length === 0 && (
                <p style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                  Nenhuma unidade cadastrada ainda. Crie a primeira
                  unidade utilizando o formulário abaixo.
                </p>
              )}

              <ul className="unit-list">
                {unidades.map((u) => (
                  <li key={u.id} className="unit-item">
                    <div className="unit-main">
                      <span className="unit-name">{u.nome}</span>
                      <span className="unit-meta">
                        {contarUsuariosDaUnidade(u.id)} usuário(s)
                        vinculados
                      </span>
                    </div>
                    <span className="unit-badge">Unidade</span>
                  </li>
                ))}
              </ul>

              <form
                className="unit-form-inline"
                onSubmit={handleCriarUnidade}
              >
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                  }}
                >
                  Criar nova unidade/turma
                </label>
                <input
                  type="text"
                  value={novoNomeUnidade}
                  onChange={(e) => setNovoNomeUnidade(e.target.value)}
                  placeholder="Ex.: Jardim II - Manhã"
                />
                <button type="submit" className="btn-laranja">
                  Adicionar unidade
                </button>
              </form>
            </div>

            {/* Desafios */}
            <div className="dash-card">
              <h2 className="dash-section-title">
                Desafios de reciclagem
              </h2>
              <p className="dash-section-subtitle">
                Os desafios aparecem para os alunos na área do Cofrinho
                e estimulam a troca de materiais recicláveis.
              </p>

              <form className="dash-form" onSubmit={handleCriarDesafio}>
                <div className="dash-form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={novoDesafio.titulo}
                    onChange={handleChangeDesafio}
                    required
                  />
                </div>

                <div className="dash-form-group">
                  <label>Tipo</label>
                  <select
                    name="tipo"
                    value={novoDesafio.tipo}
                    onChange={handleChangeDesafio}
                  >
                    <option value="Diário">Diário</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensal">Mensal</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Descrição</label>
                  <input
                    type="text"
                    name="descricao"
                    value={novoDesafio.descricao}
                    onChange={handleChangeDesafio}
                    required
                  />
                </div>

                <div className="dash-form-group">
                  <label>Prazo (ex.: 24h, 7 dias)</label>
                  <input
                    type="text"
                    name="prazo"
                    value={novoDesafio.prazo}
                    onChange={handleChangeDesafio}
                  />
                </div>

                <div className="dash-form-group">
                  <label>Meta em kg (opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="metaKg"
                    value={novoDesafio.metaKg}
                    onChange={handleChangeDesafio}
                  />
                </div>

                <div className="dash-form-group">
                  <label>Recompensa (opcional)</label>
                  <input
                    type="text"
                    name="recompensa"
                    value={novoDesafio.recompensa}
                    onChange={handleChangeDesafio}
                    placeholder="Moedas, medalhas, prêmios..."
                  />
                </div>

                <button type="submit" className="btn-laranja btn-full">
                  Criar desafio
                </button>
              </form>

              <div className="dash-table-wrapper" style={{ marginTop: "1rem" }}>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Prazo</th>
                      <th>Meta (kg)</th>
                      <th>Recompensa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {desafios.map((d) => (
                      <tr key={d.id}>
                        <td>{d.titulo}</td>
                        <td>{d.tipo}</td>
                        <td>{d.prazo}</td>
                        <td>{d.metaKg ? d.metaKg.toFixed(2) : "-"}</td>
                        <td>{d.recompensa || "-"}</td>
                      </tr>
                    ))}
                    {desafios.length === 0 && (
                      <tr>
                        <td colSpan="5">
                          Nenhum desafio cadastrado ainda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
