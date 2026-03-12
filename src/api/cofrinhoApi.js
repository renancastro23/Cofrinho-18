const API_BASE = process.env.REACT_APP_API_BASE_URL;

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro na requisição");
  }

  // Evita erro quando endpoint retorna vazio
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return await response.json();
}

// ==========================
// ADMIN
// ==========================
export const getAdminSummary = () =>
  request("/api/Admin/summary");

export const getAdminDirectors = () =>
  request("/api/Admin/directors");

export const createAdminDirector = (payload) =>
  request("/api/Admin/directors", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminDirector = (directorId, payload) =>
  request(`/api/Admin/directors/${directorId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deactivateAdminDirector = (directorId) =>
  request(`/api/Admin/directors/${directorId}/deactivate`, {
    method: "POST",
  });

export const getAdminUnits = () =>
  request("/api/Admin/units");

export const createAdminUnit = (payload) =>
  request("/api/Admin/units", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminUnit = (unitId, payload) =>
  request(`/api/Admin/units/${unitId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deactivateAdminUnit = (unitId) =>
  request(`/api/Admin/units/${unitId}/deactivate`, {
    method: "POST",
  });

export const getAdminUsers = () =>
  request("/api/Admin/users");

export const deactivateAdminUser = (userId) =>
  request(`/api/Admin/users/${userId}/deactivate`, {
    method: "POST",
  });

// ==========================
// UNIDADES / DIRETOR
// ==========================
export const getUnits = () =>
  request("/api/Units");

export const getUnitUsers = (unitId, search = "") =>
  request(`/api/units/${unitId}/users${search ? `?search=${encodeURIComponent(search)}` : ""}`);

export const getUnitRanking = (unitId, sort = "weight") =>
  request(`/api/units/${unitId}/ranking?sort=${encodeURIComponent(sort)}`);

// ==========================
// USUÁRIOS (Diretor cria usuário na unidade)
// ==========================
export const createUser = (payload) =>
  request("/api/Users", {
    method: "POST",
    body: JSON.stringify(payload)
  });

// ==========================
// USUÁRIOS (consultas)
// ==========================
export const getUserById = (userId) =>
  request(`/api/Users/${userId}`);

export const getUserProgress = (userId) =>
  request(`/api/users/${userId}/progress`);

export const getUserTrades = (userId) =>
  request(`/api/users/${userId}/trades`);

export const updateUser = (userId, payload) =>
  request(`/api/Users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deactivateUser = (userId, payload) =>
  request(`/api/Users/${userId}/deactivate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ==========================
// CONTA DO DIRETOR
// ==========================
export const updateDirectorAccount = (userId, payload) =>
  request(`/api/Users/${userId}/account`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const changeDirectorPassword = (userId, payload) =>
  request(`/api/Users/${userId}/change-password`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ==========================
// TROCAS
// ==========================
export const createTrade = (payload) =>
  request("/api/Trades", {
    method: "POST",
    body: JSON.stringify(payload)
  });

// ==========================
// DESAFIOS
// ==========================
export const createChallenge = (payload) =>
  request("/api/Challenges", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const getUnitChallenges = (unitId, activeOnly = true) =>
  request(`/api/units/${unitId}/challenges?activeOnly=${activeOnly}`);

export const getChallengeProgress = (challengeId) =>
  request(`/api/Challenges/${challengeId}/progress`);