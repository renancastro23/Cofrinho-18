using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/users/{userId:int}/trades")]
    public class UserTradesController : ControllerBase
    {
        private readonly IConfiguration _config;

        public UserTradesController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetTrades([FromRoute] int userId)
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            var trades = new List<object>();

            try
            {
                await using var conn = new SqlConnection(cs);
                await conn.OpenAsync();

                // Ajuste nomes se sua tabela Trades tiver colunas diferentes
                const string sql = @"
SELECT
    t.Id,
    t.MaterialType,
    t.WeightKg,
    t.AmountMoney,
    t.CreatedAt,
    t.CreatedByDirectorId
FROM dbo.Trades t
WHERE t.UserId = @UserId
ORDER BY t.CreatedAt DESC;
";

                await using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@UserId", userId);

                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    trades.Add(new
                    {
                        TradeId = reader.GetInt32(0),
                        MaterialType = reader.GetString(1),
                        WeightKg = reader.GetDecimal(2),
                        AmountMoney = reader.GetDecimal(3),
                        CreatedAt = reader.GetDateTime(4),
                        CreatedByDirectorId = reader.GetInt32(5)
                    });
                }

                return Ok(trades);
            }
            catch (Exception ex)
            {
                return Problem($"Erro ao listar histórico do usuário: {ex.Message}");
            }
        }
    }
}
