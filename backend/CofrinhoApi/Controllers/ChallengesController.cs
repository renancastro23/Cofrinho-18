using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    // Mantive os nomes do request iguais aos que você já estava testando no Swagger:
    // targetWeightKg, startDate, endDate, etc.
    public record CreateChallengeRequest(
        int DirectorId,
        int UnitId,
        string Title,
        string? Description,
        decimal? TargetWeightKg,
        decimal? TargetMoney, // Ignorado por enquanto (sua tabela não tem TargetMoney)
        DateTime StartDate,
        DateTime EndDate
    );

    [ApiController]
    [Route("api/[controller]")]
    public class ChallengesController : ControllerBase
    {
        private readonly IConfiguration _config;
        public ChallengesController(IConfiguration config) => _config = config;

        // POST /api/Challenges
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateChallengeRequest req)
        {
            if (req.DirectorId <= 0 || req.UnitId <= 0)
                return BadRequest("DirectorId e UnitId devem ser > 0.");

            if (string.IsNullOrWhiteSpace(req.Title))
                return BadRequest("Title é obrigatório.");

            if (req.EndDate <= req.StartDate)
                return BadRequest("EndDate deve ser maior que StartDate.");

            // Sua tabela só tem TargetKg. Então por enquanto exigimos meta em KG.
            if (req.TargetWeightKg is null || req.TargetWeightKg <= 0)
                return BadRequest("Informe a meta em kg: TargetWeightKg > 0.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            // Segurança: verificar se a unidade pertence ao diretor
            const string sqlCheckUnitOwner = @"
SELECT COUNT(1)
FROM dbo.Units
WHERE Id = @UnitId AND DirectorId = @DirectorId;
";
            await using (var cmd = new SqlCommand(sqlCheckUnitOwner, conn))
            {
                cmd.Parameters.AddWithValue("@UnitId", req.UnitId);
                cmd.Parameters.AddWithValue("@DirectorId", req.DirectorId);

                var ok = (int)await cmd.ExecuteScalarAsync();
                if (ok == 0) return Forbid("Essa unidade não pertence a esse diretor.");
            }

            // Insert usando seus nomes reais: TargetKg, StartsAt, EndsAt
            const string sqlInsert = @"
INSERT INTO dbo.Challenges
(
    UnitId,
    CreatedByDirectorId,
    Title,
    Description,
    TargetKg,
    StartsAt,
    EndsAt,
    IsActive
)
VALUES
(
    @UnitId,
    @DirectorId,
    @Title,
    @Description,
    @TargetKg,
    @StartsAt,
    @EndsAt,
    1
);

SELECT SCOPE_IDENTITY();
";

            decimal newId;
            await using (var cmd = new SqlCommand(sqlInsert, conn))
            {
                cmd.Parameters.AddWithValue("@UnitId", req.UnitId);
                cmd.Parameters.AddWithValue("@DirectorId", req.DirectorId);
                cmd.Parameters.AddWithValue("@Title", req.Title.Trim());
                cmd.Parameters.AddWithValue("@Description", (object?)req.Description?.Trim() ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TargetKg", req.TargetWeightKg.Value);
                cmd.Parameters.AddWithValue("@StartsAt", req.StartDate);
                cmd.Parameters.AddWithValue("@EndsAt", req.EndDate);

                var result = await cmd.ExecuteScalarAsync();
                newId = Convert.ToDecimal(result);
            }

            return Ok(new
            {
                ChallengeId = newId,
                req.UnitId,
                req.DirectorId,
                Title = req.Title,
                Description = req.Description,
                TargetKg = req.TargetWeightKg,
                StartsAt = req.StartDate,
                EndsAt = req.EndDate,
                IsActive = true
            });
        }

        // GET /api/Challenges/{challengeId}/progress
        [HttpGet("{challengeId:int}/progress")]
        public async Task<IActionResult> GetProgress([FromRoute] int challengeId)
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            // Buscar o desafio (usando seus nomes reais)
            const string sqlGetChallenge = @"
SELECT
    Id,
    UnitId,
    Title,
    Description,
    TargetKg,
    StartsAt,
    EndsAt,
    IsActive
FROM dbo.Challenges
WHERE Id = @ChallengeId;
";

            int unitId;
            string title;
            string? description;
            decimal targetKg;
            DateTime startsAt;
            DateTime endsAt;
            bool isActive;

            await using (var cmd = new SqlCommand(sqlGetChallenge, conn))
            {
                cmd.Parameters.AddWithValue("@ChallengeId", challengeId);
                await using var r = await cmd.ExecuteReaderAsync();

                if (!await r.ReadAsync())
                    return NotFound("Desafio não encontrado.");

                unitId = r.GetInt32(1);
                title = r.GetString(2);
                description = r.IsDBNull(3) ? null : r.GetString(3);
                targetKg = r.GetDecimal(4);
                startsAt = r.GetDateTime(5);
                endsAt = r.GetDateTime(6);
                isActive = r.GetBoolean(7);
            }

            // Progresso por usuário (baseado em Trades.CreatedAt)
            // IMPORTANTE: este endpoint assume que Trades tem: UserId, WeightKg, AmountMoney, CreatedAt
            const string sqlProgress = @"
SELECT
    u.Id,
    u.Name,
    COALESCE(SUM(t.WeightKg), 0) AS TotalWeightKg,
    COALESCE(SUM(t.AmountMoney), 0) AS TotalMoney,
    COUNT(t.Id) AS TradesCount
FROM dbo.UserUnits uu
JOIN dbo.Users u ON u.Id = uu.UserId
LEFT JOIN dbo.Trades t
    ON t.UserId = u.Id
    AND t.CreatedAt >= @StartsAt
    AND t.CreatedAt <= @EndsAt
WHERE uu.UnitId = @UnitId
  AND uu.IsActive = 1
  AND u.Role = 'USER'
GROUP BY u.Id, u.Name
ORDER BY TotalWeightKg DESC, TotalMoney DESC;
";

            var ranking = new List<object>();
            decimal totalWeightAll = 0m;
            decimal totalMoneyAll = 0m;
            int totalTradesAll = 0;

            await using (var cmd = new SqlCommand(sqlProgress, conn))
            {
                cmd.Parameters.AddWithValue("@UnitId", unitId);
                cmd.Parameters.AddWithValue("@StartsAt", startsAt);
                cmd.Parameters.AddWithValue("@EndsAt", endsAt);

                await using var r = await cmd.ExecuteReaderAsync();
                while (await r.ReadAsync())
                {
                    var w = r.GetDecimal(2);
                    var m = r.GetDecimal(3);
                    var c = r.GetInt32(4);

                    totalWeightAll += w;
                    totalMoneyAll += m;
                    totalTradesAll += c;

                    ranking.Add(new
                    {
                        UserId = r.GetInt32(0),
                        Name = r.GetString(1),
                        TotalWeightKg = w,
                        TotalMoney = m,
                        TradesCount = c
                    });
                }
            }

            var completionWeightPct = targetKg > 0 ? Math.Min(100m, (totalWeightAll / targetKg) * 100m) : 0m;

            return Ok(new
            {
                Challenge = new
                {
                    Id = challengeId,
                    UnitId = unitId,
                    Title = title,
                    Description = description,
                    TargetKg = targetKg,
                    StartsAt = startsAt,
                    EndsAt = endsAt,
                    IsActive = isActive
                },
                Totals = new
                {
                    TotalWeightKg = totalWeightAll,
                    TotalMoney = totalMoneyAll,
                    TotalTrades = totalTradesAll,
                    CompletionWeightPct = completionWeightPct
                },
                Ranking = ranking
            });
        }
    }
}
