const API_URL = "https://localhost:5001/api"; // se der problema de certificado, teste http://localhost:5000/api

export async function createDirector(dados) {
  const resp = await fetch(`${API_URL}/admin/diretores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!resp.ok) {
    const errorBody = await resp.json().catch(() => ({}));
    throw new Error(errorBody.message || "Erro ao cadastrar diretor");
  }

  return resp.json();
}

export async function createUserByAdmin(dados) {
  const resp = await fetch(`${API_URL}/admin/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!resp.ok) {
    const errorBody = await resp.json().catch(() => ({}));
    throw new Error(errorBody.message || "Erro ao cadastrar usuário");
  }

  return resp.json();
}

export async function createUserByDirector(dados) {
  const resp = await fetch(`${API_URL}/diretor/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!resp.ok) {
    const errorBody = await resp.json().catch(() => ({}));
    throw new Error(errorBody.message || "Erro ao cadastrar usuário");
  }

  return resp.json();
}
