using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace CofrinhoApi.Controllers
{
    public record CreateTradeRequest(
        int DirectorId,
        int UnitId,
        int UserId,
        string MaterialType,
        decimal WeightKg,
        decimal AmountMoney
    );

    [ApiController]
    [Route("api/[controller]")]
    public class TradesController : ControllerBase
    {
        private readonly IConfiguration _config;

        public TradesController(IConfiguration config)
        {
            _config = config;
        }

       [HttpPost]
public async Task<IActionResult> Create([FromBody] CreateTradeRequest req)
{
    if (req.DirectorId <= 0 || req.UnitId <= 0 || req.UserId <= 0)
        return BadRequest("DirectorId, UnitId e UserId devem ser > 0.");

    if (string.IsNullOrWhiteSpace(req.MaterialType))
        return BadRequest("MaterialType é obrigatório.");

    if (req.WeightKg <= 0)
        return BadRequest("WeightKg deve ser > 0.");

    if (req.AmountMoney < 0)
        return BadRequest("AmountMoney não pode ser negativo.");

    var cs = _config.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(cs))
        return Problem("Connection string 'DefaultConnection' não encontrada.");

    await using var conn = new SqlConnection(cs);
    await conn.OpenAsync();

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
        if (ok == 0)
            return Forbid("Essa unidade não pertence a esse diretor.");
    }

    const string sqlCheckUserInUnit = @"
SELECT COUNT(1)
FROM dbo.UserUnits
WHERE UnitId = @UnitId AND UserId = @UserId AND IsActive = 1;
";

    await using (var cmd = new SqlCommand(sqlCheckUserInUnit, conn))
    {
        cmd.Parameters.AddWithValue("@UnitId", req.UnitId);
        cmd.Parameters.AddWithValue("@UserId", req.UserId);

        var ok = (int)await cmd.ExecuteScalarAsync();
        if (ok == 0)
            return BadRequest("Esse usuário não está vinculado a essa unidade (ou está inativo).");
    }

    const string sqlInsertTrade = @"
INSERT INTO dbo.Trades
(
    UserId,
    MaterialType,
    WeightKg,
    AmountMoney,
    CreatedByDirectorId,
    CreatedAt
)
VALUES
(
    @UserId,
    @MaterialType,
    @WeightKg,
    @AmountMoney,
    @DirectorId,
    GETDATE()
);

SELECT SCOPE_IDENTITY();
";

    decimal newId;
    int gainedXp = (int)Math.Floor(req.AmountMoney / 0.20m);

    await using (var cmd = new SqlCommand(sqlInsertTrade, conn))
    {
        cmd.Parameters.AddWithValue("@UserId", req.UserId);
        cmd.Parameters.AddWithValue("@MaterialType", req.MaterialType.Trim());
        cmd.Parameters.AddWithValue("@WeightKg", req.WeightKg);
        cmd.Parameters.AddWithValue("@AmountMoney", req.AmountMoney);
        cmd.Parameters.AddWithValue("@DirectorId", req.DirectorId);

        var result = await cmd.ExecuteScalarAsync();
        newId = Convert.ToDecimal(result);
    }

    const string sqlUpdateProgress = @"
IF EXISTS (SELECT 1 FROM dbo.UserProgress WHERE UserId = @UserId)
BEGIN
    UPDATE dbo.UserProgress
    SET TotalXp = TotalXp + @Xp,
        UpdatedAt = GETDATE()
    WHERE UserId = @UserId;
END
ELSE
BEGIN
    INSERT INTO dbo.UserProgress (UserId, TotalXp, Level, UpdatedAt)
    VALUES (@UserId, @Xp, 1, GETDATE());
END
";

    await using (var cmdProgress = new SqlCommand(sqlUpdateProgress, conn))
    {
        cmdProgress.Parameters.AddWithValue("@UserId", req.UserId);
        cmdProgress.Parameters.AddWithValue("@Xp", gainedXp);

        await cmdProgress.ExecuteNonQueryAsync();
    }

    return Ok(new
    {
        TradeId = newId,
        req.DirectorId,
        req.UnitId,
        req.UserId,
        req.MaterialType,
        req.WeightKg,
        req.AmountMoney,
        GainedXp = gainedXp,
        CreatedAt = DateTime.Now
    });
}
}
}
