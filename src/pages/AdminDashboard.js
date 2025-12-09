import { useMemo, useState } from "react";
import "../styles/management.css";

export default function AdminDashboard() {
  // cada diretor administra pelo menos uma unidade
  const [diretores, setDiretores] = useState([
    {
      id: 1,
      nome: "Diretor João",
      email: "joao@colegio.com",
      unidadeNome: "Escola Comunitária Centro",
      materiaisKg: 12.5,
      valorTotal: 345.7,
      trocas: 8,
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Diretora Ana",
      email: "ana@colegio.com",
      unidadeNome: "Creche Esperança - Zona Sul",
      materiaisKg: 7.2,
      valorTotal: 198.3,
      trocas: 5,
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Diretor Carlos",
      email: "carlos@colegio.com",
      unidadeNome: "Projeto Social Norte",
      materiaisKg: 0,
      valorTotal: 0,
      trocas: 0,
      status: "Inativo",
    },
  ]);

  // unidades são derivadas dos diretores (1 diretor = 1 unidade, por enquanto)
  const unidades = useMemo(
    () =>
      diretores.map((d) => ({
        id: d.id,
        nome: d.unidadeNome,
        diretorId: d.id,
        ativa: d.status === "Ativo",
        materiaisKg: d.materiaisKg,
        valorTotal: d.valorTotal,
      })),
    [diretores]
  );

  const [novoDiretor, setNovoDiretor] = useState({
    nome: "",
    email: "",
    senha: "",
    unidadeNome: "",
  });

  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenacao, setOrdenacao] = useState("nomeAsc");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [diretorSelecionado, setDiretorSelecionado] = useState(null);

  function handleChangeNovoDiretor(e) {
    const { name, value } = e.target;
    setNovoDiretor((prev) => ({ ...prev, [name]: value }));
  }

  function handleCriarDiretor(e) {
    e.preventDefault();

    const id = Date.now();
    const unidadeNome =
      novoDiretor.unidadeNome || "Unidade sem nome definida";

    const novo = {
      id,
      nome: novoDiretor.nome,
      email: novoDiretor.email,
      unidadeNome,
      materiaisKg: 0,
      valorTotal: 0,
      trocas: 0,
      status: "Ativo",
    };

    // futuramente: POST /diretores + POST /unidades
    setDiretores((prev) => [...prev, novo]);
    setNovoDiretor({
      nome: "",
      email: "",
      senha: "",
      unidadeNome: "",
    });
  }

  function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  function handleSelecionarDiretor(diretor) {
    setDiretorSelecionado(diretor);
  }

  function compararDiretores(a, b) {
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

  const diretoresFiltrados = useMemo(() => {
    return [...diretores]
      .filter((d) => {
        const texto = filtroTexto.toLowerCase();
        const matchTexto =
          d.nome.toLowerCase().includes(texto) ||
          d.email.toLowerCase().includes(texto) ||
          d.unidadeNome.toLowerCase().includes(texto);

        const matchStatus =
          filtroStatus === "todos" ? true : d.status === filtroStatus;

        return matchTexto && matchStatus;
      })
      .sort(compararDiretores);
  }, [diretores, filtroTexto, filtroStatus, ordenacao]);

  const totalUnidades = unidades.length;
  const unidadesAtivas = unidades.filter((u) => u.ativa).length;
  const totalMateriais = unidades.reduce(
    (acc, u) => acc + u.materiaisKg,
    0
  );
  const totalValor = unidades.reduce((acc, u) => acc + u.valorTotal, 0);

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        {/* Topo do painel */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="app-logo-circle">18</div>
            <div className="app-title-group">
              <h1 className="app-title">Cofrinho dos 18</h1>
              <span className="app-subtitle">
                Painel do administrador geral
              </span>
            </div>
          </div>

          <div className="topbar-right">
            <span className="user-email">
              Olá, admin@cofrinho18.com
            </span>
            <button className="btn-outline" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        <div className="dashboard-main">
          {/* Abas focadas no que o admin realmente faz */}
          <nav className="dashboard-tabs">
            <button className="tab-item tab-active">Visão geral</button>

          </nav>

          {/* Indicadores principais */}
          <section className="dashboard-summary">
            <div className="dash-card">
              <span className="dash-card-label">
                Diretores cadastrados
              </span>
              <strong className="dash-card-number">
                {diretores.length}
              </strong>
              <p className="dash-card-foot">
                Responsáveis pelas unidades do programa
              </p>
            </div>

            <div className="dash-card">
              <span className="dash-card-label">
                Unidades cadastradas
              </span>
              <strong className="dash-card-number">
                {totalUnidades}
              </strong>
              <p className="dash-card-foot">
                {unidadesAtivas} unidades ativas no momento
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
                Soma de todas as unidades participantes
              </p>
            </div>

            <div className="dash-card dash-card-pill">
              <span className="dash-card-label">
                Valor gerado em reciclagem
              </span>
              <strong className="dash-card-number">
                R$ {totalValor.toFixed(2)}
              </strong>
              <p className="dash-card-foot">
                Impacto financeiro total do Cofrinho dos 18
              </p>
            </div>
          </section>

          {/* Cadastro de diretor + lista de diretores/unidades */}
          <section className="dashboard-content-grid">
            {/* Cadastro de diretor e unidade */}
            <div className="dash-card">
              <h2 className="dash-section-title">
                Novo diretor de unidade
              </h2>
              <p className="dash-section-subtitle">
                Ao criar um diretor, uma unidade é vinculada a ele
                automaticamente (escola, creche ou projeto social).
              </p>

              <form className="dash-form" onSubmit={handleCriarDiretor}>
                <div className="dash-form-group">
                  <label>Nome do diretor</label>
                  <input
                    type="text"
                    name="nome"
                    value={novoDiretor.nome}
                    onChange={handleChangeNovoDiretor}
                    required
                  />
                </div>

                <div className="dash-form-group">
                  <label>E-mail de acesso</label>
                  <input
                    type="email"
                    name="email"
                    value={novoDiretor.email}
                    onChange={handleChangeNovoDiretor}
                    required
                  />
                </div>

                <div className="dash-form-group">
                  <label>Nome da unidade</label>
                  <input
                    type="text"
                    name="unidadeNome"
                    value={novoDiretor.unidadeNome}
                    onChange={handleChangeNovoDiretor}
                    placeholder="Ex.: Creche Comunitária Jardim das Flores"
                  />
                </div>

                <div className="dash-form-group">
                  <label>Senha inicial</label>
                  <input
                    type="password"
                    name="senha"
                    value={novoDiretor.senha}
                    onChange={handleChangeNovoDiretor}
                    required
                  />
                </div>

                <button type="submit" className="btn-laranja btn-full">
                  Criar diretor e unidade
                </button>
              </form>
            </div>

            {/* Lista de diretores + resumo da unidade */}
            <div className="dash-card">
              <h2 className="dash-section-title">
                Diretores e suas unidades
              </h2>

              <div className="dash-filters">
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou unidade..."
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

                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="dash-filter-select"
                >
                  <option value="todos">Todos</option>
                  <option value="Ativo">Ativos</option>
                  <option value="Inativo">Inativos</option>
                </select>
              </div>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Diretor</th>
                      <th>Unidade</th>
                      <th>Material (kg)</th>
                      <th>Valor (R$)</th>
                      <th>Trocas</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diretoresFiltrados.map((d) => (
                      <tr
                        key={d.id}
                        onClick={() => handleSelecionarDiretor(d)}
                        className={
                          diretorSelecionado &&
                          diretorSelecionado.id === d.id
                            ? "dash-row-selected"
                            : ""
                        }
                      >
                        <td>{d.nome}</td>
                        <td>{d.unidadeNome}</td>
                        <td>{d.materiaisKg.toFixed(2)}</td>
                        <td>R$ {d.valorTotal.toFixed(2)}</td>
                        <td>{d.trocas}</td>
                        <td>{d.status}</td>
                      </tr>
                    ))}
                    {diretoresFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="6">Nenhum diretor encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {diretorSelecionado && (
                <div className="dash-detail-card">
                  <h3>Resumo da unidade</h3>
                  <p>
                    <strong>Diretor:</strong> {diretorSelecionado.nome}
                  </p>
                  <p>
                    <strong>E-mail:</strong> {diretorSelecionado.email}
                  </p>
                  <p>
                    <strong>Unidade:</strong>{" "}
                    {diretorSelecionado.unidadeNome}
                  </p>
                  <p>
                    <strong>Material trocado:</strong>{" "}
                    {diretorSelecionado.materiaisKg.toFixed(2)} kg
                  </p>
                  <p>
                    <strong>Valor gerado:</strong> R$
                    {diretorSelecionado.valorTotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>Trocas registradas:</strong>{" "}
                    {diretorSelecionado.trocas}
                  </p>
                  <p>
                    <strong>Status:</strong> {diretorSelecionado.status}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
