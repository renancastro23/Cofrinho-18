import { useMemo, useState } from "react";
import "../styles/management.css";

const MATERIALS = ["Plástico", "Papel", "Vidro", "Metal", "Alumínio", "Eletrônico", "Óleo", "Outro"];

function calcNivel(totalKg) {
  if (totalKg >= 50) return 6;
  if (totalKg >= 30) return 5;
  if (totalKg >= 15) return 4;
  if (totalKg >= 7) return 3;
  if (totalKg >= 3) return 2;
  return 1;
}

// (Mock) mesma chave usada no AdminDashboard
function directorPwdKeyById(id) {
  return `C18_DIRECTOR_PWD_${id}`;
}

// senha mínima
function isValidPasswordBasic(pwd) {
  const s = String(pwd || "");
  if (s.length < 8) return false;
  const hasLetter = /[A-Za-z]/.test(s);
  const hasNumber = /\d/.test(s);
  return hasLetter && hasNumber;
}

export default function DirectorDashboard() {
  // ======= Simulação do diretor logado =======
  // Quando você integrar login de verdade, esse id deve vir do token/user logado.
  const DIRECTOR_ID = 10;
  const DIRECTOR_EMAIL = "diretor@cofrinho18.com";

  // ===== Navegação =====
  const [tab, setTab] = useState("visao"); // visao | trocas | equipe | unidades | desafios | conta

  // ===== Unidades =====
  const [unidades, setUnidades] = useState([
    { id: 1, nome: "Turma Pré I - Manhã" },
    { id: 2, nome: "Maternal B - Tarde" },
  ]);

  // ===== Usuários subordinados ao diretor =====
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

  // ===== Cadastro usuário =====
  const [novoUsuario, setNovoUsuario] = useState({ nome: "", tipo: "", email: "" });
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(unidades[0]?.id || "");

  // ===== Filtros equipe =====
  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenacao, setOrdenacao] = useState("nomeAsc");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // ===== Desafios =====
  const [desafios, setDesafios] = useState([
    { id: 1, titulo: "Desafio do Dia", tipo: "Diário", descricao: "Recicle 400g em garrafas plásticas", prazo: "24h", metaKg: 0.4, recompensa: "1 moeda extra" },
  ]);

  const [novoDesafio, setNovoDesafio] = useState({ titulo: "", tipo: "Diário", descricao: "", prazo: "", metaKg: "", recompensa: "" });

  // ===== Unidades criação =====
  const [novoNomeUnidade, setNovoNomeUnidade] = useState("");

  // ===== Trocas =====
  const [trocas, setTrocas] = useState([
    { id: 1, userId: 1, userNome: "Prof. Lucas", unidadeId: 1, unidadeNome: "Turma Pré I - Manhã", material: "Plástico", pesoKg: 0.6, valorR$: 8.5, obs: "Garrafas PET", createdAt: new Date().toISOString() },
  ]);

  const [novaTroca, setNovaTroca] = useState({ material: "Plástico", pesoKg: "", valorR$: "", obs: "" });

  // ===== Autocomplete usuário =====
  const [userQuery, setUserQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);

  // ===== Filtros histórico =====
  const [trocasFiltroTexto, setTrocasFiltroTexto] = useState("");
  const [trocasFiltroUnidade, setTrocasFiltroUnidade] = useState("todas");
  const [trocasOrdenacao, setTrocasOrdenacao] = useState("dataDesc");

  // ===== Ranking =====
  const [rankingUnidadeId, setRankingUnidadeId] = useState(unidades[0]?.id || "");
  const [rankingOrdenacao, setRankingOrdenacao] = useState("kgDesc");

  // ===== Conta / troca de senha =====
  const [pwdForm, setPwdForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  // ======= Autocomplete helpers =======
  const selectedUser = useMemo(() => {
    return usuarios.find((u) => u.id === Number(selectedUserId)) || null;
  }, [usuarios, selectedUserId]);

  const userSuggestions = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return [];

    const filtered = usuarios.filter((u) => {
      const nome = (u.nome || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const unidade = (u.unidadeNome || "").toLowerCase();
      return nome.includes(q) || email.includes(q) || unidade.includes(q);
    });

    filtered.sort((a, b) => {
      const an = (a.nome || "").toLowerCase();
      const bn = (b.nome || "").toLowerCase();
      const aStarts = an.startsWith(q) ? 0 : 1;
      const bStarts = bn.startsWith(q) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return an.localeCompare(bn);
    });

    return filtered.slice(0, 8);
  }, [usuarios, userQuery]);

  function handlePickUser(u) {
    setSelectedUserId(u.id);
    setUserQuery(u.nome);
    setShowUserSuggestions(false);
  }

  function handleClearSelectedUser() {
    setSelectedUserId(null);
    setUserQuery("");
    setShowUserSuggestions(false);
  }

  // Segurança básica (frontend)
  function assertUserBelongsToDirectorUnits(user) {
    return unidades.some((un) => un.id === user.unidadeId);
  }

  // ======= equipe =======
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

    const unidade = unidades.find((u) => u.id === Number(unidadeSelecionada));
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

    setUsuarios((prev) => [...prev, novo]);
    setNovoUsuario({ nome: "", tipo: "", email: "" });
  }

  function handleCriarUnidade(e) {
    e.preventDefault();
    const nome = novoNomeUnidade.trim();
    if (!nome) return;

    const novaUnidade = { id: Date.now(), nome };
    setUnidades((prev) => [...prev, novaUnidade]);
    setNovoNomeUnidade("");

    if (!unidadeSelecionada) setUnidadeSelecionada(novaUnidade.id);
    if (!rankingUnidadeId) setRankingUnidadeId(novaUnidade.id);
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
        return (b.materiaisKg || 0) - (a.materiaisKg || 0);
      case "valorDesc":
        return (b.valorTotal || 0) - (a.valorTotal || 0);
      case "trocasDesc":
        return (b.trocas || 0) - (a.trocas || 0);
      default:
        return 0;
    }
  }

  const usuariosFiltrados = useMemo(() => {
    return [...usuarios]
      .filter((u) => {
        const texto = filtroTexto.toLowerCase();
        return (
          (u.nome || "").toLowerCase().includes(texto) ||
          (u.email || "").toLowerCase().includes(texto) ||
          (u.unidadeNome || "").toLowerCase().includes(texto) ||
          (u.tipo || "").toLowerCase().includes(texto)
        );
      })
      .sort(compararUsuarios);
  }, [usuarios, filtroTexto, ordenacao]);

  const totalMateriais = usuarios.reduce((acc, u) => acc + (u.materiaisKg || 0), 0);
  const totalValor = usuarios.reduce((acc, u) => acc + (u.valorTotal || 0), 0);

  function contarUsuariosDaUnidade(unidadeId) {
    return usuarios.filter((u) => u.unidadeId === unidadeId).length;
  }

  // ===== desafios =====
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
      metaKg: parseFloat(String(novoDesafio.metaKg || "0").replace(",", ".")),
      recompensa: novoDesafio.recompensa,
    };

    setDesafios((prev) => [...prev, novo]);
    setNovoDesafio({ titulo: "", tipo: "Diário", descricao: "", prazo: "", metaKg: "", recompensa: "" });
  }

  // ===== registrar troca =====
  function handleChangeNovaTroca(e) {
    const { name, value } = e.target;
    setNovaTroca((prev) => ({ ...prev, [name]: value }));
  }

  function handleRegistrarTroca(e) {
    e.preventDefault();

    if (!selectedUser) {
      alert("Selecione um usuário antes de registrar a troca.");
      return;
    }

    if (!assertUserBelongsToDirectorUnits(selectedUser)) {
      alert("Usuário não pertence a uma unidade sob sua gestão.");
      return;
    }

    const pesoKg = Number(String(novaTroca.pesoKg).replace(",", "."));
    const valor = Number(String(novaTroca.valorR$).replace(",", "."));

    if (!Number.isFinite(pesoKg) || pesoKg <= 0) {
      alert("Informe um peso (kg) válido.");
      return;
    }
    if (!Number.isFinite(valor) || valor < 0) {
      alert("Informe um valor (R$) válido.");
      return;
    }

    const material = novaTroca.material || "Outro";

    const item = {
      id: Date.now(),
      userId: selectedUser.id,
      userNome: selectedUser.nome,
      unidadeId: selectedUser.unidadeId,
      unidadeNome: selectedUser.unidadeNome,
      material,
      pesoKg,
      valorR$: valor,
      obs: (novaTroca.obs || "").trim(),
      createdAt: new Date().toISOString(),
    };

    setTrocas((prev) => [item, ...prev]);

    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id !== selectedUser.id) return u;
        return {
          ...u,
          materiaisKg: (u.materiaisKg || 0) + pesoKg,
          valorTotal: (u.valorTotal || 0) + valor,
          trocas: (u.trocas || 0) + 1,
        };
      })
    );

    setNovaTroca({ material: "Plástico", pesoKg: "", valorR$: "", obs: "" });
  }

  const trocasFiltradas = useMemo(() => {
    const texto = trocasFiltroTexto.toLowerCase();

    return [...trocas]
      .filter((t) => {
        const matchTexto =
          (t.userNome || "").toLowerCase().includes(texto) ||
          (t.unidadeNome || "").toLowerCase().includes(texto) ||
          (t.material || "").toLowerCase().includes(texto) ||
          (t.obs || "").toLowerCase().includes(texto);

        const matchUnidade =
          trocasFiltroUnidade === "todas" ? true : Number(trocasFiltroUnidade) === t.unidadeId;

        return matchTexto && matchUnidade;
      })
      .sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return trocasOrdenacao === "dataAsc" ? da - db : db - da;
      });
  }, [trocas, trocasFiltroTexto, trocasFiltroUnidade, trocasOrdenacao]);

  const ranking = useMemo(() => {
    const unidadeId = Number(rankingUnidadeId);

    const lista = usuarios
      .filter((u) => (unidadeId ? u.unidadeId === unidadeId : true))
      .map((u) => ({ ...u, nivel: calcNivel(u.materiaisKg || 0) }));

    lista.sort((a, b) => {
      switch (rankingOrdenacao) {
        case "kgDesc":
          return (b.materiaisKg || 0) - (a.materiaisKg || 0);
        case "valorDesc":
          return (b.valorTotal || 0) - (a.valorTotal || 0);
        case "trocasDesc":
          return (b.trocas || 0) - (a.trocas || 0);
        case "nomeAsc":
          return a.nome.localeCompare(b.nome);
        default:
          return 0;
      }
    });

    return lista;
  }, [usuarios, rankingUnidadeId, rankingOrdenacao]);

  // ======= Trocar senha (Diretor) =======
  function handleChangePwdForm(e) {
    const { name, value } = e.target;
    setPwdForm((p) => ({ ...p, [name]: value }));
  }

  function handleChangePassword(e) {
    e.preventDefault();

    const storedPwd = localStorage.getItem(directorPwdKeyById(DIRECTOR_ID)) || "";

    if (!pwdForm.senhaAtual) {
      alert("Informe sua senha atual.");
      return;
    }

    // MOCK: compara com localStorage (no backend será validação via API)
    if (pwdForm.senhaAtual !== storedPwd) {
      alert("Senha atual incorreta.");
      return;
    }

    if (!pwdForm.novaSenha) {
      alert("Informe a nova senha.");
      return;
    }

    if (pwdForm.novaSenha !== pwdForm.confirmarNovaSenha) {
      alert("A confirmação não confere.");
      return;
    }

    if (!isValidPasswordBasic(pwdForm.novaSenha)) {
      alert("Senha fraca. Use no mínimo 8 caracteres, com letras e números.");
      return;
    }

    if (pwdForm.novaSenha === pwdForm.senhaAtual) {
      alert("A nova senha precisa ser diferente da senha atual.");
      return;
    }

    localStorage.setItem(directorPwdKeyById(DIRECTOR_ID), pwdForm.novaSenha);
    setPwdForm({ senhaAtual: "", novaSenha: "", confirmarNovaSenha: "" });

    alert("Senha alterada com sucesso!");
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="app-logo-circle">18</div>
            <div className="app-title-group">
              <h1 className="app-title">Cofrinho dos 18</h1>
              <span className="app-subtitle">Painel do diretor da unidade</span>
            </div>
          </div>

          <div className="topbar-right">
            <span className="user-email">Olá, {DIRECTOR_EMAIL}</span>
            <button className="btn-outline" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <div className="dashboard-main">
          <nav className="dashboard-tabs">
            <button className={`tab-item ${tab === "visao" ? "tab-active" : ""}`} onClick={() => setTab("visao")}>Visão geral</button>
            <button className={`tab-item ${tab === "trocas" ? "tab-active" : ""}`} onClick={() => setTab("trocas")}>Trocas</button>
            <button className={`tab-item ${tab === "equipe" ? "tab-active" : ""}`} onClick={() => setTab("equipe")}>Equipe</button>
            <button className={`tab-item ${tab === "unidades" ? "tab-active" : ""}`} onClick={() => setTab("unidades")}>Unidades/Turmas</button>
            <button className={`tab-item ${tab === "desafios" ? "tab-active" : ""}`} onClick={() => setTab("desafios")}>Desafios</button>
            <button className={`tab-item ${tab === "conta" ? "tab-active" : ""}`} onClick={() => setTab("conta")}>Conta</button>
          </nav>

          <section className="dashboard-summary">
            <div className="dash-card">
              <span className="dash-card-label">Unidades/Turmas sob gestão</span>
              <strong className="dash-card-number">{unidades.length}</strong>
              <p className="dash-card-foot">Usuários vinculados às unidades do diretor</p>
            </div>

            <div className="dash-card">
              <span className="dash-card-label">Usuários cadastrados</span>
              <strong className="dash-card-number">{usuarios.length}</strong>
              <p className="dash-card-foot">Equipe/usuários ligados à unidade</p>
            </div>

            <div className="dash-card">
              <span className="dash-card-label">Material total registrado</span>
              <strong className="dash-card-number">{totalMateriais.toFixed(2)} kg</strong>
              <p className="dash-card-foot">Somatório do progresso da unidade</p>
            </div>

            <div className="dash-card dash-card-pill">
              <span className="dash-card-label">Valor total gerado</span>
              <strong className="dash-card-number">R$ {totalValor.toFixed(2)}</strong>
              <p className="dash-card-foot">Impacto acumulado da unidade</p>
            </div>
          </section>

          {/* ===== VISÃO ===== */}
          {tab === "visao" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Novo usuário</h2>
                <p className="dash-section-subtitle">Cadastre membros e vincule a uma unidade/turma.</p>

                <form className="dash-form" onSubmit={handleCriarUsuario}>
                  <div className="dash-form-group">
                    <label>Nome completo</label>
                    <input type="text" name="nome" value={novoUsuario.nome} onChange={handleChangeUsuario} required />
                  </div>

                  <div className="dash-form-group">
                    <label>Função</label>
                    <select name="tipo" value={novoUsuario.tipo} onChange={handleChangeUsuario} required>
                      <option value="">Selecione</option>
                      <option value="Professor">Professor</option>
                      <option value="Auxiliar">Auxiliar</option>
                      <option value="Secretaria">Secretaria</option>
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label>Unidade / Turma</label>
                    <select value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(Number(e.target.value))} required>
                      {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label>E-mail (opcional)</label>
                    <input type="email" name="email" value={novoUsuario.email} onChange={handleChangeUsuario} />
                  </div>

                  <button type="submit" className="btn-laranja btn-full">Criar usuário</button>
                </form>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Ranking da unidade</h2>
                <p className="dash-section-subtitle">Quem mais trocou material e gerou valor.</p>

                <div className="dash-filters">
                  <select value={rankingUnidadeId} onChange={(e) => setRankingUnidadeId(Number(e.target.value))} className="dash-filter-select">
                    {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                  </select>

                  <select value={rankingOrdenacao} onChange={(e) => setRankingOrdenacao(e.target.value)} className="dash-filter-select">
                    <option value="kgDesc">Maior peso (kg)</option>
                    <option value="valorDesc">Maior valor (R$)</option>
                    <option value="trocasDesc">Mais trocas</option>
                    <option value="nomeAsc">Nome (A–Z)</option>
                  </select>
                </div>

                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Nome</th><th>Nível</th><th>Kg</th><th>R$</th><th>Trocas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((u, idx) => (
                        <tr key={u.id}>
                          <td>{idx + 1}</td>
                          <td>{u.nome}</td>
                          <td><span className="pill">Nível {u.nivel}</span></td>
                          <td>{(u.materiaisKg || 0).toFixed(2)}</td>
                          <td>R$ {(u.valorTotal || 0).toFixed(2)}</td>
                          <td>{u.trocas || 0}</td>
                        </tr>
                      ))}
                      {ranking.length === 0 && <tr><td colSpan="6">Nenhum usuário nesta unidade ainda.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ===== TROCAS ===== */}
          {tab === "trocas" && (
            <>
              <section className="dashboard-content-grid">
                <div className="dash-card">
                  <h2 className="dash-section-title">Registrar troca</h2>
                  <p className="dash-section-subtitle">Selecione usuário via busca (autocomplete) e registre material, peso e valor.</p>

                  <form className="dash-form" onSubmit={handleRegistrarTroca}>
                    <div className="dash-form-group">
                      <label>Buscar usuário</label>

                      <div className="user-picker">
                        <input
                          type="text"
                          value={userQuery}
                          onChange={(e) => {
                            setUserQuery(e.target.value);
                            setShowUserSuggestions(true);
                            setSelectedUserId(null);
                          }}
                          onFocus={() => setShowUserSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowUserSuggestions(false), 120)}
                          placeholder="Digite nome, e-mail ou unidade..."
                          className="dash-filter-input"
                          autoComplete="off"
                        />

                        {selectedUser && (
                          <button type="button" className="btn-outline btn-xs" onClick={handleClearSelectedUser}>
                            Trocar
                          </button>
                        )}
                      </div>

                      {showUserSuggestions && userSuggestions.length > 0 && !selectedUser && (
                        <div className="suggestions" onMouseDown={(e) => e.preventDefault()}>
                          {userSuggestions.map((u) => (
                            <button type="button" key={u.id} className="suggestion-item" onClick={() => handlePickUser(u)}>
                              <div className="suggestion-main">
                                <span className="suggestion-name">{u.nome}</span>
                                <span className="suggestion-meta">{u.unidadeNome} • {u.tipo}</span>
                              </div>
                              <span className="pill">Nível {calcNivel(u.materiaisKg || 0)}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {showUserSuggestions && userQuery.trim() && userSuggestions.length === 0 && !selectedUser && (
                        <div className="suggestions-empty">Nenhum usuário encontrado.</div>
                      )}
                    </div>

                    {selectedUser && (
                      <div className="dash-detail-card">
                        <h3>Usuário selecionado</h3>
                        <p><strong>Nome:</strong> {selectedUser.nome}</p>
                        <p><strong>Unidade:</strong> {selectedUser.unidadeNome}</p>
                        <p><strong>Nível:</strong> {calcNivel(selectedUser.materiaisKg || 0)}</p>
                        <p><strong>Total acumulado:</strong> {(selectedUser.materiaisKg || 0).toFixed(2)} kg • R$ {(selectedUser.valorTotal || 0).toFixed(2)}</p>
                      </div>
                    )}

                    <div className="dash-form-group">
                      <label>Tipo de material</label>
                      <select name="material" value={novaTroca.material} onChange={handleChangeNovaTroca}>
                        {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>

                    <div className="dash-form-row">
                      <div className="dash-form-group">
                        <label>Peso (kg)</label>
                        <input name="pesoKg" value={novaTroca.pesoKg} onChange={handleChangeNovaTroca} placeholder="Ex.: 1.25" inputMode="decimal" required />
                      </div>
                      <div className="dash-form-group">
                        <label>Valor (R$)</label>
                        <input name="valorR$" value={novaTroca.valorR$} onChange={handleChangeNovaTroca} placeholder="Ex.: 6.50" inputMode="decimal" required />
                      </div>
                    </div>

                    <div className="dash-form-group">
                      <label>Observação (opcional)</label>
                      <input name="obs" value={novaTroca.obs} onChange={handleChangeNovaTroca} placeholder="Ex.: garrafas PET, papelão..." />
                    </div>

                    <button type="submit" className="btn-laranja btn-full">Registrar troca</button>

                    <div className="dash-hint">
                      Segurança real (backend): validar se o usuário pertence à unidade do diretor logado; caso contrário, retornar 403.
                    </div>
                  </form>
                </div>

                <div className="dash-card">
                  <h2 className="dash-section-title">Histórico de trocas</h2>

                  <div className="dash-filters">
                    <input className="dash-filter-input" placeholder="Buscar por usuário/unidade/material/obs..." value={trocasFiltroTexto} onChange={(e) => setTrocasFiltroTexto(e.target.value)} />
                    <select className="dash-filter-select" value={trocasFiltroUnidade} onChange={(e) => setTrocasFiltroUnidade(e.target.value)}>
                      <option value="todas">Todas as unidades</option>
                      {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                    </select>
                    <select className="dash-filter-select" value={trocasOrdenacao} onChange={(e) => setTrocasOrdenacao(e.target.value)}>
                      <option value="dataDesc">Mais recentes</option>
                      <option value="dataAsc">Mais antigas</option>
                    </select>
                  </div>

                  <div className="dash-table-wrapper">
                    <table className="dash-table">
                      <thead>
                        <tr><th>Data</th><th>Usuário</th><th>Unidade</th><th>Material</th><th>Peso (kg)</th><th>Valor (R$)</th><th>Obs.</th></tr>
                      </thead>
                      <tbody>
                        {trocasFiltradas.map((t) => (
                          <tr key={t.id}>
                            <td>{new Date(t.createdAt).toLocaleString()}</td>
                            <td>{t.userNome}</td>
                            <td>{t.unidadeNome}</td>
                            <td>{t.material}</td>
                            <td>{t.pesoKg.toFixed(2)}</td>
                            <td>R$ {t.valorR$.toFixed(2)}</td>
                            <td className="td-muted">{t.obs || "-"}</td>
                          </tr>
                        ))}
                        {trocasFiltradas.length === 0 && <tr><td colSpan="7">Nenhuma troca encontrada.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ===== EQUIPE ===== */}
          {tab === "equipe" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Equipe cadastrada</h2>

                <div className="dash-filters">
                  <input className="dash-filter-input" placeholder="Buscar por nome, função, unidade..." value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} />
                  <select className="dash-filter-select" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                    <option value="nomeAsc">Nome (A–Z)</option>
                    <option value="nomeDesc">Nome (Z–A)</option>
                    <option value="materialDesc">Mais material trocado</option>
                    <option value="valorDesc">Maior valor gerado</option>
                    <option value="trocasDesc">Mais trocas</option>
                  </select>
                </div>

                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr><th>Nome</th><th>Função</th><th>Unidade</th><th>Nível</th><th>Kg</th><th>R$</th><th>Trocas</th></tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((u) => (
                        <tr key={u.id} onClick={() => handleSelecionarUsuario(u)} className={usuarioSelecionado?.id === u.id ? "dash-row-selected" : ""}>
                          <td>{u.nome}</td>
                          <td>{u.tipo}</td>
                          <td>{u.unidadeNome}</td>
                          <td><span className="pill">Nível {calcNivel(u.materiaisKg || 0)}</span></td>
                          <td>{(u.materiaisKg || 0).toFixed(2)}</td>
                          <td>R$ {(u.valorTotal || 0).toFixed(2)}</td>
                          <td>{u.trocas || 0}</td>
                        </tr>
                      ))}
                      {usuariosFiltrados.length === 0 && <tr><td colSpan="7">Nenhum usuário encontrado.</td></tr>}
                    </tbody>
                  </table>
                </div>

                {usuarioSelecionado && (
                  <div className="dash-detail-card">
                    <h3>Resumo do usuário</h3>
                    <p><strong>Nome:</strong> {usuarioSelecionado.nome}</p>
                    <p><strong>Função:</strong> {usuarioSelecionado.tipo}</p>
                    <p><strong>Unidade:</strong> {usuarioSelecionado.unidadeNome}</p>
                    <p><strong>E-mail:</strong> {usuarioSelecionado.email || "-"}</p>
                    <p><strong>Nível:</strong> {calcNivel(usuarioSelecionado.materiaisKg || 0)}</p>
                    <p><strong>Material:</strong> {(usuarioSelecionado.materiaisKg || 0).toFixed(2)} kg</p>
                    <p><strong>Valor:</strong> R$ {(usuarioSelecionado.valorTotal || 0).toFixed(2)}</p>
                    <p><strong>Trocas:</strong> {usuarioSelecionado.trocas || 0}</p>
                  </div>
                )}
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Observação</h2>
                <p className="dash-section-subtitle">Registro de trocas e atualização de progresso/ranking estão na aba “Trocas”.</p>
              </div>
            </section>
          )}

          {/* ===== UNIDADES ===== */}
          {tab === "unidades" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Minhas unidades / turmas</h2>
                <p className="dash-section-subtitle">Crie novas turmas e organize seus usuários.</p>

                <ul className="unit-list">
                  {unidades.map((u) => (
                    <li key={u.id} className="unit-item">
                      <div className="unit-main">
                        <span className="unit-name">{u.nome}</span>
                        <span className="unit-meta">{contarUsuariosDaUnidade(u.id)} usuário(s) vinculados</span>
                      </div>
                      <span className="unit-badge">Unidade</span>
                    </li>
                  ))}
                </ul>

                <form className="unit-form-inline" onSubmit={handleCriarUnidade}>
                  <label style={{ fontSize: "0.75rem", color: "#6b7280" }}>Criar nova unidade/turma</label>
                  <input type="text" value={novoNomeUnidade} onChange={(e) => setNovoNomeUnidade(e.target.value)} placeholder="Ex.: Jardim II - Manhã" />
                  <button type="submit" className="btn-laranja">Adicionar unidade</button>
                </form>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Dica</h2>
                <p className="dash-section-subtitle">No backend, unidades do diretor devem filtrar e proteger todo acesso.</p>
              </div>
            </section>
          )}

          {/* ===== DESAFIOS ===== */}
          {tab === "desafios" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Novo desafio</h2>
                <p className="dash-section-subtitle">Desafios aparecem para os usuários na página principal.</p>

                <form className="dash-form" onSubmit={handleCriarDesafio}>
                  <div className="dash-form-group">
                    <label>Título</label>
                    <input type="text" name="titulo" value={novoDesafio.titulo} onChange={handleChangeDesafio} required />
                  </div>

                  <div className="dash-form-group">
                    <label>Tipo</label>
                    <select name="tipo" value={novoDesafio.tipo} onChange={handleChangeDesafio}>
                      <option value="Diário">Diário</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Mensal">Mensal</option>
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label>Descrição</label>
                    <input type="text" name="descricao" value={novoDesafio.descricao} onChange={handleChangeDesafio} required />
                  </div>

                  <div className="dash-form-group">
                    <label>Prazo</label>
                    <input type="text" name="prazo" value={novoDesafio.prazo} onChange={handleChangeDesafio} />
                  </div>

                  <div className="dash-form-group">
                    <label>Meta em kg (opcional)</label>
                    <input type="number" step="0.01" name="metaKg" value={novoDesafio.metaKg} onChange={handleChangeDesafio} />
                  </div>

                  <div className="dash-form-group">
                    <label>Recompensa (opcional)</label>
                    <input type="text" name="recompensa" value={novoDesafio.recompensa} onChange={handleChangeDesafio} />
                  </div>

                  <button type="submit" className="btn-laranja btn-full">Criar desafio</button>
                </form>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Desafios cadastrados</h2>
                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr><th>Título</th><th>Tipo</th><th>Prazo</th><th>Meta (kg)</th><th>Recompensa</th></tr>
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
                      {desafios.length === 0 && <tr><td colSpan="5">Nenhum desafio cadastrado ainda.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ===== CONTA / TROCAR SENHA ===== */}
          {tab === "conta" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Minha conta</h2>
                <p className="dash-section-subtitle">Aqui você gerencia sua segurança. Troque sua senha quando quiser.</p>

                <div className="dash-detail-card">
                  <p><strong>E-mail:</strong> {DIRECTOR_EMAIL}</p>
                  <p className="td-muted">Dica: use uma senha forte e não compartilhe com ninguém.</p>
                </div>

                <h2 className="dash-section-title" style={{ marginTop: "1rem" }}>Trocar senha</h2>

                <form className="dash-form" onSubmit={handleChangePassword}>
                  <div className="dash-form-group">
                    <label>Senha atual</label>
                    <input type="password" name="senhaAtual" value={pwdForm.senhaAtual} onChange={handleChangePwdForm} required />
                  </div>

                  <div className="dash-form-row">
                    <div className="dash-form-group">
                      <label>Nova senha</label>
                      <input type="password" name="novaSenha" value={pwdForm.novaSenha} onChange={handleChangePwdForm} required />
                    </div>
                    <div className="dash-form-group">
                      <label>Confirmar nova senha</label>
                      <input type="password" name="confirmarNovaSenha" value={pwdForm.confirmarNovaSenha} onChange={handleChangePwdForm} required />
                    </div>
                  </div>

                  <div className="dash-hint">Regras: mínimo 8 caracteres, com letras e números.</div>
                  <button type="submit" className="btn-laranja btn-full">Salvar nova senha</button>

                  <div className="dash-hint">
                    (Mock) Esta validação está usando localStorage. No backend: validar senha atual, gerar hash e registrar auditoria.
                  </div>
                </form>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Segurança (recomendado)</h2>
                <ul className="dash-ul">
                  <li>Depois de integrar a API, você pode forçar logout após trocar senha (mais seguro).</li>
                  <li>Registrar auditoria: “diretor trocou senha” com data/hora e IP.</li>
                  <li>Bloquear tentativas repetidas (rate limit) para evitar ataque de força bruta.</li>
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
