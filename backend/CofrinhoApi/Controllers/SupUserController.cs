// Controllers/SupportController.cs
using CofrinhoApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupUserController : ControllerBase
    {
        [HttpPost]
        public IActionResult SendSupportRequest([FromBody] SupportRequest request)
        {
            // Formata a mensagem para WhatsApp
            string mensagemWhatsApp = FormatMessage(request);
            
            // Gera o link do WhatsApp
            string whatsappUrl = GenerateWhatsAppUrl(mensagemWhatsApp);
            
            return Ok(new { 
                success = true, 
                message = "Solicitação preparada para WhatsApp!",
                whatsappUrl = whatsappUrl
            });
        }

        private string FormatMessage(SupportRequest request)
        {
            return $"🆘 *SOLICITAÇÃO DE SUPORTE - COFRINHO DOS 18* 🆘\n\n" +
                   $"*Responsável:* {request.NomeResponsavel}\n" +
                   $"*CPF:* {request.CpfResponsavel}\n" +
                   $"*Criança:* {request.NomeCrianca}\n" +
                   $"*Matrícula:* {request.Matricula}\n\n" +
                   $"*Mensagem:*\n{request.Mensagem}\n\n" +
                   $"📅 _Enviado em: {DateTime.Now:dd/MM/yyyy HH:mm}_";
        }

        private string GenerateWhatsAppUrl(string message)
{
    
    string phoneNumber = "5521974484430"; 
    
    // Codifica a mensagem para URL
    string encodedMessage = Uri.EscapeDataString(message);
    
    return $"https://wa.me/{phoneNumber}?text={encodedMessage}";
}
    }
}