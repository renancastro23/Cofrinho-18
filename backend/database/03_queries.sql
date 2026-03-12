USE Cofrinho18;
GO

SELECT * FROM Users;
SELECT * FROM Units;
SELECT * FROM Trades;

SELECT name
FROM sys.tables
ORDER BY name;

-- HISTÓRICO DE TROCAS POR USUÁRIO
SELECT
    t.Id AS TradeId,
    u.Name AS UserName,
    t.MaterialType,
    t.WeightKg,
    t.AmountMoney,
    t.CreatedAt,
    d.Name AS RegisteredByDirector
FROM Trades t
JOIN Users u ON u.Id = t.UserId
JOIN Users d ON d.Id = t.CreatedByDirectorId
ORDER BY t.CreatedAt DESC;

-- PROGRESSO DO USUÁRIO
SELECT
    u.Id AS UserId,
    u.Name AS UserName,
    SUM(t.WeightKg) AS TotalWeightKg,
    SUM(t.AmountMoney) AS TotalMoney
FROM Users u
LEFT JOIN Trades t ON t.UserId = u.Id
WHERE u.Role = 'USER'
GROUP BY u.Id, u.Name
ORDER BY TotalWeightKg DESC;

-- RANKING DE USUÁRIOS POR UNIDADE
SELECT
    un.Name AS UnitName,
    u.Id AS UserId,
    u.Name AS UserName,
    SUM(t.WeightKg) AS TotalWeightKg,
    SUM(t.AmountMoney) AS TotalMoney
FROM UserUnits uu
JOIN Units un ON un.Id = uu.UnitId
JOIN Users u ON u.Id = uu.UserId
LEFT JOIN Trades t ON t.UserId = u.Id
WHERE uu.IsActive = 1
GROUP BY un.Name, u.Id, u.Name
ORDER BY un.Name, TotalWeightKg DESC;

-- VISÃO GERAL DO DIRETOR POR UNIDADE
SELECT
    un.Id AS UnitId,
    un.Name AS UnitName,
    COUNT(DISTINCT uu.UserId) AS TotalUsers,
    COUNT(t.Id) AS TotalTrades,
    SUM(t.WeightKg) AS TotalWeightKg,
    SUM(t.AmountMoney) AS TotalMoney
FROM Units un
LEFT JOIN UserUnits uu ON uu.UnitId = un.Id AND uu.IsActive = 1
LEFT JOIN Trades t ON t.UserId = uu.UserId
GROUP BY un.Id, un.Name;

-- LISTA DE USUÁRIOS POR UNIDADE
SELECT
    un.Name AS UnitName,
    u.Id AS UserId,
    u.Name AS UserName,
    u.Email,
    u.IsActive
FROM UserUnits uu
JOIN Units un ON un.Id = uu.UnitId
JOIN Users u ON u.Id = uu.UserId
WHERE uu.IsActive = 1
ORDER BY un.Name, u.Name;

-- DESAFIOS ATIVOS POR UNIDADE
SELECT
    c.Id,
    c.Title,
    c.Description,
    c.TargetKg,
    c.StartsAt,
    c.EndsAt,
    un.Name AS UnitName
FROM Challenges c
LEFT JOIN Units un ON un.Id = c.UnitId
WHERE c.IsActive = 1
  AND GETDATE() BETWEEN c.StartsAt AND c.EndsAt
ORDER BY c.EndsAt;

