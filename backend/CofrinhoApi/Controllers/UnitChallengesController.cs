using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/units/{unitId:int}/challenges")]
    public class UnitChallengesController : ControllerBase
    {
        private readonly IConfiguration _config;
        public UnitChallengesController(IConfiguration config) => _config = config;

        // GET /api/units/{unitId}/challenges?activeOnly=true
        [HttpGet]
        public async Task<IActionResult> GetByUnit([FromRoute] int unitId, [FromQuery] bool activeOnly = true)
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            var list = new List<object>();

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            var sql = @"
SELECT
    Id,
    UnitId,
    CreatedByDirectorId,
    Title,
    Description,
    TargetKg,
    StartsAt,
    EndsAt,
    IsActive
FROM dbo.Challenges
WHERE UnitId = @UnitId
";

            // ativo = IsActive=1 e data atual dentro do período
            if (activeOnly)
            {
                sql += " AND IsActive = 1 AND GETDATE() BETWEEN StartsAt AND EndsAt ";
            }

            // Como você não tem CreatedAt, ordenamos por Id (mais novo primeiro)
            sql += " ORDER BY Id DESC;";

            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@UnitId", unitId);

            await using var r = await cmd.ExecuteReaderAsync();
            while (await r.ReadAsync())
            {
                list.Add(new
                {
                    Id = r.GetInt32(0),
                    UnitId = r.GetInt32(1),
                    CreatedByDirectorId = r.GetInt32(2),
                    Title = r.GetString(3),
                    Description = r.IsDBNull(4) ? null : r.GetString(4),
                    TargetKg = r.GetDecimal(5),
                    StartsAt = r.GetDateTime(6),
                    EndsAt = r.GetDateTime(7),
                    IsActive = r.GetBoolean(8)
                });
            }

            return Ok(list);
        }
    }
}
