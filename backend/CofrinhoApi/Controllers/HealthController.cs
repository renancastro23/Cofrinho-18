using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("health")]
    public class HealthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public HealthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("db")]
        public async Task<IActionResult> Db()
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada no appsettings.json.");

            try
            {
                await using var conn = new SqlConnection(cs);
                await conn.OpenAsync();

                await using var cmd = new SqlCommand("SELECT 1", conn);
                var result = await cmd.ExecuteScalarAsync();

                return Ok(new { status = "ok", database = "connected", result });
            }
            catch (Exception ex)
            {
                return Problem($"Falha ao conectar no banco: {ex.Message}");
            }
        }
    }
}
