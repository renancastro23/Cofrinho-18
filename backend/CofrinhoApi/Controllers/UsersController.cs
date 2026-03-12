using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;

namespace CofrinhoApi.Controllers
{
    public record CreateUserByDirectorRequest(
        int DirectorId,
        int UnitId,
        string Name,
        string Email,
        string Password,
        DateTime BirthDate,
        string PhoneNumber
    );

    public record UpdateUserByDirectorRequest(
    int DirectorId,
    string Name,
    string Email,
    DateTime BirthDate,
    string PhoneNumber
);

public record UpdateDirectorAccountRequest(
    string Name,
    string Email,
    string PhoneNumber
);

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
);

public record DirectorOnlyRequest(int DirectorId);

    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _config;
        public UsersController(IConfiguration config) => _config = config;

        // classe “dummy” só para o PasswordHasher funcionar
        private sealed class PwdUser { }

[HttpGet("{id:int}")]
public async Task<IActionResult> GetById(int id)
{
    if (id <= 0) return BadRequest("Id inválido.");

    var cs = _config.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(cs))
        return Problem("Connection string 'DefaultConnection' não encontrada.");

    await using var conn = new SqlConnection(cs);
    await conn.OpenAsync();

    const string sql = @"
SELECT Id, Name, Email, Role, IsActive, CreatedAt, BirthDate, PhoneNumber
FROM dbo.Users
WHERE Id = @Id;
";

    await using var cmd = new SqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", id);

    await using var reader = await cmd.ExecuteReaderAsync();
    if (!await reader.ReadAsync())
        return NotFound("Usuário não encontrado.");

    return Ok(new
    {
        Id = reader.GetInt32(reader.GetOrdinal("Id")),
        Name = reader.GetString(reader.GetOrdinal("Name")),
        Email = reader.GetString(reader.GetOrdinal("Email")),
        Role = reader.GetString(reader.GetOrdinal("Role")),
        IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
        BirthDate = reader.GetDateTime(reader.GetOrdinal("BirthDate")),
        PhoneNumber = reader.GetString(reader.GetOrdinal("PhoneNumber"))
    });
}

[HttpPost("{id:int}/change-password")]
public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest req)
{
    if (id <= 0) return BadRequest("Id inválido.");

    var currentPassword = req.CurrentPassword ?? "";
    var newPassword = req.NewPassword ?? "";

    if (string.IsNullOrWhiteSpace(currentPassword))
        return BadRequest("Senha atual obrigatória.");

    if (!IsValidPassword(newPassword))
        return BadRequest("Nova senha fraca. Use no mínimo 8 caracteres, com letra e número.");

    var cs = _config.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(cs))
        return Problem("Connection string 'DefaultConnection' não encontrada.");

    await using var conn = new SqlConnection(cs);
    await conn.OpenAsync();

    const string sqlGetUser = @"
SELECT Id, PasswordHash, Role
FROM dbo.Users
WHERE Id = @Id;
";

    await using var cmdGet = new SqlCommand(sqlGetUser, conn);
    cmdGet.Parameters.AddWithValue("@Id", id);

    string? currentHash = null;
    string? role = null;

    await using (var reader = await cmdGet.ExecuteReaderAsync())
    {
        if (!await reader.ReadAsync())
            return NotFound("Usuário não encontrado.");

        currentHash = reader["PasswordHash"]?.ToString();
        role = reader["Role"]?.ToString();
    }

    if (role != "DIRECTOR")
        return BadRequest("Somente diretores podem alterar senha nesta rota.");

    if (string.IsNullOrWhiteSpace(currentHash))
        return BadRequest("Senha atual não encontrada.");

    var hasher = new PasswordHasher<PwdUser>();
    var verify = hasher.VerifyHashedPassword(new PwdUser(), currentHash, currentPassword);

    if (verify == PasswordVerificationResult.Failed)
        return BadRequest("Senha atual incorreta.");

    var newHash = hasher.HashPassword(new PwdUser(), newPassword);

    const string sqlUpdate = @"
UPDATE dbo.Users
SET PasswordHash = @PasswordHash
WHERE Id = @Id;
";

    await using var cmdUpdate = new SqlCommand(sqlUpdate, conn);
    cmdUpdate.Parameters.AddWithValue("@PasswordHash", newHash);
    cmdUpdate.Parameters.AddWithValue("@Id", id);

    await cmdUpdate.ExecuteNonQueryAsync();

    return Ok(new { Message = "Senha alterada com sucesso." });
}

[HttpPut("{id:int}/account")]
public async Task<IActionResult> UpdateDirectorAccount(int id, [FromBody] UpdateDirectorAccountRequest req)
{
    if (id <= 0) return BadRequest("Id inválido.");

    var name = (req.Name ?? "").Trim();
    var email = (req.Email ?? "").Trim();
    var phone = (req.PhoneNumber ?? "").Trim();

    if (name.Length < 3) return BadRequest("Nome deve ter no mínimo 3 caracteres.");
    if (!IsValidEmail(email)) return BadRequest("Email inválido.");
    if (!IsValidPhone(phone)) return BadRequest("Celular inválido.");

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
        cmd.Parameters.AddWithValue("@PhoneNumber", phone);
        cmd.Parameters.AddWithValue("@Id", id);

        var rows = await cmd.ExecuteNonQueryAsync();
        if (rows == 0)
            return NotFound("Diretor não encontrado.");

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

        [HttpPut("{id:int}")]
public async Task<IActionResult> Update(int id, [FromBody] UpdateUserByDirectorRequest req)
{
    if (id <= 0) return BadRequest("Id inválido.");
    if (req.DirectorId <= 0) return BadRequest("DirectorId inválido.");

    var name = (req.Name ?? "").Trim();
    var email = (req.Email ?? "").Trim();
    var phone = (req.PhoneNumber ?? "").Trim();

    if (name.Length < 3) return BadRequest("Name deve ter no mínimo 3 caracteres.");
    if (!IsValidEmail(email)) return BadRequest("Email inválido.");
    if (req.BirthDate.Date > DateTime.Today) return BadRequest("Data de nascimento inválida.");
    if (!IsValidPhone(phone)) return BadRequest("Celular inválido.");

    var cs = _config.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(cs))
        return Problem("Connection string 'DefaultConnection' não encontrada.");

    await using var conn = new SqlConnection(cs);
    await conn.OpenAsync();

    const string sqlCheckOwnership = @"
SELECT COUNT(1)
FROM dbo.UserUnits uu
JOIN dbo.Units u ON u.Id = uu.UnitId
WHERE uu.UserId = @UserId
  AND uu.IsActive = 1
  AND u.DirectorId = @DirectorId;
";
    await using (var cmd = new SqlCommand(sqlCheckOwnership, conn))
    {
        cmd.Parameters.AddWithValue("@UserId", id);
        cmd.Parameters.AddWithValue("@DirectorId", req.DirectorId);
        var ok = (int)await cmd.ExecuteScalarAsync();
        if (ok == 0)
            return StatusCode(403, "Você não tem permissão para editar este usuário.");
    }

    try
    {
        const string sqlUpdate = @"
UPDATE dbo.Users
SET Name = @Name,
    Email = @Email,
    BirthDate = @BirthDate,
    PhoneNumber = @PhoneNumber
WHERE Id = @UserId
  AND Role = 'USER';
";
        await using var cmd = new SqlCommand(sqlUpdate, conn);
        cmd.Parameters.AddWithValue("@Name", name);
        cmd.Parameters.AddWithValue("@Email", email);
        cmd.Parameters.AddWithValue("@BirthDate", req.BirthDate.Date);
        cmd.Parameters.AddWithValue("@PhoneNumber", phone);
        cmd.Parameters.AddWithValue("@UserId", id);

        var rows = await cmd.ExecuteNonQueryAsync();
        if (rows == 0)
            return NotFound("Usuário não encontrado (ou não é USER).");

        return Ok(new
        {
            Id = id,
            Name = name,
            Email = email,
            BirthDate = req.BirthDate.Date,
            PhoneNumber = phone
        });
    }
    catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
    {
        return Conflict("Já existe um usuário com esse e-mail.");
    }
}


        // POST /api/Users
        // Diretor cria usuário e já vincula o usuário à unidade (turma) dele
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserByDirectorRequest req)
        {
            if (req.DirectorId <= 0) return BadRequest("DirectorId inválido.");
            if (req.UnitId <= 0) return BadRequest("UnitId inválido.");

            var name = (req.Name ?? "").Trim();
            var email = (req.Email ?? "").Trim();
            var phone = (req.PhoneNumber ?? "").Trim();
            var password = req.Password ?? "";

            if (name.Length < 3) return BadRequest("Name deve ter no mínimo 3 caracteres.");
            if (!IsValidEmail(email)) return BadRequest("Email inválido.");

            // validações básicas (pode ajustar)
            if (!IsValidPhone(phone)) return BadRequest("Celular inválido.");
            if (!IsValidPassword(password)) return BadRequest("Senha fraca. Use no mínimo 8 caracteres, com letra e número.");
            if (req.BirthDate.Date > DateTime.Today) return BadRequest("Data de nascimento inválida.");

            var cs = _config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Connection string 'DefaultConnection' não encontrada.");

            // gerar hash da senha (NUNCA salvar senha pura)
            var hasher = new PasswordHasher<PwdUser>();
            var passwordHash = hasher.HashPassword(new PwdUser(), password);

            await using var conn = new SqlConnection(cs);
            await conn.OpenAsync();

            // 1) Segurança: garantir que a unidade pertence ao diretor
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

            // 2) Criar usuário + vincular à unidade numa transação
            await using var tx = await conn.BeginTransactionAsync();

            try
            {
                int newUserId;

                // Insere com campos completos:
                // Role sempre USER (diretor não escolhe)
                // IsActive = 1
                // CreatedAt = GETDATE()
                const string sqlInsertUser = @"
INSERT INTO dbo.Users (Name, Email, Role, PasswordHash, BirthDate, PhoneNumber, IsActive, CreatedAt)
VALUES (@Name, @Email, 'USER', @PasswordHash, @BirthDate, @PhoneNumber, 1, GETDATE());

SELECT CAST(SCOPE_IDENTITY() AS INT);
";
                await using (var cmd = new SqlCommand(sqlInsertUser, conn, (SqlTransaction)tx))
                {
                    cmd.Parameters.AddWithValue("@Name", name);
                    cmd.Parameters.AddWithValue("@Email", email);
                    cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);
                    cmd.Parameters.AddWithValue("@BirthDate", req.BirthDate.Date);
                    cmd.Parameters.AddWithValue("@PhoneNumber", phone);

                    newUserId = (int)await cmd.ExecuteScalarAsync();
                }

                // Vincular na UserUnits
                const string sqlLinkUserUnit = @"
INSERT INTO dbo.UserUnits (UserId, UnitId, IsActive)
VALUES (@UserId, @UnitId, 1);
";
                await using (var cmd = new SqlCommand(sqlLinkUserUnit, conn, (SqlTransaction)tx))
                {
                    cmd.Parameters.AddWithValue("@UserId", newUserId);
                    cmd.Parameters.AddWithValue("@UnitId", req.UnitId);
                    await cmd.ExecuteNonQueryAsync();
                }

                await tx.CommitAsync();

                // Retorno (NUNCA retornar PasswordHash)
                return Ok(new
                {
                    Id = newUserId,
                    Name = name,
                    Email = email,
                    Role = "USER",
                    UnitId = req.UnitId,
                    BirthDate = req.BirthDate.Date,
                    PhoneNumber = phone
                });
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                await tx.RollbackAsync();
                // Violação de chave única (provavelmente email duplicado)
                return Conflict("Já existe um usuário com esse e-mail.");
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

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

        private static bool IsValidPhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return false;
            // deixa livre, mas exige pelo menos 8 dígitos
            var digits = Regex.Replace(phone, @"\D", "");
            return digits.Length >= 8;
        }
    }
    
}