import { useEffect, useMemo, useState } from "react";
import "../styles/management.css";
import {
  getAdminSummary,
  getAdminDirectors,
  createAdminDirector,
  updateAdminDirector,
  deactivateAdminDirector,
  getAdminUnits,
  createAdminUnit,
  updateAdminUnit,
  deactivateAdminUnit,
  getAdminUsers,
  deactivateAdminUser,
  resetAdminDirectorPassword
} from "../api/cofrinhoApi";

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
  if (!d) return true; // opcional visualmente
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

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("visao");

  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // ===== Summary =====
  const [summary, setSummary] = useState({
    directors: 0,
    units: 0,
    users: 0,
    trades: 0,
    kg: 0,
    money: 0
  });

  // ===== Diretores =====
  const [diretores, setDiretores] = useState([]);
  const [novoDiretor, setNovoDiretor] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });
  const [filtroDiretor, setFiltroDiretor] = useState("");
  const [ordenacaoDiretor, setOrdenacaoDiretor] = useState("nomeAsc");
  const [isSubmittingDirector, setIsSubmittingDirector] = useState(false);

  // ===== Unidades =====
  const [unidades, setUnidades] = useState([]);
  const [novaUnidade, setNovaUnidade] = useState({
    nome: "",
    diretorId: "",
  });
  const [filtroUnidade, setFiltroUnidade] = useState("");
  const [ordenacaoUnidade, setOrdenacaoUnidade] = useState("nomeAsc");
  const [isSubmittingUnit, setIsSubmittingUnit] = useState(false);

  // ===== Usuários =====
  const [usuarios, setUsuarios] = useState([]);
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [ordenacaoUsuario, setOrdenacaoUsuario] = useState("nomeAsc");

  // ===== Modais =====
  const [modal, setModal] = useState(null);

  const [editDirectorForm, setEditDirectorForm] = useState({
    nome: "",
    email: "",
    telefone: ""
  });

  const [editUnitForm, setEditUnitForm] = useState({
    nome: "",
    diretorId: "",
  });

  const [resetPwdForm, setResetPwdForm] = useState({
  novaSenha: "",
  confirmarNovaSenha: "",
});

  // ===== Auditoria visual temporária =====
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

  // =========================
  // Bootstrap
  // =========================
  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      try {
        setIsLoading(true);
        setApiError("");

        const [summaryRes, directorsRes, unitsRes, usersRes] = await Promise.all([
          getAdminSummary(),
          getAdminDirectors(),
          getAdminUnits(),
          getAdminUsers()
        ]);

        if (!alive) return;

        setSummary({
          directors: Number(summaryRes?.directors || 0),
          units: Number(summaryRes?.units || 0),
          users: Number(summaryRes?.users || 0),
          trades: Number(summaryRes?.trades || 0),
          kg: Number(summaryRes?.kg || 0),
          money: Number(summaryRes?.money || 0)
        });

        setDiretores((directorsRes || []).map((d) => ({
          id: Number(d.id ?? d.Id),
          nome: String(d.name ?? d.Name ?? ""),
          email: String(d.email ?? d.Email ?? ""),
          telefone: String(d.phoneNumber ?? d.PhoneNumber ?? ""),
          ativo: Boolean(d.isActive ?? d.IsActive ?? true),
          createdAt: d.createdAt ?? d.CreatedAt ?? new Date().toISOString(),
          unitsCount: Number(d.unitsCount ?? d.UnitsCount ?? 0),
          cpf: ""
        })));

        setUnidades((unitsRes || []).map((u) => ({
          id: Number(u.id ?? u.Id),
          nome: String(u.name ?? u.Name ?? ""),
          diretorId: Number(u.directorId ?? u.DirectorId ?? 0),
          diretorNome: String(u.directorName ?? u.DirectorName ?? ""),
          ativa: Boolean(u.isActive ?? u.IsActive ?? true),
          createdAt: u.createdAt ?? u.CreatedAt ?? new Date().toISOString(),
          usersCount: Number(u.usersCount ?? u.UsersCount ?? 0),
        })));

        setUsuarios((usersRes || []).map((u) => ({
          id: Number(u.id ?? u.Id),
          nome: String(u.name ?? u.Name ?? ""),
          email: String(u.email ?? u.Email ?? ""),
          telefone: String(u.phoneNumber ?? u.PhoneNumber ?? ""),
          ativo: Boolean(u.isActive ?? u.IsActive ?? true),
          unidadeId: Number(u.unitId ?? u.UnitId ?? 0),
          unidadeNome: String(u.unitName ?? u.UnitName ?? ""),
          diretorId: Number(u.directorId ?? u.DirectorId ?? 0),
          diretorNome: String(u.directorName ?? u.DirectorName ?? ""),
          materiaisKg: Number(u.totalKg ?? u.TotalKg ?? 0),
          valorTotal: Number(u.totalMoney ?? u.TotalMoney ?? 0),
          trocas: Number(u.tradesCount ?? u.TradesCount ?? 0),
        })));
      } catch (err) {
        console.error(err);
        if (!alive) return;
        setApiError("Não foi possível carregar os dados do Admin.");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    }

    bootstrap();
    return () => {
      alive = false;
    };
  }, []);

  async function reloadAdminData() {
    const [summaryRes, directorsRes, unitsRes, usersRes] = await Promise.all([
      getAdminSummary(),
      getAdminDirectors(),
      getAdminUnits(),
      getAdminUsers()
    ]);

    setSummary({
      directors: Number(summaryRes?.directors || 0),
      units: Number(summaryRes?.units || 0),
      users: Number(summaryRes?.users || 0),
      trades: Number(summaryRes?.trades || 0),
      kg: Number(summaryRes?.kg || 0),
      money: Number(summaryRes?.money || 0)
    });

    setDiretores((directorsRes || []).map((d) => ({
      id: Number(d.id ?? d.Id),
      nome: String(d.name ?? d.Name ?? ""),
      email: String(d.email ?? d.Email ?? ""),
      telefone: String(d.phoneNumber ?? d.PhoneNumber ?? ""),
      ativo: Boolean(d.isActive ?? d.IsActive ?? true),
      createdAt: d.createdAt ?? d.CreatedAt ?? new Date().toISOString(),
      unitsCount: Number(d.unitsCount ?? d.UnitsCount ?? 0),
      cpf: ""
    })));

    setUnidades((unitsRes || []).map((u) => ({
      id: Number(u.id ?? u.Id),
      nome: String(u.name ?? u.Name ?? ""),
      diretorId: Number(u.directorId ?? u.DirectorId ?? 0),
      diretorNome: String(u.directorName ?? u.DirectorName ?? ""),
      ativa: Boolean(u.isActive ?? u.IsActive ?? true),
      createdAt: u.createdAt ?? u.CreatedAt ?? new Date().toISOString(),
      usersCount: Number(u.usersCount ?? u.UsersCount ?? 0),
    })));

    setUsuarios((usersRes || []).map((u) => ({
      id: Number(u.id ?? u.Id),
      nome: String(u.name ?? u.Name ?? ""),
      email: String(u.email ?? u.Email ?? ""),
      telefone: String(u.phoneNumber ?? u.PhoneNumber ?? ""),
      ativo: Boolean(u.isActive ?? u.IsActive ?? true),
      unidadeId: Number(u.unitId ?? u.UnitId ?? 0),
      unidadeNome: String(u.unitName ?? u.UnitName ?? ""),
      diretorId: Number(u.directorId ?? u.DirectorId ?? 0),
      diretorNome: String(u.directorName ?? u.DirectorName ?? ""),
      materiaisKg: Number(u.totalKg ?? u.TotalKg ?? 0),
      valorTotal: Number(u.totalMoney ?? u.TotalMoney ?? 0),
      trocas: Number(u.tradesCount ?? u.TradesCount ?? 0),
    })));
  }

  // =========================
  // Helpers
  // =========================
  const diretoresById = useMemo(() => {
    const map = new Map();
    diretores.forEach((d) => map.set(d.id, d));
    return map;
  }, [diretores]);

  function getDiretorName(diretorId) {
    const d = diretoresById.get(Number(diretorId));
    return d ? d.nome : "—";
  }

  // =========================
  // DIRETORES
  // =========================
  function handleChangeNovoDiretor(e) {
    const { name, value } = e.target;

    if (name === "cpf") {
      setNovoDiretor((p) => ({ ...p, cpf: formatCPF(value) }));
      return;
    }

    if (name === "telefone") {
      setNovoDiretor((p) => ({ ...p, telefone: formatPhone(value) }));
      return;
    }

    setNovoDiretor((p) => ({ ...p, [name]: value }));
  }

  async function handleCreateDirector(e) {
    e.preventDefault();

    if (!novoDiretor.nome.trim()) {
      alert("Informe o nome do diretor.");
      return;
    }
    if (!novoDiretor.email.trim()) {
      alert("Informe o e-mail do diretor.");
      return;
    }
    if (novoDiretor.cpf && !isValidCPFBasic(novoDiretor.cpf)) {
      alert("CPF inválido.");
      return;
    }
    if (!novoDiretor.senha) {
      alert("Informe a senha.");
      return;
    }
    if (novoDiretor.senha !== novoDiretor.confirmarSenha) {
      alert("As senhas não conferem.");
      return;
    }
    if (!isValidPasswordBasic(novoDiretor.senha)) {
      alert("Senha fraca.");
      return;
    }

    try {
      setIsSubmittingDirector(true);

      await createAdminDirector({
        name: novoDiretor.nome.trim(),
        email: novoDiretor.email.trim().toLowerCase(),
        password: novoDiretor.senha,
        phoneNumber: novoDiretor.telefone.trim(),
      });

      await reloadAdminData();

      setNovoDiretor({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        senha: "",
        confirmarSenha: "",
      });

      logAction(`Diretor criado: ${novoDiretor.nome}`);
    } catch (err) {
      console.error(err);
      alert("Não foi possível criar o diretor.");
    } finally {
      setIsSubmittingDirector(false);
    }
  }

  function requestEditDirector(directorId) {
    const d = diretores.find((x) => x.id === directorId);
    if (!d) return;

    setEditDirectorForm({
      nome: d.nome,
      email: d.email,
      telefone: d.telefone || ""
    });

    setModal({ type: "editDirector", directorId });
  }

  async function handleSaveEditDirector(directorId) {
    if (!editDirectorForm.nome.trim()) {
      alert("Informe o nome.");
      return;
    }
    if (!editDirectorForm.email.trim()) {
      alert("Informe o e-mail.");
      return;
    }

    try {
      await updateAdminDirector(directorId, {
        name: editDirectorForm.nome.trim(),
        email: editDirectorForm.email.trim().toLowerCase(),
        phoneNumber: editDirectorForm.telefone.trim()
      });

      await reloadAdminData();
      setModal(null);
      logAction(`Diretor editado: ${editDirectorForm.nome}`);
    } catch (err) {
      console.error(err);
      alert("Não foi possível editar o diretor.");
    }
  }

  async function handleDeactivateDirector(directorId) {
    try {
      await deactivateAdminDirector(directorId);
      await reloadAdminData();
      logAction(`Diretor desativado: ${directorId}`);
    } catch (err) {
      console.error(err);
      alert("Não foi possível desativar o diretor.");
    }
  }

  function requestResetDirectorPassword(directorId) {
  setResetPwdForm({
    novaSenha: "",
    confirmarNovaSenha: "",
  });
  setModal({ type: "resetDirectorPassword", directorId });
}

async function confirmResetDirectorPassword(directorId) {
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

  try {
    await resetAdminDirectorPassword(directorId, {
      newPassword: resetPwdForm.novaSenha
    });

    setModal(null);
    logAction(`Senha do diretor redefinida: ${directorId}`);
    alert("Senha redefinida com sucesso.");
  } catch (err) {
    console.error(err);
    alert("Não foi possível redefinir a senha.");
  }
}

  // =========================
  // UNIDADES
  // =========================
  function handleChangeNovaUnidade(e) {
    const { name, value } = e.target;
    setNovaUnidade((p) => ({ ...p, [name]: value }));
  }

  async function handleCreateUnit(e) {
    e.preventDefault();

    if (!novaUnidade.nome.trim()) {
      alert("Informe o nome da unidade.");
      return;
    }
    if (!novaUnidade.diretorId) {
      alert("Selecione um diretor.");
      return;
    }

    try {
      setIsSubmittingUnit(true);

      await createAdminUnit({
        name: novaUnidade.nome.trim(),
        directorId: Number(novaUnidade.diretorId)
      });

      await reloadAdminData();

      setNovaUnidade({
        nome: "",
        diretorId: "",
      });

      logAction(`Unidade criada: ${novaUnidade.nome}`);
    } catch (err) {
      console.error(err);
      alert("Não foi possível criar a unidade.");
    } finally {
      setIsSubmittingUnit(false);
    }
  }

  function requestEditUnit(unitId) {
    const u = unidades.find((x) => x.id === unitId);
    if (!u) return;

    setEditUnitForm({
      nome: u.nome,
      diretorId: String(u.diretorId || "")
    });

    setModal({ type: "editUnit", unitId });
  }

  async function handleSaveEditUnit(unitId) {
    if (!editUnitForm.nome.trim()) {
      alert("Informe o nome da unidade.");
      return;
    }
    if (!editUnitForm.diretorId) {
      alert("Selecione um diretor.");
      return;
    }

    try {
      await updateAdminUnit(unitId, {
        name: editUnitForm.nome.trim(),
        directorId: Number(editUnitForm.diretorId)
      });

      await reloadAdminData();
      setModal(null);
      logAction(`Unidade editada: ${editUnitForm.nome}`);
    } catch (err) {
      console.error(err);
      alert("Não foi possível editar a unidade.");
    }
  }

  async function handleDeactivateUnit(unitId) {
    try {
      await deactivateAdminUnit(unitId);
      await reloadAdminData();
      logAction(`Unidade desativada: ${unitId}`);
    } catch (err) {
      console.error(err);
      alert("Não foi possível desativar a unidade.");
    }
  }

  // =========================
  // USUÁRIOS
  // =========================
  async function handleDeactivateUser(userId) {
    try {
      await deactivateAdminUser(userId);
      await reloadAdminData();
      logAction(`Usuário desativado: ${userId}`);
    } catch (err) {
      console.error(err);
      alert("Não foi possível desativar o usuário.");
    }
  }

  // =========================
  // FILTROS
  // =========================
  const diretoresFiltrados = useMemo(() => {
    const q = filtroDiretor.toLowerCase().trim();
    return [...diretores]
      .filter((d) => {
        if (!q) return true;
        return (
          (d.nome || "").toLowerCase().includes(q) ||
          (d.email || "").toLowerCase().includes(q) ||
          (d.telefone || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (ordenacaoDiretor === "nomeAsc") return a.nome.localeCompare(b.nome);
        if (ordenacaoDiretor === "nomeDesc") return b.nome.localeCompare(a.nome);
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
          (u.diretorNome || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (ordenacaoUnidade === "nomeAsc") return a.nome.localeCompare(b.nome);
        if (ordenacaoUnidade === "diretor") return getDiretorName(a.diretorId).localeCompare(getDiretorName(b.diretorId));
        return 0;
      });
  }, [unidades, filtroUnidade, ordenacaoUnidade, diretores]);

  const usuariosFiltrados = useMemo(() => {
    const q = filtroUsuario.toLowerCase().trim();
    return [...usuarios]
      .filter((u) => {
        if (!q) return true;
        return (
          (u.nome || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.unidadeNome || "").toLowerCase().includes(q) ||
          (u.diretorNome || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (ordenacaoUsuario === "nomeAsc") return a.nome.localeCompare(b.nome);
        if (ordenacaoUsuario === "kgDesc") return (b.materiaisKg || 0) - (a.materiaisKg || 0);
        if (ordenacaoUsuario === "valorDesc") return (b.valorTotal || 0) - (a.valorTotal || 0);
        if (ordenacaoUsuario === "trocasDesc") return (b.trocas || 0) - (a.trocas || 0);
        if (ordenacaoUsuario === "unidade") return (a.unidadeNome || "").localeCompare(b.unidadeNome || "");
        return 0;
      });
  }, [usuarios, filtroUsuario, ordenacaoUsuario]);

  // ===== KPIs =====
  const totalDiretores = summary.directors;
  const totalUnidades = summary.units;
  const totalUsuarios = summary.users;
  const totalTrades = summary.trades;
  const totalKg = summary.kg;
  const totalR$ = summary.money;

  return (
    <main className="dashboard-page">
      {apiError && (
        <div className="dash-alert dash-alert-danger" style={{ marginBottom: "1rem" }}>
          {apiError}
        </div>
      )}

      {isLoading && !apiError && (
        <div className="dash-alert" style={{ marginBottom: "1rem" }}>
          Carregando dados do Admin...
        </div>
      )}

      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="app-logo-circle">18</div>
            <div className="app-title-group">
              <h1 className="app-title">Cofrinho dos 18</h1>
              <span className="app-subtitle">Painel do administrador</span>
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
              <p className="dash-card-foot">Ativos no sistema</p>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Unidades</span>
              <strong className="dash-card-number">{totalUnidades}</strong>
              <p className="dash-card-foot">Ativas no sistema</p>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Usuários</span>
              <strong className="dash-card-number">{totalUsuarios}</strong>
              <p className="dash-card-foot">Usuários ativos</p>
            </div>
            <div className="dash-card dash-card-pill">
              <span className="dash-card-label">Impacto total</span>
              <strong className="dash-card-number">
                {Number(totalKg).toFixed(2)} kg • R$ {Number(totalR$).toFixed(2)}
              </strong>
              <p className="dash-card-foot">Trocas: {totalTrades}</p>
            </div>
          </section>

          {tab === "visao" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Ações rápidas</h2>
                <p className="dash-section-subtitle">Controle global do sistema.</p>

                <div className="quick-actions">
                  <button className="btn-laranja" onClick={() => setTab("diretores")}>Cadastrar diretor</button>
                  <button className="btn-outline" onClick={() => setTab("unidades")}>Criar unidade</button>
                  <button className="btn-outline" onClick={() => setTab("usuarios")}>Ver usuários</button>
                </div>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Status do sistema</h2>
                <ul className="dash-ul">
                  <li><strong>Diretores:</strong> criar, editar e desativar.</li>
                  <li><strong>Unidades:</strong> criar, editar e desativar.</li>
                  <li><strong>Usuários:</strong> visão global e desativação.</li>
                  <li><strong>Resumo:</strong> real com trades, kg e valor.</li>
                </ul>
              </div>
            </section>
          )}

          {tab === "diretores" && (
            <section className="dashboard-content-grid">
              <div className="dash-card">
                <h2 className="dash-section-title">Cadastrar diretor</h2>
                <p className="dash-section-subtitle">Criação real no banco.</p>

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
                      <label>CPF (visual)</label>
                      <input
                        name="cpf"
                        value={novoDiretor.cpf}
                        onChange={handleChangeNovoDiretor}
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div className="dash-form-group">
                      <label>Telefone</label>
                      <input
                        name="telefone"
                        value={novoDiretor.telefone}
                        onChange={handleChangeNovoDiretor}
                        placeholder="(xx) xxxxx-xxxx"
                      />
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

                  <button type="submit" className="btn-laranja btn-full" disabled={isSubmittingDirector}>
                    {isSubmittingDirector ? "Criando..." : "Criar diretor"}
                  </button>
                </form>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Diretores cadastrados</h2>

                <div className="dash-filters">
                  <input
                    className="dash-filter-input"
                    placeholder="Buscar por nome, email ou telefone..."
                    value={filtroDiretor}
                    onChange={(e) => setFiltroDiretor(e.target.value)}
                  />
                  <select
                    className="dash-filter-select"
                    value={ordenacaoDiretor}
                    onChange={(e) => setOrdenacaoDiretor(e.target.value)}
                  >
                    <option value="nomeAsc">Nome (A–Z)</option>
                    <option value="nomeDesc">Nome (Z–A)</option>
                    <option value="ativo">Ativos primeiro</option>
                  </select>
                </div>

                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Status</th>
                        <th>Unidades</th>
                        <th className="th-actions">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diretoresFiltrados.map((d) => (
                        <tr key={d.id}>
                          <td>{d.nome}</td>
                          <td>{d.email}</td>
                          <td>{d.telefone || "—"}</td>
                          <td>
                            <span className={`status-pill ${d.ativo ? "status-ok" : "status-off"}`}>
                              {d.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td>{d.unitsCount || 0}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-outline btn-xs" onClick={() => requestEditDirector(d.id)}>Editar</button>
                              <button className="btn-outline btn-xs" onClick={() => requestResetDirectorPassword(d.id)}>Resetar senha</button>
                              <button className="btn-danger btn-xs" onClick={() => handleDeactivateDirector(d.id)}>Desativar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                <p className="dash-section-subtitle">Cada unidade possui um diretor responsável.</p>

                <form className="dash-form" onSubmit={handleCreateUnit}>
                  <div className="dash-form-group">
                    <label>Nome da unidade</label>
                    <input name="nome" value={novaUnidade.nome} onChange={handleChangeNovaUnidade} required />
                  </div>

                  <div className="dash-form-group">
                    <label>Diretor responsável</label>
                    <select name="diretorId" value={novaUnidade.diretorId} onChange={handleChangeNovaUnidade} required>
                      <option value="">Selecione um diretor</option>
                      {diretores.filter((d) => d.ativo).map((d) => (
                        <option key={d.id} value={d.id}>{d.nome}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn-laranja btn-full" disabled={isSubmittingUnit}>
                    {isSubmittingUnit ? "Criando..." : "Criar unidade"}
                  </button>
                </form>
              </div>

              <div className="dash-card">
                <h2 className="dash-section-title">Unidades cadastradas</h2>

                <div className="dash-filters">
                  <input
                    className="dash-filter-input"
                    placeholder="Buscar por unidade ou diretor..."
                    value={filtroUnidade}
                    onChange={(e) => setFiltroUnidade(e.target.value)}
                  />
                  <select
                    className="dash-filter-select"
                    value={ordenacaoUnidade}
                    onChange={(e) => setOrdenacaoUnidade(e.target.value)}
                  >
                    <option value="nomeAsc">Nome (A–Z)</option>
                    <option value="diretor">Diretor (A–Z)</option>
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
                      {unidadesFiltradas.map((u) => (
                        <tr key={u.id}>
                          <td>{u.nome}</td>
                          <td>{u.diretorNome || getDiretorName(u.diretorId)}</td>
                          <td>
                            <span className={`status-pill ${u.ativa ? "status-ok" : "status-off"}`}>
                              {u.ativa ? "Ativa" : "Inativa"}
                            </span>
                          </td>
                          <td>{u.usersCount || 0}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-outline btn-xs" onClick={() => requestEditUnit(u.id)}>Editar</button>
                              <button className="btn-danger btn-xs" onClick={() => handleDeactivateUnit(u.id)}>Desativar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
              <p className="dash-section-subtitle">Visão global real do admin.</p>

              <div className="dash-filters">
                <input
                  className="dash-filter-input"
                  placeholder="Buscar por nome, email, unidade ou diretor..."
                  value={filtroUsuario}
                  onChange={(e) => setFiltroUsuario(e.target.value)}
                />
                <select
                  className="dash-filter-select"
                  value={ordenacaoUsuario}
                  onChange={(e) => setOrdenacaoUsuario(e.target.value)}
                >
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
                      <th>Diretor</th>
                      <th>Status</th>
                      <th>Kg</th>
                      <th>R$</th>
                      <th>Trocas</th>
                      <th className="th-actions">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nome}</td>
                        <td>{u.email}</td>
                        <td>{u.unidadeNome || "—"}</td>
                        <td>{u.diretorNome || "—"}</td>
                        <td>
                          <span className={`status-pill ${u.ativo ? "status-ok" : "status-off"}`}>
                            {u.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td>{Number(u.materiaisKg || 0).toFixed(2)}</td>
                        <td>R$ {Number(u.valorTotal || 0).toFixed(2)}</td>
                        <td>{u.trocas || 0}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-danger btn-xs" onClick={() => handleDeactivateUser(u.id)}>Desativar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {usuariosFiltrados.length === 0 && (
                      <tr><td colSpan="9">Nenhum usuário encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "auditoria" && (
            <section className="dash-card">
              <h2 className="dash-section-title">Auditoria</h2>
              <p className="dash-section-subtitle">Visual temporária. Depois vamos ligar ao banco.</p>

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

        {/* MODAL EDITAR DIRETOR */}
        {modal?.type === "editDirector" && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card modal-card-wide">
              <h3 className="modal-title">Editar diretor</h3>
              <p className="modal-text">Atualize os dados do diretor.</p>

              <div className="dash-form">
                <div className="dash-form-group">
                  <label>Nome</label>
                  <input
                    value={editDirectorForm.nome}
                    onChange={(e) => setEditDirectorForm((p) => ({ ...p, nome: e.target.value }))}
                  />
                </div>

                <div className="dash-form-group">
                  <label>E-mail</label>
                  <input
                    value={editDirectorForm.email}
                    onChange={(e) => setEditDirectorForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>

                <div className="dash-form-group">
                  <label>Telefone</label>
                  <input
                    value={editDirectorForm.telefone}
                    onChange={(e) => setEditDirectorForm((p) => ({ ...p, telefone: formatPhone(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setModal(null)}>Cancelar</button>
                <button className="btn-laranja" onClick={() => handleSaveEditDirector(modal.directorId)}>Salvar alterações</button>
              </div>
            </div>
          </div>
        )}


      {/* MODAL TROCAR SENHA */}        
        {modal?.type === "resetDirectorPassword" && (
  <div className="modal-backdrop" role="dialog" aria-modal="true">
    <div className="modal-card">
      <h3 className="modal-title">Resetar senha do diretor</h3>
      <p className="modal-text">Defina uma nova senha. O diretor poderá usá-la no próximo login.</p>

      <div className="dash-form">
        <div className="dash-form-group">
          <label>Nova senha</label>
          <input
            type="password"
            value={resetPwdForm.novaSenha}
            onChange={(e) => setResetPwdForm((p) => ({ ...p, novaSenha: e.target.value }))}
          />
        </div>

        <div className="dash-form-group">
          <label>Confirmar nova senha</label>
          <input
            type="password"
            value={resetPwdForm.confirmarNovaSenha}
            onChange={(e) => setResetPwdForm((p) => ({ ...p, confirmarNovaSenha: e.target.value }))}
          />
        </div>

        <div className="dash-hint">
          Regras: mínimo 8 caracteres, com letras e números.
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn-outline" onClick={() => setModal(null)}>Cancelar</button>
        <button className="btn-laranja" onClick={() => confirmResetDirectorPassword(modal.directorId)}>
          Confirmar reset
        </button>
      </div>
    </div>
  </div>
)}

        {/* MODAL EDITAR UNIDADE */}
        {modal?.type === "editUnit" && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card modal-card-wide">
              <h3 className="modal-title">Editar unidade</h3>
              <p className="modal-text">Atualize os dados da unidade.</p>

              <div className="dash-form">
                <div className="dash-form-group">
                  <label>Nome</label>
                  <input
                    value={editUnitForm.nome}
                    onChange={(e) => setEditUnitForm((p) => ({ ...p, nome: e.target.value }))}
                  />
                </div>

                <div className="dash-form-group">
                  <label>Diretor responsável</label>
                  <select
                    value={editUnitForm.diretorId}
                    onChange={(e) => setEditUnitForm((p) => ({ ...p, diretorId: e.target.value }))}
                  >
                    <option value="">Selecione...</option>
                    {diretores.filter((d) => d.ativo).map((d) => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
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
      </div>
    </main>
  );
}