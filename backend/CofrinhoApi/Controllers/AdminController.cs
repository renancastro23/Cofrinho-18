using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;

namespace CofrinhoApi.Controllers
{
    public record CreateDirectorRequest(
        string Name,
        string Email,
        string Password,
        string? PhoneNumber
    );

    public record UpdateDirectorRequest(
        string Name,
        string Email,
        string? PhoneNumber
    );

    public record CreateUnitRequest(
        string Name,
        int DirectorId
    );

    public record ResetDirectorPasswordRequest(
    string NewPassword
    );

    public record UpdateUnitRequest(
        string Name,
        int DirectorId
    );

    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AdminController(IConfiguration config)
        {
            _config = config;
        }

        private sealed class PwdUser { }

        // =========================
        // HELPERS
        // =========================
        private static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

        private static bool IsValidPassword(string pwd)
        {
            if (string.IsNullOrWhiteSpace(pwd)) return false;
            if (pwd.Length < 8) return false;
            var hasLetter = Regex.IsMatch(pwd, @"[A-Za-z]");
            var hasNumber = Regex.IsMatch(pwd, @"\d");
            return hasLetter && hasNumber;
        }

        private static bool IsValidPhone(string? phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return true; // opcional
            var digits = Regex.Replace(phone, @"\D", "");
            return digits.Length >= 8;
        }

        // =========================
        // SUMMARY
        // =========================
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            const string sql = @"
SELECT
    (SELECT COUNT(*) FROM dbo.Users WHERE Role = 'DIRECTOR' AND IsActive = 1) AS TotalDirectors,
    (SELECT COUNT(*) FROM dbo.Units WHERE IsActive = 1) AS TotalUnits,
    (SELECT COUNT(*) FROM dbo.Users WHERE Role = 'USER' AND IsActive = 1) AS TotalUsers,
    (SELECT COUNT(*) FROM dbo.Trades) AS TotalTrades,
    (SELECT ISNULL(SUM(WeightKg), 0) FROM dbo.Trades) AS TotalKg,
    (SELECT ISNULL(SUM(AmountMoney), 0) FROM dbo.Trades) AS TotalMoney;
";

            await using var cmd = new SqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
                return Ok(new { directors = 0, units = 0, users = 0, trades = 0, kg = 0m, money = 0m });

            return Ok(new
            {
                directors = reader.GetInt32(0),
                units = reader.GetInt32(1),
                users = reader.GetInt32(2),
                trades = reader.GetInt32(3),
                kg = Convert.ToDecimal(reader[4]),
                money = Convert.ToDecimal(reader[5])
            });
        }

        // =========================
        // DIRECTORS - LIST
        // =========================
        [HttpGet("directors")]
        public async Task<IActionResult> GetDirectors()
        {
            var list = new List<object>();

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            const string sql = @"
SELECT
    u.Id,
    u.Name,
    u.Email,
    u.PhoneNumber,
    u.IsActive,
    u.CreatedAt,
    (SELECT COUNT(*) FROM dbo.Units un WHERE un.DirectorId = u.Id AND un.IsActive = 1) AS UnitsCount
FROM dbo.Users u
WHERE u.Role = 'DIRECTOR'
ORDER BY u.Name;
";

            await using var cmd = new SqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    PhoneNumber = reader.IsDBNull(3) ? "" : reader.GetString(3),
                    IsActive = reader.GetBoolean(4),
                    CreatedAt = reader.GetDateTime(5),
                    UnitsCount = reader.GetInt32(6)
                });
            }

            return Ok(list);
        }

        // =========================
        // DIRECTORS - CREATE
        // =========================
        [HttpPost("directors")]
        public async Task<IActionResult> CreateDirector([FromBody] CreateDirectorRequest req)
        {
            var name = (req.Name ?? "").Trim();
            var email = (req.Email ?? "").Trim().ToLower();
            var password = req.Password ?? "";
            var phone = (req.PhoneNumber ?? "").Trim();

            if (name.Length < 3) return BadRequest("Nome inválido.");
            if (!IsValidEmail(email)) return BadRequest("Email inválido.");
            if (!IsValidPassword(password)) return BadRequest("Senha fraca. Use no mínimo 8 caracteres, com letra e número.");
            if (!IsValidPhone(phone)) return BadRequest("Telefone inválido.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            var hasher = new PasswordHasher<PwdUser>();
            var passwordHash = hasher.HashPassword(new PwdUser(), password);

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            try
            {
                const string sql = @"
INSERT INTO dbo.Users (Name, Email, Role, PasswordHash, IsActive, CreatedAt, BirthDate, PhoneNumber)
VALUES (@Name, @Email, 'DIRECTOR', @PasswordHash, 1, GETDATE(), @BirthDate, @PhoneNumber);

SELECT CAST(SCOPE_IDENTITY() AS INT);
";

                await using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Name", name);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);
                cmd.Parameters.AddWithValue("@BirthDate", new DateTime(1990, 1, 1)); // placeholder até admin ter formulário completo
                cmd.Parameters.AddWithValue("@PhoneNumber", string.IsNullOrWhiteSpace(phone) ? "" : phone);

                var newId = (int)await cmd.ExecuteScalarAsync();

                return Ok(new
                {
                    Id = newId,
                    Name = name,
                    Email = email,
                    PhoneNumber = phone,
                    Role = "DIRECTOR"
                });
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                return Conflict("Já existe um usuário com esse e-mail.");
            }
        }

        // =========================
        // DIRECTORS - UPDATE
        // =========================
        [HttpPut("directors/{id:int}")]
        public async Task<IActionResult> UpdateDirector(int id, [FromBody] UpdateDirectorRequest req)
        {
            if (id <= 0) return BadRequest("Id inválido.");

            var name = (req.Name ?? "").Trim();
            var email = (req.Email ?? "").Trim().ToLower();
            var phone = (req.PhoneNumber ?? "").Trim();

            if (name.Length < 3) return BadRequest("Nome inválido.");
            if (!IsValidEmail(email)) return BadRequest("Email inválido.");
            if (!IsValidPhone(phone)) return BadRequest("Telefone inválido.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            try
            {
                const string sql = @"
UPDATE dbo.Users
SET Name = @Name,
    Email = @Email,
    PhoneNumber = @PhoneNumber
WHERE Id = @Id
  AND Role = 'DIRECTOR';
";

                await using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Name", name);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@PhoneNumber", string.IsNullOrWhiteSpace(phone) ? "" : phone);
                cmd.Parameters.AddWithValue("@Id", id);

                var rows = await cmd.ExecuteNonQueryAsync();
                if (rows == 0) return NotFound("Diretor não encontrado.");

                return Ok(new
                {
                    Id = id,
                    Name = name,
                    Email = email,
                    PhoneNumber = phone
                });
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                return Conflict("Já existe um usuário com esse e-mail.");
            }
        }

        // =========================
// DIRECTORS - RESET PASSWORD
// =========================
[HttpPost("directors/{id:int}/reset-password")]
public async Task<IActionResult> ResetDirectorPassword(int id, [FromBody] ResetDirectorPasswordRequest req)
{
    if (id <= 0) return BadRequest("Id inválido.");

    var newPassword = req.NewPassword ?? "";

    if (!IsValidPassword(newPassword))
        return BadRequest("Senha fraca. Use no mínimo 8 caracteres, com letra e número.");

    var cs = _config.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(cs))
        return Problem("Connection string 'DefaultConnection' não encontrada.");

    var hasher = new PasswordHasher<PwdUser>();
    var newHash = hasher.HashPassword(new PwdUser(), newPassword);

    await using var conn = new SqlConnection(cs);
    await conn.OpenAsync();

    const string sql = @"
UPDATE dbo.Users
SET PasswordHash = @PasswordHash
WHERE Id = @Id
  AND Role = 'DIRECTOR';
";

    await using var cmd = new SqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@PasswordHash", newHash);
    cmd.Parameters.AddWithValue("@Id", id);

    var rows = await cmd.ExecuteNonQueryAsync();
    if (rows == 0)
        return NotFound("Diretor não encontrado.");

    return Ok(new
    {
        Id = id,
        Message = "Senha redefinida com sucesso."
    });
}

        // =========================
        // DIRECTORS - DEACTIVATE
        // =========================
        [HttpPost("directors/{id:int}/deactivate")]
        public async Task<IActionResult> DeactivateDirector(int id)
        {
            if (id <= 0) return BadRequest("Id inválido.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            // regra: não desativar se tiver unidade ativa
            const string sqlCheck = @"
SELECT COUNT(*) FROM dbo.Units
WHERE DirectorId = @Id AND IsActive = 1;
";

            await using (var cmdCheck = new SqlCommand(sqlCheck, conn))
            {
                cmdCheck.Parameters.AddWithValue("@Id", id);
                var countUnits = (int)await cmdCheck.ExecuteScalarAsync();
                if (countUnits > 0)
                    return BadRequest("Não é possível desativar o diretor enquanto houver unidades ativas vinculadas.");
            }

            const string sql = @"
UPDATE dbo.Users
SET IsActive = 0
WHERE Id = @Id
  AND Role = 'DIRECTOR';
";

            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Id", id);

            var rows = await cmd.ExecuteNonQueryAsync();
            if (rows == 0) return NotFound("Diretor não encontrado.");

            return Ok(new { Id = id, Status = "DEACTIVATED" });
        }

        // =========================
        // UNITS - LIST
        // =========================
        [HttpGet("units")]
        public async Task<IActionResult> GetUnits()
        {
            var list = new List<object>();

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            const string sql = @"
SELECT
    u.Id,
    u.Name,
    u.DirectorId,
    d.Name AS DirectorName,
    u.IsActive,
    u.CreatedAt,
    (SELECT COUNT(*) FROM dbo.UserUnits uu WHERE uu.UnitId = u.Id AND uu.IsActive = 1) AS UsersCount
FROM dbo.Units u
LEFT JOIN dbo.Users d ON d.Id = u.DirectorId
ORDER BY u.Name;
";

            await using var cmd = new SqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    DirectorId = reader.GetInt32(2),
                    DirectorName = reader.IsDBNull(3) ? "" : reader.GetString(3),
                    IsActive = reader.GetBoolean(4),
                    CreatedAt = reader.GetDateTime(5),
                    UsersCount = reader.GetInt32(6)
                });
            }

            return Ok(list);
        }

        // =========================
        // UNITS - CREATE
        // =========================
        [HttpPost("units")]
        public async Task<IActionResult> CreateUnit([FromBody] CreateUnitRequest req)
        {
            var name = (req.Name ?? "").Trim();
            if (name.Length < 2) return BadRequest("Nome da unidade inválido.");
            if (req.DirectorId <= 0) return BadRequest("DirectorId inválido.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            // valida diretor existente e ativo
            const string sqlCheckDirector = @"
SELECT COUNT(*) FROM dbo.Users
WHERE Id = @DirectorId
  AND Role = 'DIRECTOR'
  AND IsActive = 1;
";

            await using (var cmdCheck = new SqlCommand(sqlCheckDirector, conn))
            {
                cmdCheck.Parameters.AddWithValue("@DirectorId", req.DirectorId);
                var ok = (int)await cmdCheck.ExecuteScalarAsync();
                if (ok == 0)
                    return BadRequest("Diretor inválido ou inativo.");
            }

            const string sql = @"
INSERT INTO dbo.Units (Name, DirectorId, IsActive, CreatedAt)
VALUES (@Name, @DirectorId, 1, GETDATE());

SELECT CAST(SCOPE_IDENTITY() AS INT);
";

            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Name", name);
            cmd.Parameters.AddWithValue("@DirectorId", req.DirectorId);

            var newId = (int)await cmd.ExecuteScalarAsync();

            return Ok(new
            {
                Id = newId,
                Name = name,
                DirectorId = req.DirectorId
            });
        }

        // =========================
        // UNITS - UPDATE
        // =========================
        [HttpPut("units/{id:int}")]
        public async Task<IActionResult> UpdateUnit(int id, [FromBody] UpdateUnitRequest req)
        {
            if (id <= 0) return BadRequest("Id inválido.");

            var name = (req.Name ?? "").Trim();
            if (name.Length < 2) return BadRequest("Nome da unidade inválido.");
            if (req.DirectorId <= 0) return BadRequest("DirectorId inválido.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            // valida diretor
            const string sqlCheckDirector = @"
SELECT COUNT(*) FROM dbo.Users
WHERE Id = @DirectorId
  AND Role = 'DIRECTOR'
  AND IsActive = 1;
";

            await using (var cmdCheck = new SqlCommand(sqlCheckDirector, conn))
            {
                cmdCheck.Parameters.AddWithValue("@DirectorId", req.DirectorId);
                var ok = (int)await cmdCheck.ExecuteScalarAsync();
                if (ok == 0)
                    return BadRequest("Diretor inválido ou inativo.");
            }

            const string sql = @"
UPDATE dbo.Units
SET Name = @Name,
    DirectorId = @DirectorId
WHERE Id = @Id;
";

            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Name", name);
            cmd.Parameters.AddWithValue("@DirectorId", req.DirectorId);
            cmd.Parameters.AddWithValue("@Id", id);

            var rows = await cmd.ExecuteNonQueryAsync();
            if (rows == 0) return NotFound("Unidade não encontrada.");

            return Ok(new
            {
                Id = id,
                Name = name,
                DirectorId = req.DirectorId
            });
        }

        // =========================
        // UNITS - DEACTIVATE
        // =========================
        [HttpPost("units/{id:int}/deactivate")]
        public async Task<IActionResult> DeactivateUnit(int id)
        {
            if (id <= 0) return BadRequest("Id inválido.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            // regra: não desativar unidade com usuários ativos vinculados
            const string sqlCheck = @"
SELECT COUNT(*) 
FROM dbo.UserUnits
WHERE UnitId = @Id
  AND IsActive = 1;
";

            await using (var cmdCheck = new SqlCommand(sqlCheck, conn))
            {
                cmdCheck.Parameters.AddWithValue("@Id", id);
                var countUsers = (int)await cmdCheck.ExecuteScalarAsync();
                if (countUsers > 0)
                    return BadRequest("Não é possível desativar a unidade enquanto houver usuários ativos vinculados.");
            }

            const string sql = @"
UPDATE dbo.Units
SET IsActive = 0
WHERE Id = @Id;
";

            await using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Id", id);

            var rows = await cmd.ExecuteNonQueryAsync();
            if (rows == 0) return NotFound("Unidade não encontrada.");

            return Ok(new { Id = id, Status = "DEACTIVATED" });
        }

        // =========================
        // USERS - GLOBAL LIST
        // =========================
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var list = new List<object>();

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            const string sql = @"
SELECT
    u.Id,
    u.Name,
    u.Email,
    u.PhoneNumber,
    u.IsActive,
    un.Id AS UnitId,
    un.Name AS UnitName,
    d.Id AS DirectorId,
    d.Name AS DirectorName,
    ISNULL((SELECT SUM(t.WeightKg) FROM dbo.Trades t WHERE t.UserId = u.Id), 0) AS TotalKg,
    ISNULL((SELECT SUM(t.AmountMoney) FROM dbo.Trades t WHERE t.UserId = u.Id), 0) AS TotalMoney,
    ISNULL((SELECT COUNT(*) FROM dbo.Trades t WHERE t.UserId = u.Id), 0) AS TradesCount
FROM dbo.Users u
LEFT JOIN dbo.UserUnits uu ON uu.UserId = u.Id AND uu.IsActive = 1
LEFT JOIN dbo.Units un ON un.Id = uu.UnitId
LEFT JOIN dbo.Users d ON d.Id = un.DirectorId
WHERE u.Role = 'USER'
ORDER BY u.Name;
";

            await using var cmd = new SqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    PhoneNumber = reader.IsDBNull(3) ? "" : reader.GetString(3),
                    IsActive = reader.GetBoolean(4),
                    UnitId = reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
                    UnitName = reader.IsDBNull(6) ? "" : reader.GetString(6),
                    DirectorId = reader.IsDBNull(7) ? 0 : reader.GetInt32(7),
                    DirectorName = reader.IsDBNull(8) ? "" : reader.GetString(8),
                    TotalKg = Convert.ToDecimal(reader[9]),
                    TotalMoney = Convert.ToDecimal(reader[10]),
                    TradesCount = Convert.ToInt32(reader[11])
                });
            }

            return Ok(list);
        }

        // =========================
        // USERS - DEACTIVATE
        // =========================
        [HttpPost("users/{id:int}/deactivate")]
        public async Task<IActionResult> DeactivateUser(int id)
        {
            if (id <= 0) return BadRequest("Id inválido.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            await using var tx = await conn.BeginTransactionAsync();
            try
            {
                const string sqlUser = @"
UPDATE dbo.Users
SET IsActive = 0
WHERE Id = @Id
  AND Role = 'USER';
";

                await using (var cmd = new SqlCommand(sqlUser, conn, (SqlTransaction)tx))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    var rows = await cmd.ExecuteNonQueryAsync();
                    if (rows == 0)
                    {
                        await tx.RollbackAsync();
                        return NotFound("Usuário não encontrado.");
                    }
                }

                const string sqlLinks = @"
UPDATE dbo.UserUnits
SET IsActive = 0
WHERE UserId = @Id;
";

                await using (var cmd = new SqlCommand(sqlLinks, conn, (SqlTransaction)tx))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    await cmd.ExecuteNonQueryAsync();
                }

                await tx.CommitAsync();
                return Ok(new { Id = id, Status = "DEACTIVATED" });
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }
    }
}