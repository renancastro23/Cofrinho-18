import { useMemo, useState } from "react";
import "../styles/management.css";

// ========= Helpers =========
function onlyDigits(v = "") {
  return String(v).replace(/\D/g, "");
}

function formatCPF(v = "") {
  const d = onlyDigits(v).slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  let out = p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "-" + p4;
  return out;
}

function isValidCPFBasic(cpf) {
  const d = onlyDigits(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;
  return true;
}

function isValidPasswordBasic(pwd) {
  const s = String(pwd || "");
  if (s.length < 8) return false;
  const hasLetter = /[A-Za-z]/.test(s);
  const hasNumber = /\d/.test(s);
  return hasLetter && hasNumber;
}

// LocalStorage key (mock) — no backend você remove isso e usa API
function directorPwdKeyById(id) {
  return `C18_DIRECTOR_PWD_${id}`;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("visao"); // visao | diretores | unidades | usuarios | auditoria

  // ===== Diretores =====
  const [diretores, setDiretores] = useState([
    {
      id: 10,
      nome: "Diretora Juliana",
      email: "juliana@cofrinho18.com",
      cpf: "123.456.789-10",
      telefone: "(11) 90000-0000",
      ativo: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 11,
      nome: "Diretor Marcos",
      email: "marcos@cofrinho18.com",
      cpf: "987.654.321-00",
      telefone: "(11) 98888-1111",
      ativo: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [novoDiretor, setNovoDiretor] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const [filtroDiretor, setFiltroDiretor] = useState("");
  const [ordenacaoDiretor, setOrdenacaoDiretor] = useState("nomeAsc"); // nomeAsc | nomeDesc | recente | ativo

  // ===== Unidades =====
  const [unidades, setUnidades] = useState([
    {
      id: 1,
      nome: "Unidade Centro - Turma Pré I",
      endereco: "Rua A, 123",
      diretorId: 10,
      createdAt: new Date().toISOString(),
      ativa: true,
    },
    {
      id: 2,
      nome: "Unidade Zona Sul - Maternal B",
      endereco: "Av. B, 500",
      diretorId: 11,
      createdAt: new Date().toISOString(),
      ativa: true,
    },
  ]);

  const [novaUnidade, setNovaUnidade] = useState({
    nome: "",
    endereco: "",
    diretorId: "",
  });

  const [filtroUnidade, setFiltroUnidade] = useState("");
  const [ordenacaoUnidade, setOrdenacaoUnidade] = useState("nomeAsc"); // nomeAsc | recente | diretor

  // ===== Usuários (visão global) =====
  const [usuarios, setUsuarios] = useState([
    {
      id: 201,
      nome: "Prof. Lucas",
      email: "lucas@escola.com",
      unidadeId: 1,
      materiaisKg: 4.2,
      valorTotal: 120.5,
      trocas: 3,
      ativo: true,
    },
    {
      id: 202,
      nome: "Tia Ana",
      email: "ana@escola.com",
      unidadeId: 2,
      materiaisKg: 1.8,
      valorTotal: 48.75,
      trocas: 2,
      ativo: true,
    },
  ]);

  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [ordenacaoUsuario, setOrdenacaoUsuario] = useState("nomeAsc"); // nomeAsc | kgDesc | valorDesc | trocasDesc | unidade

  // ===== Modais =====
  // modal types:
  // { type: 'editUnit', unitId }
  // { type: 'confirmDeleteDirector', directorId }
  // { type: 'confirmDeleteUnit', unitId }
  // { type: 'resetDirectorPassword', directorId }
  const [modal, setModal] = useState(null);

  const [editUnitForm, setEditUnitForm] = useState({
    nome: "",
    endereco: "",
    diretorId: "",
    ativa: true,
  });

  const [resetPwdForm, setResetPwdForm] = useState({
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  // ===== Auditoria simples (mock) =====
  const [audit, setAudit] = useState([
    { id: 1, when: new Date().toISOString(), who: "admin", action: "Login realizado" },
  ]);

  function logAction(action) {
    setAudit((prev) => [
      { id: Date.now(), when: new Date().toISOString(), who: "admin", action },
      ...prev,
    ]);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  // ===== Helpers =====
  const diretoresById = useMemo(() => {
    const map = new Map();
    diretores.forEach((d) => map.set(d.id, d));
    return map;
  }, [diretores]);

  function getDiretorName(diretorId) {
    const d = diretoresById.get(Number(diretorId));
    return d ? d.nome : "—";
  }

  function usersCountByUnit(unitId) {
    return usuarios.filter((u) => u.unidadeId === unitId).length;
  }

  function unitsCountByDirector(directorId) {
    return unidades.filter((u) => u.diretorId === directorId).length;
  }

  // =========================
  // Diretores - Criar + Ativar/Desativar + Excluir + Reset Senha
  // =========================
  function handleChangeNovoDiretor(e) {
    const { name, value } = e.target;
    if (name === "cpf") {
      setNovoDiretor((p) => ({ ...p, cpf: formatCPF(value) }));
      return;
    }
    setNovoDiretor((p) => ({ ...p, [name]: value }));
  }

  function handleCreateDirector(e) {
    e.preventDefault();

    if (!novoDiretor.nome.trim()) {
      alert("Informe o nome do diretor.");
      return;
    }
    if (!novoDiretor.email.trim()) {
      alert("Informe o e-mail do diretor.");
      return;
    }
    if (!isValidCPFBasic(novoDiretor.cpf)) {
      alert("CPF inválido. Verifique e tente novamente.");
      return;
    }

    // CPF único
    const cpfDigits = onlyDigits(novoDiretor.cpf);
    const cpfJaExiste = diretores.some((d) => onlyDigits(d.cpf) === cpfDigits);
    if (cpfJaExiste) {
      alert("Já existe um diretor cadastrado com este CPF.");
      return;
    }

    // Senha obrigatória + validação
    if (!novoDiretor.senha) {
      alert("Informe uma senha para o diretor.");
      return;
    }
    if (novoDiretor.senha !== novoDiretor.confirmarSenha) {
      alert("As senhas não conferem.");
      return;
    }
    if (!isValidPasswordBasic(novoDiretor.senha)) {
      alert("Senha fraca. Use no mínimo 8 caracteres, com letras e números.");
      return;
    }

    const novoId = Date.now();

    const novo = {
      id: novoId,
      nome: novoDiretor.nome.trim(),
      email: novoDiretor.email.trim().toLowerCase(),
      cpf: formatCPF(novoDiretor.cpf),
      telefone: novoDiretor.telefone.trim(),
      ativo: true,
      createdAt: new Date().toISOString(),
    };

    setDiretores((prev) => [novo, ...prev]);

    // MOCK de senha no localStorage (substituir por API + hash no backend)
    localStorage.setItem(directorPwdKeyById(novoId), novoDiretor.senha);

    setNovoDiretor({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      senha: "",
      confirmarSenha: "",
    });

    logAction(`Diretor criado: ${novo.nome} (CPF ${novo.cpf})`);
  }

  function handleToggleDirectorActive(directorId) {
    const d = diretoresById.get(directorId);
    if (!d) return;

    setDiretores((prev) =>
      prev.map((x) => (x.id === directorId ? { ...x, ativo: !x.ativo } : x))
    );

    logAction(`Diretor ${d.ativo ? "desativado" : "ativado"}: ${d.nome}`);
  }

  function requestDeleteDirector(directorId) {
    setModal({ type: "confirmDeleteDirector", directorId });
  }

  function confirmDeleteDirector(directorId) {
    const d = diretoresById.get(directorId);
    if (!d) return;

    const countUnits = unitsCountByDirector(directorId);
    if (countUnits > 0) {
      alert("Não é possível excluir: este diretor ainda administra unidade(s). Troque o diretor das unidades antes.");
      return;
    }

    setDiretores((prev) => prev.filter((x) => x.id !== directorId));
    localStorage.removeItem(directorPwdKeyById(directorId)); // mock
    setModal(null);
    logAction(`Diretor excluído: ${d.nome}`);
  }

  function requestResetDirectorPassword(directorId) {
    setResetPwdForm({ novaSenha: "", confirmarNovaSenha: "" });
    setModal({ type: "resetDirectorPassword", directorId });
  }

  function confirmResetDirectorPassword(directorId) {
    const d = diretoresById.get(directorId);
    if (!d) return;

    if (!resetPwdForm.novaSenha) {
      alert("Informe a nova senha.");
      return;
    }
    if (resetPwdForm.novaSenha !== resetPwdForm.confirmarNovaSenha) {
      alert("As senhas não conferem.");
      return;
    }
    if (!isValidPasswordBasic(resetPwdForm.novaSenha)) {
      alert("Senha fraca. Use no mínimo 8 caracteres, com letras e números.");
      return;
    }

    // MOCK localStorage (backend depois)
    localStorage.setItem(directorPwdKeyById(directorId), resetPwdForm.novaSenha);

    setModal(null);
    logAction(`Admin resetou senha do diretor: ${d.nome}`);
  }

  // =========================
  // Unidades - Criar / Editar / Excluir
  // =========================
  function handleChangeNovaUnidade(e) {
    const { name, value } = e.target;
    setNovaUnidade((p) => ({ ...p, [name]: value }));
  }

  function handleCreateUnit(e) {
    e.preventDefault();

    if (!novaUnidade.nome.trim()) {
      alert("Informe o nome da unidade.");
      return;
    }
    if (!novaUnidade.diretorId) {
      alert("Selecione o diretor responsável.");
      return;
    }

    const diretorExiste = diretoresById.has(Number(novaUnidade.diretorId));
    if (!diretorExiste) {
      alert("Diretor inválido.");
      return;
    }

    const unit = {
      id: Date.now(),
      nome: novaUnidade.nome.trim(),
      endereco: (novaUnidade.endereco || "").trim(),
      diretorId: Number(novaUnidade.diretorId),
      ativa: true,
      createdAt: new Date().toISOString(),
    };

    setUnidades((prev) => [unit, ...prev]);
    setNovaUnidade({ nome: "", endereco: "", diretorId: "" });
    logAction(`Unidade criada: ${unit.nome} (Diretor: ${getDiretorName(unit.diretorId)})`);
  }

  function requestEditUnit(unitId) {
    const u = unidades.find((x) => x.id === unitId);
    if (!u) return;

    setEditUnitForm({
      nome: u.nome,
      endereco: u.endereco || "",
      diretorId: String(u.diretorId || ""),
      ativa: !!u.ativa,
    });

    setModal({ type: "editUnit", unitId });
  }

  function handleSaveEditUnit(unitId) {
    const u = unidades.find((x) => x.id === unitId);
    if (!u) return;

    if (!editUnitForm.nome.trim()) {
      alert("Informe o nome da unidade.");
      return;
    }
    if (!editUnitForm.diretorId) {
      alert("Selecione o diretor responsável.");
      return;
    }

    const novoDiretorId = Number(editUnitForm.diretorId);
    const diretorExiste = diretoresById.has(novoDiretorId);
    if (!diretorExiste) {
      alert("Diretor inválido.");
      return;
    }

    setUnidades((prev) =>
      prev.map((x) =>
        x.id === unitId
          ? {
              ...x,
              nome: editUnitForm.nome.trim(),
              endereco: editUnitForm.endereco.trim(),
              diretorId: novoDiretorId,
              ativa: !!editUnitForm.ativa,
            }
          : x
      )
    );

    const diretorAntes = getDiretorName(u.diretorId);
    const diretorDepois = getDiretorName(novoDiretorId);
    logAction(`Unidade editada: ${u.nome} → ${editUnitForm.nome.trim()} | Diretor: ${diretorAntes} → ${diretorDepois}`);

    setModal(null);
  }

  function requestDeleteUnit(unitId) {
    setModal({ type: "confirmDeleteUnit", unitId });
  }

  function confirmDeleteUnit(unitId) {
    const unit = unidades.find((u) => u.id === unitId);
    if (!unit) return;

    const qtdUsers = usersCountByUnit(unitId);
    if (qtdUsers > 0) {
      alert("Não é possível excluir: esta unidade possui usuários vinculados. Remova/migre os usuários primeiro.");
      return;
    }

    setUnidades((prev) => prev.filter((x) => x.id !== unitId));
    setModal(null);
    logAction(`Unidade excluída: ${unit.nome}`);
  }

  // =========================
  // Usuários - Ações globais do admin
  // =========================
  function toggleUserActive(userId) {
    const u = usuarios.find((x) => x.id === userId);
    setUsuarios((prev) => prev.map((x) => (x.id === userId ? { ...x, ativo: !x.ativo } : x)));
    if (u) logAction(`Usuário ${u.ativo ? "desativado" : "ativado"}: ${u.nome}`);
  }

  // =========================
  // Listas filtradas
  // =========================
  const diretoresFiltrados = useMemo(() => {
    const q = filtroDiretor.toLowerCase().trim();
    return [...diretores]
      .filter((d) => {
        if (!q) return true;
        return (
          (d.nome || "").toLowerCase().includes(q) ||
          (d.email || "").toLowerCase().includes(q) ||
          onlyDigits(d.cpf || "").includes(onlyDigits(q))
        );
      })
      .sort((a, b) => {
        if (ordenacaoDiretor === "nomeAsc") return a.nome.localeCompare(b.nome);
        if (ordenacaoDiretor === "nomeDesc") return b.nome.localeCompare(a.nome);
        if (ordenacaoDiretor === "recente") return new Date(b.createdAt) - new Date(a.createdAt);
        if (ordenacaoDiretor === "ativo") return Number(b.ativo) - Number(a.ativo);
        return 0;
      });
  }, [diretores, filtroDiretor, ordenacaoDiretor]);

  const unidadesFiltradas = useMemo(() => {
    const q = filtroUnidade.toLowerCase().trim();
    return [...unidades]
      .filter((u) => {
        if (!q) return true;
        return (
          (u.nome || "").toLowerCase().includes(q) ||
          (u.endereco || "").toLowerCase().includes(q) ||
          getDiretorName(u.diretorId).toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (ordenacaoUnidade === "nomeAsc") return a.nome.localeCompare(b.nome);
        if (ordenacaoUnidade === "recente") return new Date(b.createdAt) - new Date(a.createdAt);
        if (ordenacaoUnidade === "diretor") return getDiretorName(a.diretorId).localeCompare(getDiretorName(b.diretorId));
        return 0;
      });
  }, [unidades, filtroUnidade, ordenacaoUnidade, diretoresById]);

  const usuariosFiltrados = useMemo(() => {
    const q = filtroUsuario.toLowerCase().trim();
    return [...usuarios]
      .filter((u) => {
        if (!q) return true;
        const unidadeName = unidades.find((x) => x.id === u.unidadeId)?.nome || "";
        return (
          (u.nome || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          unidadeName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (ordenacaoUsuario === "nomeAsc") return a.nome.localeCompare(b.nome);
        if (ordenacaoUsuario === "kgDesc") return (b.materiaisKg || 0) - (a.materiaisKg || 0);
        if (ordenacaoUsuario === "valorDesc") return (b.valorTotal || 0) - (a.valorTotal || 0);
        if (ordenacaoUsuario === "trocasDesc") return (b.trocas || 0) - (a.trocas || 0);
        if (ordenacaoUsuario === "unidade") {
          const au = unidades.find((x) => x.id === a.unidadeId)?.nome || "";
          const bu = unidades.find((x) => x.id === b.unidadeId)?.nome || "";
          return au.localeCompare(bu);
        }
        return 0;
      });
  }, [usuarios, filtroUsuario, ordenacaoUsuario, unidades]);

  // ===== KPIs =====
  const totalDiretores = diretores.length;
  const totalUnidades = unidades.length;
  const totalUsuarios = usuarios.length;
  const totalKg = usuarios.reduce((acc, u) => acc + (u.materiaisKg || 0), 0);
  const totalR$ = usuarios.reduce((acc, u) => acc + (u.valorTotal || 0), 0);

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="app-logo-circle">18</div>
            <div className="app-title-group">
              <h1 className="app-title">Cofrinho dos 18</h1>
              <span className="app-subtitle">Painel do administrador (super admin)</span>
            </div>
          </div>

          <div className="topbar-right">
            <span className="user-email">admin@cofrinho18.com</span>
            <button className="btn-outline" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <div className="dashboard-main">
          <nav className="dashboard-tabs">
            <button className={`tab-item ${tab === "visao" ? "tab-active" : ""}`} onClick={() => setTab("visao")}>Visão geral</button>
            <button className={`tab-item ${tab === "diretores" ? "tab-active" : ""}`} onClick={() => setTab("diretores")}>Diretores</button>
            <button className={`tab-item ${tab === "unidades" ? "tab-active" : ""}`} onClick={() => setTab("unidades")}>Unidades</button>
            <button className={`tab-item ${tab === "usuarios" ? "tab-active" : ""}`} onClick={() => setTab("usuarios")}>Usuários</button>
            <button className={`tab-item ${tab === "auditoria" ? "tab-active" : ""}`} onClick={() => setTab("auditoria")}>Auditoria</button>
          </nav>

          <section className="dashboard-summary">
            <div className="dash-card">
              <span className="dash-card-label">Diretores</span>
              <strong className="dash-card-number">{totalDiretores}</strong>
              <p className="dash-card-foot">Cadastro, status e senha (reset)</p>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Unidades</span>
              <strong className="dash-card-number">{totalUnidades}</strong>
              <p className="dash-card-foot">Editar e trocar diretor responsável</p>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Usuários (global)</span>
              <strong className="dash-card-number">{totalUsuarios}</strong>
              <p className="dash-card-foot">Ativar/desativar para suporte</p>
            </div>
            <div className="dash-card dash-card-pill">
              <span className="dash-card-label">Impacto total</span>
              <strong className="dash-card-number">{totalKg.toFixed(2)} kg • R$ {totalR$.toFixed(2)}</strong>
              <p className="dash-card-foot">Somatório do sistema</p>
            </div>
          </section>

          {tab === "visao" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Ações rápidas</h2>
                <p className="dash-section-subtitle">Este é o “super dashboard” de controle total do site.</p>

                <div className="quick-actions">
                  <button className="btn-laranja" onClick={() => setTab("diretores")}>Cadastrar diretor</button>
                  <button className="btn-outline" onClick={() => setTab("unidades")}>Criar/editar unidade</button>
                  <button className="btn-outline" onClick={() => setTab("usuarios")}>Ver usuários</button>
                </div>

                <div className="dash-hint">
                  Quando tiver API/SQL Server: todas as ações aqui devem exigir token do admin e registrar auditoria (before/after).
                </div>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Boas práticas recomendadas</h2>
                <ul className="dash-ul">
                  <li><strong>Reset de senha:</strong> admin redefine, mas nunca “vê” a senha.</li>
                  <li><strong>Diretor pode trocar senha:</strong> autonomia no painel dele.</li>
                  <li><strong>Exclusão segura:</strong> diretor só exclui se não tiver unidades; unidade só exclui se não tiver usuários.</li>
                  <li><strong>Desativação:</strong> preferível a excluir em muitos casos (mantém histórico).</li>
                </ul>
              </div>
            </section>
          )}

          {tab === "diretores" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Cadastrar diretor</h2>
                <p className="dash-section-subtitle">CPF e senha são obrigatórios. Senha: mínimo 8, com letras e números.</p>

                <form className="dash-form" onSubmit={handleCreateDirector}>
                  <div className="dash-form-group">
                    <label>Nome completo</label>
                    <input name="nome" value={novoDiretor.nome} onChange={handleChangeNovoDiretor} required />
                  </div>

                  <div className="dash-form-group">
                    <label>E-mail</label>
                    <input name="email" type="email" value={novoDiretor.email} onChange={handleChangeNovoDiretor} required />
                  </div>

                  <div className="dash-form-row">
                    <div className="dash-form-group">
                      <label>CPF</label>
                      <input
                        name="cpf"
                        value={novoDiretor.cpf}
                        onChange={handleChangeNovoDiretor}
                        placeholder="000.000.000-00"
                        inputMode="numeric"
                        required
                      />
                    </div>
                    <div className="dash-form-group">
                      <label>Telefone (opcional)</label>
                      <input name="telefone" value={novoDiretor.telefone} onChange={handleChangeNovoDiretor} placeholder="(xx) xxxxx-xxxx" />
                    </div>
                  </div>

                  <div className="dash-form-row">
                    <div className="dash-form-group">
                      <label>Senha</label>
                      <input name="senha" type="password" value={novoDiretor.senha} onChange={handleChangeNovoDiretor} required />
                    </div>
                    <div className="dash-form-group">
                      <label>Confirmar senha</label>
                      <input
                        name="confirmarSenha"
                        type="password"
                        value={novoDiretor.confirmarSenha}
                        onChange={handleChangeNovoDiretor}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-laranja btn-full">Criar diretor</button>
                </form>

                <div className="dash-hint">
                  (Mock) Senha está indo para localStorage apenas para testar o fluxo. No backend: salvar apenas hash + auditoria.
                </div>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Diretores cadastrados</h2>

                <div className="dash-filters">
                  <input className="dash-filter-input" placeholder="Buscar por nome, email ou CPF..." value={filtroDiretor} onChange={(e) => setFiltroDiretor(e.target.value)} />
                  <select className="dash-filter-select" value={ordenacaoDiretor} onChange={(e) => setOrdenacaoDiretor(e.target.value)}>
                    <option value="nomeAsc">Nome (A–Z)</option>
                    <option value="nomeDesc">Nome (Z–A)</option>
                    <option value="recente">Mais recentes</option>
                    <option value="ativo">Ativos primeiro</option>
                  </select>
                </div>

                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>CPF</th>
                        <th>Status</th>
                        <th>Unidades</th>
                        <th className="th-actions">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diretoresFiltrados.map((d) => {
                        const unitsCount = unitsCountByDirector(d.id);
                        return (
                          <tr key={d.id}>
                            <td>{d.nome}</td>
                            <td>{d.email}</td>
                            <td className="td-muted">{d.cpf}</td>
                            <td>
                              <span className={`status-pill ${d.ativo ? "status-ok" : "status-off"}`}>
                                {d.ativo ? "Ativo" : "Inativo"}
                              </span>
                            </td>
                            <td>{unitsCount}</td>
                            <td>
                              <div className="table-actions">
                                <button className="btn-outline btn-xs" onClick={() => requestResetDirectorPassword(d.id)}>Resetar senha</button>
                                <button className="btn-outline btn-xs" onClick={() => handleToggleDirectorActive(d.id)}>{d.ativo ? "Desativar" : "Ativar"}</button>
                                <button className="btn-danger btn-xs" onClick={() => requestDeleteDirector(d.id)}>Excluir</button>
                              </div>
                              {unitsCount > 0 && <div className="mini-warning">Para excluir, transfira as unidades antes.</div>}
                            </td>
                          </tr>
                        );
                      })}

                      {diretoresFiltrados.length === 0 && (
                        <tr><td colSpan="6">Nenhum diretor encontrado.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {tab === "unidades" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Criar unidade</h2>
                <p className="dash-section-subtitle">A unidade deve ter 1 diretor responsável.</p>

                <form className="dash-form" onSubmit={handleCreateUnit}>
                  <div className="dash-form-group">
                    <label>Nome da unidade</label>
                    <input name="nome" value={novaUnidade.nome} onChange={handleChangeNovaUnidade} required />
                  </div>

                  <div className="dash-form-group">
                    <label>Endereço (opcional)</label>
                    <input name="endereco" value={novaUnidade.endereco} onChange={handleChangeNovaUnidade} />
                  </div>

                  <div className="dash-form-group">
                    <label>Diretor responsável</label>
                    <select name="diretorId" value={novaUnidade.diretorId} onChange={handleChangeNovaUnidade} required>
                      <option value="">Selecione um diretor</option>
                      {diretores.filter((d) => d.ativo).map((d) => (
                        <option key={d.id} value={d.id}>{d.nome} (ativo)</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn-laranja btn-full">Criar unidade</button>
                </form>

                <div className="dash-hint">
                  Ao editar unidade, você pode trocar o diretor. No backend: registrar auditoria do “antes/depois”.
                </div>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Unidades cadastradas</h2>

                <div className="dash-filters">
                  <input className="dash-filter-input" placeholder="Buscar por unidade, endereço ou diretor..." value={filtroUnidade} onChange={(e) => setFiltroUnidade(e.target.value)} />
                  <select className="dash-filter-select" value={ordenacaoUnidade} onChange={(e) => setOrdenacaoUnidade(e.target.value)}>
                    <option value="nomeAsc">Nome (A–Z)</option>
                    <option value="diretor">Diretor (A–Z)</option>
                    <option value="recente">Mais recentes</option>
                  </select>
                </div>

                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Unidade</th>
                        <th>Diretor</th>
                        <th>Status</th>
                        <th>Usuários</th>
                        <th className="th-actions">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unidadesFiltradas.map((u) => {
                        const qtdUsers = usersCountByUnit(u.id);
                        return (
                          <tr key={u.id}>
                            <td>
                              <div className="td-strong">{u.nome}</div>
                              {u.endereco ? <div className="td-muted">{u.endereco}</div> : null}
                            </td>
                            <td>{getDiretorName(u.diretorId)}</td>
                            <td>
                              <span className={`status-pill ${u.ativa ? "status-ok" : "status-off"}`}>
                                {u.ativa ? "Ativa" : "Inativa"}
                              </span>
                            </td>
                            <td>{qtdUsers}</td>
                            <td>
                              <div className="table-actions">
                                <button className="btn-outline btn-xs" onClick={() => requestEditUnit(u.id)}>Editar</button>
                                <button className="btn-danger btn-xs" onClick={() => requestDeleteUnit(u.id)}>Excluir</button>
                              </div>
                              {qtdUsers > 0 && <div className="mini-warning">Para excluir, migre/remova os usuários antes.</div>}
                            </td>
                          </tr>
                        );
                      })}

                      {unidadesFiltradas.length === 0 && (
                        <tr><td colSpan="5">Nenhuma unidade encontrada.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {tab === "usuarios" && (
            <section className="dash-card">
              <h2 className="dash-section-title">Usuários do sistema</h2>
              <p className="dash-section-subtitle">Visão global do admin. O cadastro de usuários é feito pelo diretor.</p>

              <div className="dash-filters">
                <input className="dash-filter-input" placeholder="Buscar por nome, email ou unidade..." value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)} />
                <select className="dash-filter-select" value={ordenacaoUsuario} onChange={(e) => setOrdenacaoUsuario(e.target.value)}>
                  <option value="nomeAsc">Nome (A–Z)</option>
                  <option value="unidade">Unidade (A–Z)</option>
                  <option value="kgDesc">Mais material (kg)</option>
                  <option value="valorDesc">Maior valor (R$)</option>
                  <option value="trocasDesc">Mais trocas</option>
                </select>
              </div>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Unidade</th>
                      <th>Status</th>
                      <th>Kg</th>
                      <th>R$</th>
                      <th>Trocas</th>
                      <th className="th-actions">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u) => {
                      const unitName = unidades.find((x) => x.id === u.unidadeId)?.nome || "—";
                      return (
                        <tr key={u.id}>
                          <td>{u.nome}</td>
                          <td className="td-muted">{u.email}</td>
                          <td>{unitName}</td>
                          <td>
                            <span className={`status-pill ${u.ativo ? "status-ok" : "status-off"}`}>
                              {u.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td>{(u.materiaisKg || 0).toFixed(2)}</td>
                          <td>R$ {(u.valorTotal || 0).toFixed(2)}</td>
                          <td>{u.trocas || 0}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-outline btn-xs" onClick={() => toggleUserActive(u.id)}>
                                {u.ativo ? "Desativar" : "Ativar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {usuariosFiltrados.length === 0 && (
                      <tr><td colSpan="8">Nenhum usuário encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "auditoria" && (
            <section className="dash-card">
              <h2 className="dash-section-title">Auditoria (log do admin)</h2>
              <p className="dash-section-subtitle">Por enquanto mock. No backend, gravar no banco com before/after.</p>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Data/Hora</th>
                      <th>Quem</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.map((a) => (
                      <tr key={a.id}>
                        <td>{new Date(a.when).toLocaleString()}</td>
                        <td>{a.who}</td>
                        <td>{a.action}</td>
                      </tr>
                    ))}
                    {audit.length === 0 && (
                      <tr><td colSpan="3">Sem registros.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* ===================== MODAIS ===================== */}
        {modal?.type === "confirmDeleteDirector" && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card">
              <h3 className="modal-title">Excluir diretor</h3>
              <p className="modal-text">Tem certeza? Você só conseguirá excluir se este diretor não tiver unidades vinculadas.</p>
              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn-danger" onClick={() => confirmDeleteDirector(modal.directorId)}>Confirmar exclusão</button>
              </div>
            </div>
          </div>
        )}

        {modal?.type === "confirmDeleteUnit" && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card">
              <h3 className="modal-title">Excluir unidade</h3>
              <p className="modal-text">Tem certeza? Você só conseguirá excluir se a unidade não tiver usuários vinculados.</p>
              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn-danger" onClick={() => confirmDeleteUnit(modal.unitId)}>Confirmar exclusão</button>
              </div>
            </div>
          </div>
        )}

        {modal?.type === "editUnit" && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card modal-card-wide">
              <h3 className="modal-title">Editar unidade</h3>
              <p className="modal-text">Altere nome/endereço, status e troque o diretor responsável.</p>

              <div className="dash-form">
                <div className="dash-form-group">
                  <label>Nome</label>
                  <input value={editUnitForm.nome} onChange={(e) => setEditUnitForm((p) => ({ ...p, nome: e.target.value }))} />
                </div>

                <div className="dash-form-group">
                  <label>Endereço</label>
                  <input value={editUnitForm.endereco} onChange={(e) => setEditUnitForm((p) => ({ ...p, endereco: e.target.value }))} />
                </div>

                <div className="dash-form-group">
                  <label>Diretor responsável</label>
                  <select value={editUnitForm.diretorId} onChange={(e) => setEditUnitForm((p) => ({ ...p, diretorId: e.target.value }))}>
                    {diretores.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome} {d.ativo ? "(ativo)" : "(inativo)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Status da unidade</label>
                  <select value={editUnitForm.ativa ? "ativa" : "inativa"} onChange={(e) => setEditUnitForm((p) => ({ ...p, ativa: e.target.value === "ativa" }))}>
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn-laranja" onClick={() => handleSaveEditUnit(modal.unitId)}>Salvar alterações</button>
              </div>
            </div>
          </div>
        )}

        {modal?.type === "resetDirectorPassword" && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card">
              <h3 className="modal-title">Resetar senha do diretor</h3>
              <p className="modal-text">Defina uma nova senha. O diretor poderá trocar depois no próprio painel.</p>

              <div className="dash-form">
                <div className="dash-form-group">
                  <label>Nova senha</label>
                  <input type="password" value={resetPwdForm.novaSenha} onChange={(e) => setResetPwdForm((p) => ({ ...p, novaSenha: e.target.value }))} />
                </div>
                <div className="dash-form-group">
                  <label>Confirmar nova senha</label>
                  <input type="password" value={resetPwdForm.confirmarNovaSenha} onChange={(e) => setResetPwdForm((p) => ({ ...p, confirmarNovaSenha: e.target.value }))} />
                </div>
                <div className="dash-hint">
                  Regras: mínimo 8 caracteres, com letras e números.
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn-laranja" onClick={() => confirmResetDirectorPassword(modal.directorId)}>Confirmar reset</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
