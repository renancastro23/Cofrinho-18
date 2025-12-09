using CofrinhoApi.Models;
using CofrinhoApi.Stores;
using Microsoft.AspNetCore.Mvc;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Senha { get; set; } = string.Empty;
        }

        public class LoginResponse
        {
            public int Id { get; set; }
            public string Nome { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Role { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
        {
            var usuario = UsuariosStore.GetByEmail(request.Email);

            if (usuario == null || usuario.Senha != request.Senha)
            {
                return Unauthorized(new { message = "E-mail ou senha inválidos" });
            }

            return Ok(new LoginResponse
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Role = usuario.Role
            });
        }
    }
}
