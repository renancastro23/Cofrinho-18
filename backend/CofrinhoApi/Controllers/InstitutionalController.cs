using CofrinhoApi.Models;
using CofrinhoApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CofrinhoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstitutionalController : ControllerBase
    {
        private readonly InstitutionalEmailService _emailService;

        public InstitutionalController(InstitutionalEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendInstitutionalEmail([FromBody] InstitutionalEmailRequest request)
        {
            var success = await _emailService.SendInstitutionalEmail(request);
            
            if (success)
            {
                return Ok(new { 
                    success = true, 
                    message = "Email enviado com sucesso! Entraremos em contato em breve." 
                });
            }
            else
            {
                return BadRequest(new { 
                    success = false, 
                    message = "Erro ao enviar email. Tente novamente." 
                });
            }
        }
    }
}