using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgressController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ProgressController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserXp(int userId)
        {
            var cs = _config.GetConnectionString("DefaultConnection");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            const string sql = @"
SELECT TotalXp
FROM dbo.UserProgress
WHERE UserId = @UserId
";

            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@UserId", userId);

            var result = await cmd.ExecuteScalarAsync();

            return Ok(new
            {
                userId,
                totalXp = result == null ? 0 : Convert.ToInt32(result)
            });
        }
    }
}