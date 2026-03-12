using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/units/{unitId:int}/users")]
    public class UnitUsersController : ControllerBase
    {
        private readonly IConfiguration _config;

        public UnitUsersController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersByUnit(
            [FromRoute] int unitId,
            [FromQuery] string? search = null)
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            var users = new List<object>();

            try
            {
                await using var conn = new SqlConnection(cs);
                await conn.OpenAsync();

                // Busca opcional por nome (prefixo/contém)
                // Usa parâmetros (segurança).
                var sql = @"
SELECT
    u.Id,
    u.Name,
    u.Email
FROM dbo.UserUnits uu
JOIN dbo.Users u ON u.Id = uu.UserId
WHERE uu.UnitId = @UnitId
  AND uu.IsActive = 1
  AND u.Role = 'USER'
";

                if (!string.IsNullOrWhiteSpace(search))
                {
                    sql += " AND u.Name LIKE @Search ";
                }

                sql += " ORDER BY u.Name;";

                await using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@UnitId", unitId);

                if (!string.IsNullOrWhiteSpace(search))
                {
                    cmd.Parameters.AddWithValue("@Search", "%" + search.Trim() + "%");
                }

                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    users.Add(new
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        Email = reader.IsDBNull(2) ? null : reader.GetString(2)
                    });
                }

                return Ok(users);
            }
            catch (SqlException ex)
            {
                return Problem($"Erro de SQL ao listar usuários da unidade: {ex.Message}");
            }
            catch (Exception ex)
            {
                return Problem($"Erro ao listar usuários da unidade: {ex.Message}");
            }
        }
    }
}
