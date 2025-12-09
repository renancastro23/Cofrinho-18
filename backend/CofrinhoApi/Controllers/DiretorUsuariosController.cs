using CofrinhoApi.Models;
using CofrinhoApi.Stores;
using Microsoft.AspNetCore.Mvc;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/diretor/usuarios")]
    public class DiretorUsuariosController : ControllerBase
    {
        public class CriarUsuarioDiretorRequest
        {
            public string Nome { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Senha { get; set; } = string.Empty;
            public string? Turma { get; set; }
            public string? Instituicao { get; set; }
        }

        // POST: api/diretor/usuarios
        [HttpPost]
        public ActionResult<Usuario> CriarUsuario([FromBody] CriarUsuarioDiretorRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Senha))
                return BadRequest(new { message = "E-mail e senha são obrigatórios" });

            if (UsuariosStore.GetByEmail(req.Email) != null)
                return Conflict(new { message = "Já existe usuário com esse e-mail" });

            var usuario = new Usuario
            {
                Nome = req.Nome,
                Email = req.Email,
                Senha = req.Senha,
                Turma = req.Turma,
                Instituicao = req.Instituicao,
                Role = "Usuario"
            };

            UsuariosStore.Add(usuario);
            return CreatedAtAction(nameof(CriarUsuario), new { id = usuario.Id }, usuario);
        }
    }
}
