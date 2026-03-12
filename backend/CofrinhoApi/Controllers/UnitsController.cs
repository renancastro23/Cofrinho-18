using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnitsController : ControllerBase
    {
        private readonly IConfiguration _config;

        public UnitsController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada no appsettings.json.");

            var units = new List<object>();

            try
            {
                await using var conn = new SqlConnection(cs);
                await conn.OpenAsync();

                // Ajuste os nomes das colunas se o seu Units tiver outros campos
                const string sql = @"SELECT Id, Name FROM Units ORDER BY Name";

                await using var cmd = new SqlCommand(sql, conn);
                await using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    units.Add(new
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1)
                    });
                }

                return Ok(units);
            }
            catch (SqlException ex)
            {
                // Se der erro aqui, geralmente é nome de tabela/colunas diferente
                return Problem($"Erro de SQL ao listar Units: {ex.Message}");
            }
            catch (Exception ex)
            {
                return Problem($"Erro ao listar Units: {ex.Message}");
            }
        }
    }
}
