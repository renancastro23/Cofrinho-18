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

  // Alguns endpoints podem retornar vazio, mas no seu caso normalmente é JSON
  return await response.json();
}

// ==========================
// UNIDADES
// ==========================
export const getUnits = () => request("/api/Units");

export const getUnitUsers = (unitId, search = "") =>
  request(`/api/units/${unitId}/users?search=${encodeURIComponent(search)}`);

export const getUnitRanking = (unitId, sort = "weight") =>
  request(`/api/units/${unitId}/ranking?sort=${sort}`);

// ==========================
// USUÁRIOS (Diretor cria usuário na unidade)
// ==========================
export const createUser = (payload) =>
  request("/api/Users", {
    method: "POST",
    body: JSON.stringify(payload)
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

// ==========================
// USUÁRIOS (consultas)
// ==========================
export const getUserProgress = (userId) =>
  request(`/api/users/${userId}/progress`);

export const getUserTrades = (userId) =>
  request(`/api/users/${userId}/trades`);


// editar usuários
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

export const getUserById = (userId) =>
  request(`/api/Users/${userId}`);

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