// Models/InstitutionalRequest.cs
namespace CofrinhoApi.Models
{
    public class InstitutionalEmailRequest
    {
        public required string Instituicao { get; set; }
        public required string Representante { get; set; }
        public required string Tipo { get; set; }
        public required string Email { get; set; }
        public string? WhatsApp { get; set; }
        public required string Mensagem { get; set; }
    }
}