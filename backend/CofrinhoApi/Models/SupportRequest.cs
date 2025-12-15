namespace CofrinhoApi.Models
{
    public class SupportRequest
    {
        public required string NomeResponsavel { get; set; }
        public required string CpfResponsavel { get; set; }
        public required string NomeCrianca { get; set; }
        public required string Matricula { get; set; }
        public required string Mensagem { get; set; }
    }
}