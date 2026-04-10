using CofrinhoApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstitucionalController : ControllerBase
    {
        [HttpPost]
        public IActionResult SendInstitutionalRequest([FromBody] InstitucionalRequest request)
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

        private string FormatMessage(InstitucionalRequest request)
        {
            return $"🏫 *CONTATO INSTITUCIONAL - COFRINHO DOS 18* 🏫\n\n" +
                   $"*Instituição:* {request.Instituicao}\n" +
                   $"*Representante:* {request.Representante}\n" +
                   $"*Tipo:* {request.Tipo}\n" +
                   $"*E-mail:* {request.Email}\n" +
                   $"*WhatsApp:* {request.WhatsApp ?? "Não informado"}\n\n" +
                   $"*Mensagem:*\n{request.Mensagem}\n\n" +
                   $"📅 _Enviado em: {DateTime.Now:dd/MM/yyyy HH:mm}_";
        }

        private string GenerateWhatsAppUrl(string message)
        {
            string phoneNumber = "5521974484430"; // Mesmo número do suporte
            string encodedMessage = Uri.EscapeDataString(message);
            return $"https://wa.me/{phoneNumber}?text={encodedMessage}";
        }
    }
}