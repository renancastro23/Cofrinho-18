using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    public record LoginRequest(string Email, string Password);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        private sealed class PwdUser { }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var email = (req.Email ?? "").Trim().ToLower();
            var password = req.Password ?? "";

            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Informe o e-mail.");

            if (string.IsNullOrWhiteSpace(password))
                return BadRequest("Informe a senha.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            const string sql = @"
SELECT Id, Name, Email, Role, PasswordHash, IsActive
FROM dbo.Users
WHERE Email = @Email;
";

            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Email", email);

            await using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
                return Unauthorized("E-mail ou senha inválidos.");

            var id = reader.GetInt32(reader.GetOrdinal("Id"));
            var name = reader.GetString(reader.GetOrdinal("Name"));
            var dbEmail = reader.GetString(reader.GetOrdinal("Email"));
            var role = reader.GetString(reader.GetOrdinal("Role"));
            var passwordHash = reader.GetString(reader.GetOrdinal("PasswordHash"));
            var isActive = reader.GetBoolean(reader.GetOrdinal("IsActive"));

            if (!isActive)
                return Unauthorized("Usuário inativo. Procure o administrador.");

            var hasher = new PasswordHasher<PwdUser>();
            var result = hasher.VerifyHashedPassword(new PwdUser(), passwordHash, password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("E-mail ou senha inválidos.");

            return Ok(new
            {
                Id = id,
                Name = name,
                Email = dbEmail,
                Role = role
            });
        }
    }
}