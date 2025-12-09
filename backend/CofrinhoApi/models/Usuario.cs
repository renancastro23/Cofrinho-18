namespace CofrinhoApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }                  // identificador
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // POR ENQUANTO: senha em texto simples, só pra aprender.
        // Depois trocamos por hash.
        public string Senha { get; set; } = string.Empty;

        // "Admin", "Diretor" ou "Usuario"
        public string Role { get; set; } = "Usuario";

        // Campos opcionais, úteis pro futuro
        public string? Instituicao { get; set; }
        public string? Turma { get; set; }
    }
}
