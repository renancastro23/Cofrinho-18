using CofrinhoApi.Models;
using MailKit.Net.Smtp;
using MimeKit;

namespace CofrinhoApi.Services
{
    public class InstitutionalEmailService
    {
        public async Task<bool> SendInstitutionalEmail(InstitutionalEmailRequest request)
        {
            try
            {
                Console.WriteLine($"🔧 Tentando com MailKit...");
                
                // Criar mensagem
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Cofrinho dos 18", "teste.cofrinho18@gmail.com"));
                message.To.Add(new MailboxAddress("Teste", "teste.cofrinho18@gmail.com"));
                message.Subject = $"Solicitação: {request.Instituicao}";
                
                message.Body = new TextPart("plain")
                {
                    Text = $@"SOLICITAÇÃO INSTITUCIONAL:

Instituição: {request.Instituicao}
Representante: {request.Representante}
Tipo: {request.Tipo}
Email: {request.Email}
WhatsApp: {request.WhatsApp}

Mensagem:
{request.Mensagem}

Enviado: {DateTime.Now:dd/MM/yyyy HH:mm}"
                };

                // Enviar com MailKit
                using var client = new MailKit.Net.Smtp.SmtpClient();
                
                Console.WriteLine($"📤 Conectando ao SMTP...");
                await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                
                Console.WriteLine($"🔐 Autenticando...");
                await client.AuthenticateAsync("teste.cofrinho18@gmail.com", "noigfdpxituirlqr");
                
                Console.WriteLine($"🚀 Enviando email...");
                await client.SendAsync(message);
                
                Console.WriteLine($"✅ Desconectando...");
                await client.DisconnectAsync(true);
                
                Console.WriteLine($"🎉 Email enviado com MailKit!");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERRO MailKit: {ex.GetType().Name}");
                Console.WriteLine($"   {ex.Message}");
                
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"   Inner: {ex.InnerException.Message}");
                }
                
                return false;
            }
        }
    }
}