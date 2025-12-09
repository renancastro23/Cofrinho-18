using CofrinhoApi.Models;
using CofrinhoApi.Stores;
using Microsoft.AspNetCore.Mvc;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminUsuariosController : ControllerBase
    {
        public class CriarDiretorRequest
        {
            public string Nome { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Senha { get; set; } = string.Empty;
            public string Instituicao { get; set; } = string.Empty;
        }

        public class CriarUsuarioRequest
        {
            public string Nome { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Senha { get; set; } = string.Empty;
            public string? Turma { get; set; }
            public string? Instituicao { get; set; }
        }

        // POST: api/admin/diretores
        [HttpPost("diretores")]
        public ActionResult<Usuario> CriarDiretor([FromBody] CriarDiretorRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Senha))
                return BadRequest(new { message = "E-mail e senha são obrigatórios" });

            if (UsuariosStore.GetByEmail(req.Email) != null)
                return Conflict(new { message = "Já existe usuário com esse e-mail" });

            var diretor = new Usuario
            {
                Nome = req.Nome,
                Email = req.Email,
                Senha = req.Senha,
                Instituicao = req.Instituicao,
                Role = "Diretor"
            };

            UsuariosStore.Add(diretor);
            return CreatedAtAction(nameof(ObterUsuario), new { id = diretor.Id }, diretor);
        }

        // POST: api/admin/usuarios
        [HttpPost("usuarios")]
        public ActionResult<Usuario> CriarUsuario([FromBody] CriarUsuarioRequest req)
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
            return CreatedAtAction(nameof(ObterUsuario), new { id = usuario.Id }, usuario);
        }

        // GET: api/admin/usuarios/{id}
        [HttpGet("usuarios/{id}")]
        public ActionResult<Usuario> ObterUsuario(int id)
        {
            var usuario = UsuariosStore.GetById(id);
            if (usuario == null) return NotFound();
            return usuario;
        }

        // GET: api/admin/usuarios
        [HttpGet("usuarios")]
        public ActionResult<IEnumerable<Usuario>> ListarUsuarios()
        {
            return Ok(UsuariosStore.GetAll());
        }
    }
}
