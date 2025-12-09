using System.Collections.Generic;
using System.Linq;
using CofrinhoApi.Models;

namespace CofrinhoApi.Stores
{
    public static class UsuariosStore
    {
        private static readonly List<Usuario> _usuarios = new();
        private static int _nextId = 1;

        // Seed inicial: Super Admin
        static UsuariosStore()
        {
            _usuarios.Add(new Usuario
            {
                Id = _nextId++,
                Nome = "Admin Master",
                Email = "admin@cofrinho.com",
                Senha = "admin123",   // APENAS PARA TESTES
                Role = "Admin"
            });
        }

        public static IEnumerable<Usuario> GetAll() => _usuarios;

        public static Usuario? GetByEmail(string email) =>
            _usuarios.FirstOrDefault(u => u.Email == email);

        public static Usuario? GetById(int id) =>
            _usuarios.FirstOrDefault(u => u.Id == id);

        public static Usuario Add(Usuario usuario)
        {
            usuario.Id = _nextId++;
            _usuarios.Add(usuario);
            return usuario;
        }
    }
}
