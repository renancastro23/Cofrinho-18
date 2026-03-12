using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/users/{userId:int}/progress")]
    public class UserProgressController : ControllerBase
    {
        private readonly IConfiguration _config;

        public UserProgressController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetProgress([FromRoute] int userId)
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            try
            {
                await using var conn = new SqlConnection(cs);
                await conn.OpenAsync();

                // Soma total e contagem de trocas
                const string sql = @"
SELECT
    COUNT(1) AS TradesCount,
    COALESCE(SUM(t.WeightKg), 0) AS TotalWeightKg,
    COALESCE(SUM(t.AmountMoney), 0) AS TotalMoney
FROM dbo.Trades t
WHERE t.UserId = @UserId;
";

                int tradesCount;
                decimal totalWeight;
                decimal totalMoney;

                await using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);

                    await using var reader = await cmd.ExecuteReaderAsync();
                    if (!await reader.ReadAsync())
                        return Ok(new { UserId = userId, TradesCount = 0, TotalWeightKg = 0m, TotalMoney = 0m, Level = 1 });

                    tradesCount = reader.GetInt32(0);
                    totalWeight = reader.GetDecimal(1);
                    totalMoney = reader.GetDecimal(2);
                }

                // Nível simples (você pode ajustar depois)
                // Exemplo: a cada 10kg sobe 1 nível.
                var level = Math.Max(1, (int)Math.Floor((double)(totalWeight / 10m)) + 1);

                return Ok(new
                {
                    UserId = userId,
                    TradesCount = tradesCount,
                    TotalWeightKg = totalWeight,
                    TotalMoney = totalMoney,
                    Level = level
                });
            }
            catch (Exception ex)
            {
                return Problem($"Erro ao calcular progresso do usuário: {ex.Message}");
            }
        }
    }
}
