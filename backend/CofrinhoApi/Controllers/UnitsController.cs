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
public async Task<IActionResult> Get()
{
    var cs = _config.GetConnectionString("DefaultConnection");

    await using var conn = new SqlConnection(cs);
    await conn.OpenAsync();

    const string sql = @"
SELECT Id, Name, DirectorId
FROM dbo.Units
WHERE IsActive = 1;
";

    var list = new List<object>();

    await using var cmd = new SqlCommand(sql, conn);
    await using var reader = await cmd.ExecuteReaderAsync();

    while (await reader.ReadAsync())
    {
        list.Add(new
        {
            Id = reader.GetInt32(0),
            Name = reader.GetString(1),
            DirectorId = reader.GetInt32(2)
        });
    }

    return Ok(list);
}
    }
}
