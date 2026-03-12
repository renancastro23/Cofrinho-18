using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/units/{unitId:int}/ranking")]
    public class RankingController : ControllerBase
    {
        private readonly IConfiguration _config;

        public RankingController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetRanking(
            [FromRoute] int unitId,
            [FromQuery] string? sort = "weight")
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string não encontrada.");

            var ranking = new List<object>();

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            string orderBy = sort?.ToLower() switch
            {
                "money" => "TotalMoney DESC",
                "name" => "u.Name ASC",
                _ => "TotalWeightKg DESC"
            };

            var sql = $@"
SELECT 
    u.Id,
    u.Name,
    SUM(t.WeightKg) AS TotalWeightKg,
    SUM(t.AmountMoney) AS TotalMoney
FROM dbo.Trades t
JOIN dbo.Users u ON u.Id = t.UserId
JOIN dbo.UserUnits uu ON uu.UserId = u.Id
WHERE uu.UnitId = @UnitId
GROUP BY u.Id, u.Name
ORDER BY {orderBy};
";

            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@UnitId", unitId);

            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                ranking.Add(new
                {
                    UserId = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    TotalWeightKg = reader.IsDBNull(2) ? 0 : reader.GetDecimal(2),
                    TotalMoney = reader.IsDBNull(3) ? 0 : reader.GetDecimal(3)
                });
            }

            return Ok(ranking);
        }
    }
}
