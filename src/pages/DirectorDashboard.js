import { useMemo, useState, useEffect } from "react";
import "../styles/management.css";
import {
  getUnits,
  getUnitUsers,
  getUnitRanking,
  createTrade,
  getUnitChallenges,
  createChallenge,
  getChallengeProgress,
  createUser,
  getUserTrades,
  getUserById,
  updateDirectorAccount,
  changeDirectorPassword,
  updateUser,
  deactivateUser
} from "../api/cofrinhoApi";

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

// ======= Normalização de Trade do backend -> formato do front (sem mudar layout) =======
function normalizeTradeFromApi(t, user, unitName) {
  return {
    id: Number(t.tradeId ?? t.id ?? Date.now()),
    fromDb: true,
    createdAt: t.createdAt,
    material: t.materialType,
    pesoKg: t.weightKg,
    valorR$: t.amountMoney,
    obs: "", // não vem do backend no seu retorno atual
    userId: user?.id,
    userNome: user?.nome || user?.name || `Usuário ${user?.id ?? ""}`,
    unidadeId: user?.unidadeId,
    unidadeNome: unitName || user?.unidadeNome || ""
  };
}

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export default function DirectorDashboard() {
  // ======= Diretor Logado =======
const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

const DIRECTOR_ID = Number(loggedUser?.id || 0);
const DIRECTOR_EMAIL = loggedUser?.email || "";
const DIRECTOR_NAME = loggedUser?.name || "";
const DIRECTOR_ROLE = loggedUser?.role || "";

useEffect(() => {
  if (!DIRECTOR_ID || DIRECTOR_ROLE !== "DIRECTOR") {
    window.location.href = "/login";
  }
}, [DIRECTOR_ID, DIRECTOR_ROLE]);

  // ===== Navegação =====
  const [tab, setTab] = useState("visao"); // visao | trocas | equipe | unidades | desafios | conta

  // ===== Unidades (AGORA vem do banco) =====
  const [unidades, setUnidades] = useState([]);

  // ===== Usuários subordinados ao diretor (AGORA vem do banco) =====
  const [usuarios, setUsuarios] = useState([]);

  // ===== Criar usuário =====
  const [novoUsuario, setNovoUsuario] = useState({
  nome: "",
  tipo: "Usuário",
  email: "",
  password: "",
  birthDate: "",
  phoneNumber: ""
});
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");

  // Editar usuário
  const [usuarioEdicao, setUsuarioEdicao] = useState({
  nome: "",
  email: "",
  birthDate: "",
  phoneNumber: ""
});
const [isSavingUser, setIsSavingUser] = useState(false);
const [isDeactivatingUser, setIsDeactivatingUser] = useState(false);
const [equipeMsg, setEquipeMsg] = useState("");

  // ===== Filtros equipe =====
  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenacao, setOrdenacao] = useState("nomeAsc");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // ===== Desafios (AGORA vem do banco) =====
  const [desafios, setDesafios] = useState([]);
  const [novoDesafio, setNovoDesafio] = useState({ titulo: "", tipo: "Diário", descricao: "", prazo: "", metaKg: "", recompensa: "" });

  // ===== Unidades criação (por enquanto mantém local) =====
  const [novoNomeUnidade, setNovoNomeUnidade] = useState("");

  // ===== Trocas (agora carrega do banco quando entra na aba Trocas) =====
  const [trocas, setTrocas] = useState([]);
  const [novaTroca, setNovaTroca] = useState({ material: "Plástico", pesoKg: "", valorR$: "", obs: "" });

  // ===== Autocomplete usuário =====
  const [userQuery, setUserQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);

  const [remoteUserSuggestions, setRemoteUserSuggestions] = useState([]);
  const [isSubmittingTrade, setIsSubmittingTrade] = useState(false);
  const [isSubmittingChallenge, setIsSubmittingChallenge] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // ===== Filtros histórico =====
  const [trocasFiltroTexto, setTrocasFiltroTexto] = useState("");
  const [trocasFiltroUnidade, setTrocasFiltroUnidade] = useState("todas");
  const [trocasOrdenacao, setTrocasOrdenacao] = useState("dataDesc");
  const [trocasDataInicio, setTrocasDataInicio] = useState("");
  const [trocasDataFim, setTrocasDataFim] = useState("");

  // ===== Ranking =====
  const [rankingUnidadeId, setRankingUnidadeId] = useState("");
  const [rankingOrdenacao, setRankingOrdenacao] = useState("kgDesc");


  // ===== Conta do diretor =====
const [contaForm, setContaForm] = useState({
  nome: "",
  email: "",
  phoneNumber: ""
});

const [senhaContaForm, setSenhaContaForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

const [isSavingConta, setIsSavingConta] = useState(false);
const [isSavingSenha, setIsSavingSenha] = useState(false);
const [contaMsg, setContaMsg] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  // ===== Carregamento de trocas (banco) =====
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);

 function handleLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("C18_DIRECTOR_ID");
  localStorage.removeItem("C18_DIRECTOR_EMAIL");
  window.location.href = "/login";
}


  // ==========================
  // ✅ BOOTSTRAP: carregar dados do banco
  // ==========================
  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      try {
        setIsLoading(true);
        setApiError("");

        // 1) Unidades
        const unitsRaw = await getUnits();

        const mappedUnits = (unitsRaw || []).map((u) => ({
  id: Number(u.id ?? u.Id),
  nome: String(u.nome ?? u.name ?? u.Name ?? `Unidade ${u.id ?? u.Id}`),
  directorId: Number(u.directorId ?? u.DirectorId ?? 0),
})).filter((u) => Number.isFinite(u.id));

// pega somente as unidades do diretor logado
const myUnits = mappedUnits.filter(
  (u) => Number(u.directorId) === Number(DIRECTOR_ID)
);

        if (!alive) return;

setUnidades(myUnits);

// se o diretor não tiver unidade, limpa tudo e sai
if (myUnits.length === 0) {
  setUnidadeSelecionada("");
  setRankingUnidadeId("");
  setUsuarios([]);
  setDesafios([]);
  setTrocas([]);
  setIsLoading(false);
  return;
}

// seleciona unidade inicial
const firstUnitId = myUnits[0]?.id || "";
setUnidadeSelecionada((prev) => (prev ? prev : firstUnitId));
setRankingUnidadeId((prev) => (prev ? prev : firstUnitId));

        // 2) Usuários por unidade
        const usersByUnit = await Promise.all(
          myUnits.map(async (un) => {
            const list = await getUnitUsers(un.id, "");
            return { un, list: list || [] };
          })
        );

        const mapUsers = new Map();

        for (const group of usersByUnit) {
          const un = group.un;
          for (const ur of group.list) {
            const id = Number(ur.id ?? ur.Id);
            if (!Number.isFinite(id)) continue;

            const role = String(ur.role ?? ur.Role ?? "USER").toUpperCase();
            const tipo =
              role === "USER" ? "Usuário" :
              role === "DIRECTOR" ? "Diretor" :
              role === "ADMIN" ? "Admin" : role;

            mapUsers.set(id, {
               id,
                nome: String(ur.name ?? ur.nome ?? ur.Name ?? "Sem nome"),
                tipo,
                unidadeId: un.id,
                unidadeNome: un.nome,
                email: String(ur.email ?? ur.Email ?? ""),
                totalXp: Number(ur.totalXp ?? ur.TotalXp ?? 0),
                materiaisKg: 0,
                valorTotal: 0,
                trocas: 0,
                });
          }
        }

        // 3) Ranking por unidade (preencher métricas)
        const rankingsByUnit = await Promise.all(
          myUnits.map(async (un) => {
            const r = await getUnitRanking(un.id, "weight");
            return { unitId: un.id, ranking: r || [] };
          })
        );

        for (const rgroup of rankingsByUnit) {
          for (const item of rgroup.ranking) {
            const id = Number(item.userId ?? item.UserId);
            if (!Number.isFinite(id)) continue;

            const u = mapUsers.get(id);
            if (!u) continue;

            mapUsers.set(id, {
              ...u,
              materiaisKg: Number(item.totalWeightKg ?? item.TotalWeightKg ?? 0),
              valorTotal: Number(item.totalMoney ?? item.TotalMoney ?? 0),
              trocas: Number(item.tradesCount ?? item.TradesCount ?? 0),
            });
          }
        }

        if (!alive) return;
        setUsuarios(Array.from(mapUsers.values()));

        // 4) Desafios por unidade
        const challengesByUnit = await Promise.all(
          myUnits.map(async (un) => {
            const list = await getUnitChallenges(un.id, true);
            return { un, list: list || [] };
          })
        );

        const mappedChallenges = [];
        for (const group of challengesByUnit) {
          const un = group.un;
          for (const c of group.list) {
            const id = Number(c.id ?? c.Id);
            if (!Number.isFinite(id)) continue;

            mappedChallenges.push({
              id,
              titulo: String(c.title ?? c.Title ?? "Desafio"),
              tipo: "Semanal",
              descricao: String(c.description ?? c.Description ?? ""),
              prazo: "",
              metaKg: Number(c.targetKg ?? c.TargetKg ?? c.targetWeightKg ?? c.TargetWeightKg ?? 0),
              recompensa: "",
              unitId: un.id,
              unitNome: un.nome,
            });
          }
        }

        if (!alive) return;
        setDesafios(mappedChallenges);

      } catch (err) {
        console.error(err);
        if (!alive) return;
        setApiError("Não foi possível carregar dados do servidor. Confirme se a API está rodando em https://localhost:5001 e se você aceitou o certificado HTTPS no navegador.");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    }

    bootstrap();
    return () => { alive = false; };
  }, [DIRECTOR_ID]);

  useEffect(() => {
  async function loadDirectorAccount() {
    try {
      const data = await getUserById(DIRECTOR_ID);

      setContaForm({
        nome: data?.name || "",
        email: data?.email || "",
        phoneNumber: formatPhone(data?.phoneNumber || "")
      });
    } catch (err) {
      console.error(err);
    }
  }

  loadDirectorAccount();
}, [DIRECTOR_ID]);

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

  const suggestionsToShow = useMemo(() => {
    return remoteUserSuggestions.length ? remoteUserSuggestions : userSuggestions;
  }, [remoteUserSuggestions, userSuggestions]);

  function handlePickUser(u) {
    setUsuarios((prev) => {
      const exists = prev.some((x) => x.id === u.id);
      return exists ? prev : [...prev, u];
    });

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

  // ======= Trocas: carregar do banco quando entrar na aba Trocas =======
  async function loadTradesFromDbForUnit(unitId) {
    const uId = Number(unitId);
    if (!Number.isFinite(uId) || uId <= 0) return;

    try {
      setIsLoadingTrades(true);
      setApiError("");

      const usersOfUnit = usuarios.filter((u) => u.unidadeId === uId);
      const unitName = unidades.find((x) => x.id === uId)?.nome || "";

      const results = await Promise.all(
        usersOfUnit.map(async (u) => {
          try {
            const tradesApi = await getUserTrades(u.id);
            return (tradesApi || []).map((t) => normalizeTradeFromApi(t, u, unitName));
          } catch {
            return [];
          }
        })
      );

      const dbTrades = results
        .flat()
        .filter((t) => t && t.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTrocas(dbTrades);

    } catch (err) {
      console.error(err);
      setApiError("Não foi possível carregar o histórico de trocas do servidor.");
    } finally {
      setIsLoadingTrades(false);
    }
  }

  useEffect(() => {
    if (tab === "trocas" && unidadeSelecionada && usuarios.length > 0 && unidades.length > 0) {
      loadTradesFromDbForUnit(unidadeSelecionada);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, unidadeSelecionada, usuarios.length, unidades.length]);

  // ======= equipe =======
  function handleChangeUsuario(e) {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  }

  function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function handleSelecionarUsuarioEquipe(u) {
  setEquipeMsg("");
  setUsuarioSelecionado(u);

  setUsuarioEdicao({
    nome: u?.nome || "",
    email: u?.email || "",
    birthDate: toDateInput(u?.birthDate || u?.BirthDate),
    phoneNumber: formatPhone(u?.phoneNumber || u?.PhoneNumber || "")
  });
}

async function handleSalvarEdicaoUsuario() {
  if (!usuarioSelecionado) return;

  setEquipeMsg("");

  const nome = (usuarioEdicao.nome || "").trim();
  const email = (usuarioEdicao.email || "").trim();
  const birthDate = (usuarioEdicao.birthDate || "").trim();
  const phoneNumber = (usuarioEdicao.phoneNumber || "").trim();

  if (nome.length < 3) return setEquipeMsg("Nome inválido.");
  if (!email.includes("@")) return setEquipeMsg("E-mail inválido.");
  if (!birthDate) return setEquipeMsg("Data de nascimento obrigatória.");

  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length < 8) return setEquipeMsg("Celular inválido.");

  try {
    setIsSavingUser(true);

    await updateUser(usuarioSelecionado.id, {
      directorId: DIRECTOR_ID,
      name: nome,
      email,
      birthDate,
      phoneNumber
    });

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioSelecionado.id
          ? { ...u, nome, email, birthDate, phoneNumber }
          : u
      )
    );

    setUsuarioSelecionado((prev) =>
      prev ? { ...prev, nome, email, birthDate, phoneNumber } : prev
    );

    setEquipeMsg("Usuário atualizado com sucesso!");
  } catch (err) {
    console.error(err);
    setEquipeMsg("Não foi possível salvar. Verifique e-mail duplicado ou permissão.");
  } finally {
    setIsSavingUser(false);
  }
}

async function handleExcluirUsuario() {
  if (!usuarioSelecionado) return;

  const ok = window.confirm(
    `Deseja desativar o usuário "${usuarioSelecionado.nome}"?\nO histórico será mantido.`
  );
  if (!ok) return;

  setEquipeMsg("");

  try {
    setIsDeactivatingUser(true);

    await deactivateUser(usuarioSelecionado.id, { directorId: DIRECTOR_ID });

    setUsuarios((prev) => prev.filter((u) => u.id !== usuarioSelecionado.id));
    setUsuarioSelecionado(null);

    setEquipeMsg("Usuário desativado com sucesso!");
  } catch (err) {
    console.error(err);
    setEquipeMsg("Não foi possível desativar o usuário.");
  } finally {
    setIsDeactivatingUser(false);
  }
}

 // ✅ cria no banco via POST /api/Users
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

  const name = String(novoUsuario.nome || "").trim();
  const email = String(novoUsuario.email || "").trim();
  const password = String(novoUsuario.password || "");
  const birthDate = String(novoUsuario.birthDate || "").trim();     // YYYY-MM-DD
  const phoneNumber = String(novoUsuario.phoneNumber || "").trim();

  if (name.length < 3) {
    alert("O nome deve ter pelo menos 3 caracteres.");
    return;
  }
  if (!email.includes("@")) {
    alert("E-mail inválido.");
    return;
  }
  if (password.length < 8) {
    alert("A senha deve ter no mínimo 8 caracteres.");
    return;
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    alert("Senha fraca: use pelo menos 1 letra e 1 número.");
    return;
  }
  if (!birthDate) {
    alert("Informe a data de nascimento.");
    return;
  }
  if (!phoneNumber) {
    alert("Informe o celular.");
    return;
  }

  // validação leve do celular (somente dígitos)
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length < 8) {
    alert("Celular inválido.");
    return;
  }

  (async () => {
    try {
      setIsSubmittingUser(true);
      setApiError("");

      await createUser({
        directorId: DIRECTOR_ID,
        unitId: unidade.id,
        name,
        email,
        password,
        birthDate,
        phoneNumber
      });

      // Recarrega os usuários da unidade para manter tudo sincronizado
      const list = await getUnitUsers(unidade.id, "");
      const rankingList = await getUnitRanking(unidade.id, "weight");

      const mapRank = new Map();
      (rankingList || []).forEach((it) => {
        const id = Number(it.userId ?? it.UserId);
        if (!Number.isFinite(id)) return;
        mapRank.set(id, {
          materiaisKg: Number(it.totalWeightKg ?? it.TotalWeightKg ?? 0),
          valorTotal: Number(it.totalMoney ?? it.TotalMoney ?? 0),
          trocas: Number(it.tradesCount ?? it.TradesCount ?? 0),
        });
      });

      setUsuarios((prev) => {
        const others = prev.filter((u) => u.unidadeId !== unidade.id);

        const mapped = (list || []).map((ur) => {
          const id = Number(ur.id ?? ur.Id);
          const role = String(ur.role ?? ur.Role ?? "USER").toUpperCase();
          const tipo =
            role === "USER" ? "Usuário" :
            role === "DIRECTOR" ? "Diretor" :
            role === "ADMIN" ? "Admin" : role;

          const rk = mapRank.get(id) || { materiaisKg: 0, valorTotal: 0, trocas: 0 };

          return {
          id,
          nome: String(ur.name ?? ur.nome ?? ur.Name ?? "Sem nome"),
          tipo: (tipo === "USER" ? "Usuário" : tipo),
          unidadeId: unidade.id,
          unidadeNome: unidade.nome,
          email: String(ur.email ?? ur.Email ?? ""),
          totalXp: Number(ur.totalXp ?? ur.TotalXp ?? 0),
          materiaisKg: rk.materiaisKg,
          valorTotal: rk.valorTotal,
          trocas: rk.trocas,
          };
        });

        return [...others, ...mapped];
      });

      setNovoUsuario({
        nome: "",
        tipo: "Usuário",
        email: "",
        password: "",
        birthDate: "",
        phoneNumber: ""
      });

      alert("Usuário cadastrado com sucesso!");
    } catch (err) {
      const msg = String(err?.message || "");
      if (msg.toLowerCase().includes("já existe") || msg.toLowerCase().includes("duplicate") || msg.includes("409")) {
        alert("Já existe um usuário com esse e-mail.");
      } else if (msg.toLowerCase().includes("forbid") || msg.includes("403")) {
        alert("Sem permissão para cadastrar usuário nessa unidade.");
      } else {
        console.error(err);
        alert("Não foi possível cadastrar o usuário. Verifique a API.");
      }
    } finally {
      setIsSubmittingUser(false);
    }
  })();
}

  function handleCriarUnidade(e) {
    e.preventDefault();
    const nome = novoNomeUnidade.trim();
    if (!nome) return;

    // ⚠️ Por enquanto isso é só visual/local.
    // Depois a gente cria endpoint pra criar unidade no banco.
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
      case "materialAsc":
        return (a.materiaisKg || 0) - (b.materiaisKg || 0);
      case "valorDesc":
        return (b.valorTotal || 0) - (a.valorTotal || 0);
      case "valorAsc":
        return (a.valorTotal || 0) - (b.valorTotal || 0);
      default:
        return 0;
    }
  }

  const usuariosFiltrados = useMemo(() => {
    const q = filtroTexto.toLowerCase();
    return [...usuarios]
      .filter((u) => {
        const match =
          (u.nome || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.tipo || "").toLowerCase().includes(q) ||
          (u.unidadeNome || "").toLowerCase().includes(q);
        return match;
      })
      .sort(compararUsuarios);
  }, [usuarios, filtroTexto, ordenacao]);

  // ======= KPI =======
  const totalMateriais = useMemo(() => {
    return usuarios.reduce((acc, u) => acc + (u.materiaisKg || 0), 0);
  }, [usuarios]);

  const totalValor = useMemo(() => {
    return usuarios.reduce((acc, u) => acc + (u.valorTotal || 0), 0);
  }, [usuarios]);

  const ranking = useMemo(() => {
    const unidadeId = Number(rankingUnidadeId);

    const lista = usuarios
      .filter((u) => (unidadeId ? u.unidadeId === unidadeId : true))
      .map((u) => ({
        ...u,
        nivel: calcNivel(u.materiaisKg || 0),
      }));

    lista.sort((a, b) => {
      switch (rankingOrdenacao) {
        case "kgDesc":
          return (b.materiaisKg || 0) - (a.materiaisKg || 0);
        case "kgAsc":
          return (a.materiaisKg || 0) - (b.materiaisKg || 0);
        case "nomeAsc":
          return a.nome.localeCompare(b.nome);
        case "nomeDesc":
          return b.nome.localeCompare(a.nome);
        case "valorDesc":
          return (b.valorTotal || 0) - (a.valorTotal || 0);
        case "valorAsc":
          return (a.valorTotal || 0) - (b.valorTotal || 0);
        default:
          return 0;
      }
    });

    return lista;
  }, [usuarios, rankingUnidadeId, rankingOrdenacao]);

  // ======= editar dados (Diretor) =====
  async function handleSalvarConta(e) {
  e.preventDefault();
  setContaMsg("");

  const nome = (contaForm.nome || "").trim();
  const email = (contaForm.email || "").trim();
  const phoneNumber = (contaForm.phoneNumber || "").trim();

  if (nome.length < 3) {
    setContaMsg("Nome inválido.");
    return;
  }
  if (!email.includes("@")) {
    setContaMsg("E-mail inválido.");
    return;
  }

  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length < 8) {
    setContaMsg("Celular inválido.");
    return;
  }

  try {
    setIsSavingConta(true);

    await updateDirectorAccount(DIRECTOR_ID, {
      name: nome,
      email,
      phoneNumber
    });

    localStorage.setItem("C18_DIRECTOR_EMAIL", email);

    setContaMsg("Dados atualizados com sucesso.");
  } catch (err) {
    console.error(err);
    setContaMsg("Não foi possível atualizar os dados.");
  } finally {
    setIsSavingConta(false);
  }
}

async function handleAlterarSenhaConta(e) {
  e.preventDefault();
  setContaMsg("");

  const currentPassword = senhaContaForm.currentPassword || "";
  const newPassword = senhaContaForm.newPassword || "";
  const confirmPassword = senhaContaForm.confirmPassword || "";

  if (!currentPassword) {
    setContaMsg("Informe a senha atual.");
    return;
  }
  if (newPassword.length < 8) {
    setContaMsg("A nova senha deve ter no mínimo 8 caracteres.");
    return;
  }
  if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
    setContaMsg("A nova senha deve conter letra e número.");
    return;
  }
  if (newPassword !== confirmPassword) {
    setContaMsg("A confirmação da senha não confere.");
    return;
  }

  try {
    setIsSavingSenha(true);

    await changeDirectorPassword(DIRECTOR_ID, {
      currentPassword,
      newPassword
    });

    setSenhaContaForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setContaMsg("Senha alterada com sucesso.");
  } catch (err) {
    console.error(err);
    setContaMsg("Não foi possível alterar a senha. Verifique a senha atual.");
  } finally {
    setIsSavingSenha(false);
  }
}

  // ======= Desafios =======
  function handleChangeDesafio(e) {
    const { name, value } = e.target;
    setNovoDesafio((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCriarDesafio(e) {
    e.preventDefault();

    const unidadeId = Number(unidadeSelecionada) || Number(unidades[0]?.id);
    if (!unidadeId) {
      alert("Selecione uma unidade/turma antes de criar um desafio.");
      return;
    }

    const title = String(novoDesafio.titulo || "").trim();
    const description = String(novoDesafio.descricao || "").trim();
    const metaKg = parseFloat(String(novoDesafio.metaKg || "").replace(",", "."));

    if (!title || !description) {
      alert("Preencha Título e Descrição.");
      return;
    }

    if (!Number.isFinite(metaKg) || metaKg <= 0) {
      alert("Informe uma Meta em kg válida (maior que 0).");
      return;
    }

    const startDate = new Date();
    let endDate = new Date(startDate);

    const prazoStr = String(novoDesafio.prazo || "").trim().toLowerCase();
    const prazoMatch = prazoStr.match(/(\d+)\s*(h|d|w|m)/);
    if (prazoMatch) {
      const n = Number(prazoMatch[1]);
      const unit = prazoMatch[2];
      if (unit === "h") endDate = new Date(startDate.getTime() + n * 60 * 60 * 1000);
      if (unit === "d") endDate = new Date(startDate.getTime() + n * 24 * 60 * 60 * 1000);
      if (unit === "w") endDate = new Date(startDate.getTime() + n * 7 * 24 * 60 * 60 * 1000);
      if (unit === "m") endDate = new Date(startDate.getTime() + n * 30 * 24 * 60 * 60 * 1000);
    } else {
      if (novoDesafio.tipo === "Diário") endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      if (novoDesafio.tipo === "Semanal") endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (novoDesafio.tipo === "Mensal") endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    try {
      setIsSubmittingChallenge(true);
      setApiError("");

      await createChallenge({
        directorId: DIRECTOR_ID,
        unitId: unidadeId,
        title,
        description,
        targetWeightKg: metaKg,
        targetMoney: null,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // Recarrega desafios da unidade
      const list = await getUnitChallenges(unidadeId, true);
      const unNome = unidades.find((u) => u.id === unidadeId)?.nome || "Unidade";

      const mapped = (list || []).map((c) => ({
        id: Number(c.id ?? c.Id),
        titulo: String(c.title ?? c.Title ?? "Desafio"),
        tipo: "Semanal",
        descricao: String(c.description ?? c.Description ?? ""),
        prazo: "",
        metaKg: Number(c.targetKg ?? c.TargetKg ?? c.targetWeightKg ?? c.TargetWeightKg ?? 0),
        recompensa: "",
        unitId: unidadeId,
        unitNome: unNome,
      }));

      setDesafios((prev) => {
        const others = prev.filter((d) => Number(d.unitId) !== unidadeId);
        return [...others, ...mapped];
      });

      setNovoDesafio({ titulo: "", tipo: "Diário", descricao: "", prazo: "", metaKg: "", recompensa: "" });
      alert("Desafio criado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Não foi possível criar o desafio no servidor.");
    } finally {
      setIsSubmittingChallenge(false);
    }
  }

  // ===== registrar troca =====
  function handleChangeNovaTroca(e) {
    const { name, value } = e.target;
    setNovaTroca((prev) => ({ ...prev, [name]: value }));
  }

  async function handleRegistrarTroca(e) {
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

    let tradeResponse = null;

      try {
      setIsSubmittingTrade(true);
      setApiError("");

      tradeResponse = await createTrade({
      directorId: DIRECTOR_ID,
      unitId: selectedUser.unidadeId,
      userId: selectedUser.id,
      materialType: material,
      weightKg: pesoKg,
      amountMoney: valor,
      obs: (novaTroca.obs || "").trim(),
      });
      } catch (err) {
      console.error(err);
      setIsSubmittingTrade(false);
      alert("Não foi possível registrar a troca no servidor. Verifique a API e tente novamente.");
      return;
    } finally {
      setIsSubmittingTrade(false);
    }

   
    // Atualiza métricas localmente
    const gainedXp = Number(tradeResponse?.gainedXp ?? tradeResponse?.GainedXp ?? 0);

    setUsuarios((prev) =>
    prev.map((u) => {
    if (u.id !== selectedUser.id) return u;
    return {
      ...u,
      totalXp: (u.totalXp || 0) + gainedXp,
      materiaisKg: (u.materiaisKg || 0) + pesoKg,
      valorTotal: (u.valorTotal || 0) + valor,
      trocas: (u.trocas || 0) + 1,
    };
  })
);

    setNovaTroca({ material: "Plástico", pesoKg: "", valorR$: "", obs: "" });
    if (gainedXp > 0) {
  alert(`Troca registrada com sucesso! +${gainedXp} XP`);
}

    // Recarrega histórico do banco (sem mexer no layout)
    // Recarrega histórico do banco (sempre)
await loadTradesFromDbForUnit(selectedUser.unidadeId);
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
        trocasFiltroUnidade === "todas" ||
        Number(trocasFiltroUnidade) === t.unidadeId;

      const dt = new Date(t.createdAt);

      const inicioOk = !trocasDataInicio
        ? true
        : dt >= new Date(`${trocasDataInicio}T00:00:00`);

      const fimOk = !trocasDataFim
        ? true
        : dt <= new Date(`${trocasDataFim}T23:59:59`);

      return matchTexto && matchUnidade && inicioOk && fimOk;
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return trocasOrdenacao === "dataDesc" ? db - da : da - db;
    });
}, [
  trocas,
  trocasFiltroTexto,
  trocasFiltroUnidade,
  trocasOrdenacao,
  trocasDataInicio,
  trocasDataFim
]);

  return (
    <main className="dashboard-page">
      {apiError && (
        <div className="dash-alert dash-alert-danger" style={{ marginBottom: "1rem" }}>
          {apiError}
        </div>
      )}

      {isLoading && !apiError && (
        <div className="dash-alert" style={{ marginBottom: "1rem" }}>
          Carregando dados do servidor...
        </div>
      )}

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-icon">🐷</div>
          <div>
            <h1 className="brand-title">Cofrinho dos 18</h1>
            <span className="brand-subtitle">Painel do Diretor</span>
          </div>
        </div>

        <div className="dashboard-user">
          <span className="dashboard-user-email">Olá, {DIRECTOR_EMAIL}</span>
          <button className="btn-outline" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <div className="dashboard-shell">
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
        {!isLoading && unidades.length === 0 && (
  <div className="dash-alert" style={{ marginBottom: "1rem" }}>
    Este diretor ainda não possui unidade vinculada. Procure o administrador.
  </div>
)}

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
    <label>Tipo</label>
    <select name="tipo" value={novoUsuario.tipo} onChange={handleChangeUsuario}>
      <option value="Usuário">Usuário</option>
      <option value="Professor">Professor</option>
      <option value="Auxiliar">Auxiliar</option>
    </select>
  </div>

  <div className="dash-form-group">
    <label>E-mail</label>
    <input type="email" name="email" value={novoUsuario.email} onChange={handleChangeUsuario} required />
  </div>

  <div className="dash-form-group">
    <label>Senha</label>
    <input
      type="password"
      name="password"
      value={novoUsuario.password}
      onChange={handleChangeUsuario}
      required
    />
  </div>

  <div className="dash-form-group">
    <label>Data de nascimento</label>
    <input
      type="date"
      name="birthDate"
      value={novoUsuario.birthDate}
      onChange={handleChangeUsuario}
      required
    />
  </div>

  <div className="dash-form-group">
    <label>Celular</label>
    <input
      type="tel"
      name="phoneNumber"
      value={novoUsuario.phoneNumber}
      onChange={handleChangeUsuario}
      required
    />
  </div>

  <div className="dash-form-group">
    <label>Unidade/Turma</label>
    <select value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(e.target.value)} required>
      <option value="">Selecione...</option>
      {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
    </select>
  </div>

  <button type="submit" className="btn-laranja btn-full" disabled={isSubmittingUser}>
    {isSubmittingUser ? "Cadastrando..." : "Cadastrar usuário"}
  </button>
</form>
            </div>

            <div className="dash-card">
              <h2 className="dash-section-title">Ranking por unidade</h2>

              <div className="dash-filters">
                <select className="dash-filter-select" value={rankingUnidadeId} onChange={(e) => setRankingUnidadeId(e.target.value)}>
                  {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                </select>

                <select className="dash-filter-select" value={rankingOrdenacao} onChange={(e) => setRankingOrdenacao(e.target.value)}>
                  <option value="kgDesc">Mais kg</option>
                  <option value="kgAsc">Menos kg</option>
                  <option value="valorDesc">Mais valor</option>
                  <option value="valorAsc">Menos valor</option>
                  <option value="nomeAsc">A-Z</option>
                  <option value="nomeDesc">Z-A</option>
                </select>
              </div>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Unidade</th>
                    <th>XP</th>
                    <th>Kg</th>
                    <th>R$</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((u) => (
                      <tr key={u.id}>
  <td>{u.nome}</td>
  <td>{u.email}</td>
  <td>{u.unidadeNome}</td>
  <td>{u.totalXp || 0}</td>
  <td>{(u.materiaisKg || 0).toFixed(2)}</td>
  <td>R$ {(u.valorTotal || 0).toFixed(2)}</td>
</tr>
                    ))}
                    {ranking.length === 0 && <tr><td colSpan="7">Sem dados no momento.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ===== TROCAS ===== */}
        {tab === "trocas" && (
          <section className="dashboard-content-grid">
            <div className="dash-card">
              <h2 className="dash-section-title">Registrar troca</h2>
              <p className="dash-section-subtitle">
                Selecione um usuário e registre material, peso e valor. (Salva no servidor via API e atualiza o histórico local da sessão.)
              </p>

              <form className="dash-form" onSubmit={handleRegistrarTroca}>
                <div className="dash-form-group">
                  <label>Buscar usuário</label>

                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Digite nome, e-mail ou unidade..."
                      value={userQuery}
                      onChange={(e) => {
                        setUserQuery(e.target.value);
                        setShowUserSuggestions(true);
                      }}
                      onFocus={() => setShowUserSuggestions(true)}
                    />

                    {selectedUser && (
                      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="pill">
                          Selecionado: {selectedUser.nome} • {selectedUser.unidadeNome}
                        </span>
                        <button type="button" className="btn-outline" onClick={handleClearSelectedUser}>
                          Trocar
                        </button>
                      </div>
                    )}

                    {showUserSuggestions && !selectedUser && suggestionsToShow.length > 0 && (
                      <div
                        className="dash-card"
                        style={{
                          position: "absolute",
                          zIndex: 20,
                          top: "100%",
                          left: 0,
                          right: 0,
                          marginTop: 6,
                          padding: 8,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <strong>Resultados</strong>
                          <button type="button" className="btn-outline" onClick={() => setShowUserSuggestions(false)}>
                            Fechar
                          </button>
                        </div>

                        <div style={{ display: "grid", gap: 6 }}>
                          {suggestionsToShow.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              className="btn-outline"
                              style={{ textAlign: "left" }}
                              onClick={() => handlePickUser(u)}
                            >
                              <div><strong>{u.nome}</strong></div>
                              <div style={{ fontSize: 12, opacity: 0.8 }}>
                                {u.email ? u.email : "sem e-mail"} • {u.unidadeNome}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="dash-form-group">
                  <label>Material</label>
                  <select name="material" value={novaTroca.material} onChange={handleChangeNovaTroca}>
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Peso (kg)</label>
                  <input
                    type="text"
                    name="pesoKg"
                    value={novaTroca.pesoKg}
                    onChange={handleChangeNovaTroca}
                    placeholder="Ex: 2,5"
                  />
                </div>

                <div className="dash-form-group">
                  <label>Valor (R$)</label>
                  <input
                    type="text"
                    name="valorR$"
                    value={novaTroca.valorR$}
                    onChange={handleChangeNovaTroca}
                    placeholder="Ex: 7,00"
                  />
                </div>

                <div className="dash-form-group">
                  <label>Observação</label>
                  <input
                    type="text"
                    name="obs"
                    value={novaTroca.obs}
                    onChange={handleChangeNovaTroca}
                    placeholder="Opcional"
                  />
                </div>

                <button type="submit" className="btn-laranja btn-full" disabled={isSubmittingTrade}>
                  {isSubmittingTrade ? "Registrando..." : "Registrar troca"}
                </button>
              </form>
            </div>

            <div className="dash-card">
              <h2 className="dash-section-title">Histórico de trocas</h2>

              {isLoadingTrades && (
                <div className="dash-alert" style={{ marginBottom: "1rem" }}>
                  Carregando histórico do servidor...
                </div>
              )}

              <div className="dash-filters">
  <input
    className="dash-filter-input"
    placeholder="Buscar por usuário, unidade, material, obs..."
    value={trocasFiltroTexto}
    onChange={(e) => setTrocasFiltroTexto(e.target.value)}
  />

  <select
    className="dash-filter-select"
    value={trocasFiltroUnidade}
    onChange={(e) => setTrocasFiltroUnidade(e.target.value)}
  >
    <option value="todas">Todas as unidades</option>
    {unidades.map((u) => (
      <option key={u.id} value={u.id}>
        {u.nome}
      </option>
    ))}
  </select>

  <select
    className="dash-filter-select"
    value={trocasOrdenacao}
    onChange={(e) => setTrocasOrdenacao(e.target.value)}
  >
    <option value="dataDesc">Mais recentes</option>
    <option value="dataAsc">Mais antigas</option>
  </select>

  <input
    className="dash-filter-input"
    type="date"
    value={trocasDataInicio}
    onChange={(e) => setTrocasDataInicio(e.target.value)}
  />

  <input
    className="dash-filter-input"
    type="date"
    value={trocasDataFim}
    onChange={(e) => setTrocasDataFim(e.target.value)}
  />
</div>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Usuário</th>
                      <th>Unidade</th>
                      <th>Material</th>
                      <th>Peso (kg)</th>
                      <th>Valor (R$)</th>
                      <th>Obs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trocasFiltradas.map((t) => (
                      <tr key={t.id}>
                        <td>{new Date(t.createdAt).toLocaleString()}</td>
                        <td>{t.userNome}</td>
                        <td>{t.unidadeNome}</td>
                        <td>{t.material}</td>
                        <td>{Number(t.pesoKg || 0).toFixed(2)}</td>
                        <td>R$ {Number(t.valorR$ || 0).toFixed(2)}</td>
                        <td>{t.obs || "-"}</td>
                      </tr>
                    ))}
                    {trocasFiltradas.length === 0 && (
                      <tr><td colSpan="7">Nenhuma troca registrada.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
                Observação: agora o histórico busca do servidor ao abrir esta aba (GET /api/users/{`{id}`}/trades).
                As trocas locais da sessão continuam aparecendo também.
              </p>
            </div>
          </section>
        )}

        {/* ===== EQUIPE ===== */}
        {tab === "equipe" && (
  <section className="dashboard-content-grid">
    <div className="dash-card">
      <h2 className="dash-section-title">Equipe / Usuários</h2>
      <p className="dash-section-subtitle">Selecione um usuário para visualizar, editar ou desativar.</p>

      {equipeMsg && (
        <div className="dash-alert" style={{ marginBottom: "1rem" }}>
          {equipeMsg}
        </div>
      )}

      <div className="dash-filters">
        <input
          className="dash-filter-input"
          placeholder="Buscar por nome ou e-mail..."
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
        />

        <select className="dash-filter-select" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
          <option value="nomeAsc">Nome (A-Z)</option>
          <option value="nomeDesc">Nome (Z-A)</option>
          <option value="materialDesc">Mais kg</option>
          <option value="valorDesc">Mais R$</option>
        </select>
      </div>

      <div className="dash-table-wrapper">
        <table className="dash-table">
          <thead>
            <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Unidade</th>
            <th>XP</th>
            <th>Kg</th>
            <th>R$</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr
  key={u.id}
  onClick={() => handleSelecionarUsuarioEquipe(u)}
  style={{
    cursor: "pointer",
    background: usuarioSelecionado?.id === u.id ? "rgba(0,0,0,0.03)" : "transparent"
  }}
>
  <td>{u.nome}</td>
  <td>{u.email || "-"}</td>
  <td>{u.unidadeNome}</td>
  <td>{u.totalXp || 0}</td>
  <td>{Number(u.materiaisKg || 0).toFixed(2)}</td>
  <td>R$ {Number(u.valorTotal || 0).toFixed(2)}</td>
</tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr><td colSpan="6">Nenhum usuário encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    <div className="dash-card">
      <h2 className="dash-section-title">Detalhes do usuário</h2>

      {!usuarioSelecionado ? (
        <p className="dash-section-subtitle">Selecione alguém na lista para visualizar ou editar.</p>
      ) : (
        <div className="dash-form">
          <div className="dash-form-group">
            <label>Nome</label>
            <input
              type="text"
              value={usuarioEdicao.nome}
              onChange={(e) => setUsuarioEdicao((prev) => ({ ...prev, nome: e.target.value }))}
            />
          </div>

          <div className="dash-form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={usuarioEdicao.email}
              onChange={(e) => setUsuarioEdicao((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="dash-form-group">
            <label>Data de nascimento</label>
            <input
              type="date"
              value={usuarioEdicao.birthDate}
              onChange={(e) => setUsuarioEdicao((prev) => ({ ...prev, birthDate: e.target.value }))}
            />
          </div>

          <div className="dash-form-group">
            <label>Celular</label>
            <input
              type="tel"
              value={usuarioEdicao.phoneNumber}
              onChange={(e) =>
                setUsuarioEdicao((prev) => ({
                  ...prev,
                  phoneNumber: formatPhone(e.target.value)
                }))
              }
            />
          </div>

          <p className="dash-section-subtitle">
            Unidade: <strong>{usuarioSelecionado.unidadeNome}</strong>
          </p>

          <div className="dash-card">
  <span className="dash-card-label">XP</span>
  <strong className="dash-card-number">{usuarioSelecionado.totalXp || 0}</strong>
</div>

          <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            <div className="dash-card">
              <span className="dash-card-label">Material</span>
              <strong className="dash-card-number">
                {Number(usuarioSelecionado.materiaisKg || 0).toFixed(2)} kg
              </strong>
            </div>

            <div className="dash-card">
              <span className="dash-card-label">Valor</span>
              <strong className="dash-card-number">
                R$ {Number(usuarioSelecionado.valorTotal || 0).toFixed(2)}
              </strong>
            </div>

            <div className="dash-card">
              <span className="dash-card-label">Trocas</span>
              <strong className="dash-card-number">{usuarioSelecionado.trocas || 0}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="btn-laranja"
              onClick={handleSalvarEdicaoUsuario}
              disabled={isSavingUser}
            >
              {isSavingUser ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              className="btn-outline"
              onClick={handleExcluirUsuario}
              disabled={isDeactivatingUser}
            >
              {isDeactivatingUser ? "Desativando..." : "Excluir"}
            </button>
          </div>
        </div>
      )}
    </div>
  </section>
)}

        {/* ===== UNIDADES ===== */}
        {tab === "unidades" && (
          <section className="dashboard-content-grid">
            <div className="dash-card">
              <h2 className="dash-section-title">Unidades / Turmas</h2>
              <p className="dash-section-subtitle">Visualize as unidades sob gestão.</p>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Unidade</th>
                      <th>Usuários</th>
                      <th>Kg</th>
                      <th>R$</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unidades.map((u) => {
                      const us = usuarios.filter((x) => x.unidadeId === u.id);
                      const kg = us.reduce((a, x) => a + (x.materiaisKg || 0), 0);
                      const vr = us.reduce((a, x) => a + (x.valorTotal || 0), 0);

                      return (
                        <tr key={u.id}>
                          <td>{u.nome}</td>
                          <td>{us.length}</td>
                          <td>{kg.toFixed(2)}</td>
                          <td>R$ {vr.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    {unidades.length === 0 && <tr><td colSpan="4">Nenhuma unidade encontrada.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dash-card">
              <h2 className="dash-section-title">Criar unidade (visual/local)</h2>
              <p className="dash-section-subtitle">
                Por enquanto isso é apenas local. Quando você quiser, a gente cria o endpoint no backend.
              </p>

              <form className="dash-form" onSubmit={handleCriarUnidade}>
                <div className="dash-form-group">
                  <label>Nome da unidade</label>
                  <input value={novoNomeUnidade} onChange={(e) => setNovoNomeUnidade(e.target.value)} />
                </div>

                <button type="submit" className="btn-laranja btn-full">Criar unidade</button>
              </form>
            </div>
          </section>
        )}

        {/* ===== DESAFIOS ===== */}
        {tab === "desafios" && (
          <section className="dashboard-content-grid">
            <div className="dash-card">
              <h2 className="dash-section-title">Criar desafio</h2>
              <p className="dash-section-subtitle">Crie desafios por unidade/turma (salva no servidor).</p>

              <form className="dash-form" onSubmit={handleCriarDesafio}>
                <div className="dash-form-group">
                  <label>Unidade/Turma</label>
                  <select value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Título</label>
                  <input name="titulo" value={novoDesafio.titulo} onChange={handleChangeDesafio} required />
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
                  <input name="descricao" value={novoDesafio.descricao} onChange={handleChangeDesafio} required />
                </div>

                <div className="dash-form-group">
                  <label>Prazo (opcional)</label>
                  <input
                    name="prazo"
                    value={novoDesafio.prazo}
                    onChange={handleChangeDesafio}
                    placeholder="Ex: 7d, 12h, 2w"
                  />
                </div>

                <div className="dash-form-group">
                  <label>Meta (kg)</label>
                  <input name="metaKg" value={novoDesafio.metaKg} onChange={handleChangeDesafio} placeholder="Ex: 10" required />
                </div>

                <button type="submit" className="btn-laranja btn-full" disabled={isSubmittingChallenge}>
                  {isSubmittingChallenge ? "Criando..." : "Criar desafio"}
                </button>
              </form>
            </div>

            <div className="dash-card">
              <h2 className="dash-section-title">Desafios ativos</h2>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Unidade</th>
                      <th>Meta (kg)</th>
                      <th>Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {desafios.map((d) => (
                      <tr key={d.id}>
                        <td>{d.titulo}</td>
                        <td>{d.unitNome}</td>
                        <td>{Number(d.metaKg || 0).toFixed(2)}</td>
                        <td>{d.descricao || "-"}</td>
                      </tr>
                    ))}
                    {desafios.length === 0 && <tr><td colSpan="4">Sem desafios no momento.</td></tr>}
                  </tbody>
                </table>
              </div>

              <p style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
                Progresso detalhado (getChallengeProgress) pode ser ligado depois por um botão “Ver progresso”,
                sem alterar o layout — você já importou a função no topo.
              </p>
            </div>
          </section>
        )}

        {/* ===== CONTA ===== */}
{tab === "conta" && (
  <section className="dashboard-content-grid">
    <div className="dash-card">
      <h2 className="dash-section-title">Minha conta</h2>
      <p className="dash-section-subtitle">Atualize seus dados de acesso e contato.</p>

      {contaMsg && (
        <div className="dash-alert" style={{ marginBottom: "1rem" }}>
          {contaMsg}
        </div>
      )}

      <form className="dash-form" onSubmit={handleSalvarConta}>
        <div className="dash-form-group">
          <label>Nome</label>
          <input
            type="text"
            value={contaForm.nome}
            onChange={(e) => setContaForm((prev) => ({ ...prev, nome: e.target.value }))}
            required
          />
        </div>

        <div className="dash-form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={contaForm.email}
            onChange={(e) => setContaForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="dash-form-group">
          <label>Celular</label>
          <input
            type="tel"
            value={contaForm.phoneNumber}
            onChange={(e) =>
              setContaForm((prev) => ({
                ...prev,
                phoneNumber: formatPhone(e.target.value)
              }))
            }
            required
          />
        </div>

        <button type="submit" className="btn-laranja btn-full" disabled={isSavingConta}>
          {isSavingConta ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>

    <div className="dash-card">
      <h2 className="dash-section-title">Alterar senha</h2>
      <p className="dash-section-subtitle">Troque sua senha com segurança.</p>

      <form className="dash-form" onSubmit={handleAlterarSenhaConta}>
        <div className="dash-form-group">
          <label>Senha atual</label>
          <input
            type="password"
            value={senhaContaForm.currentPassword}
            onChange={(e) =>
              setSenhaContaForm((prev) => ({ ...prev, currentPassword: e.target.value }))
            }
            required
          />
        </div>

        <div className="dash-form-group">
          <label>Nova senha</label>
          <input
            type="password"
            value={senhaContaForm.newPassword}
            onChange={(e) =>
              setSenhaContaForm((prev) => ({ ...prev, newPassword: e.target.value }))
            }
            required
          />
        </div>

        <div className="dash-form-group">
          <label>Confirmar nova senha</label>
          <input
            type="password"
            value={senhaContaForm.confirmPassword}
            onChange={(e) =>
              setSenhaContaForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            required
          />
        </div>

        <button type="submit" className="btn-laranja btn-full" disabled={isSavingSenha}>
          {isSavingSenha ? "Alterando..." : "Alterar senha"}
        </button>
      </form>
    </div>
  </section>
)}
      </div>
    </main>
  );
}