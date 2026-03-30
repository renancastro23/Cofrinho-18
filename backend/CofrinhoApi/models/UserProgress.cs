namespace CofrinhoApi.Models
{
    public class UserProgress
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int TotalXp { get; set; } = 0;

        public int Level { get; set; } = 1;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public Usuario? User { get; set; }
    }
}