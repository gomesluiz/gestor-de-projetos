using System.Linq;
using Microsoft.AspNetCore.Mvc;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.Gantt;
using Ferrero.GestorDeProjetos.Web.Extensions;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models.Domain;

namespace Ferrero.GestorDeProjetos.Web.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/gantt")]
    public class GanttController : ControllerBase
    {
        private ApplicationDbContext _context;

        public GanttController(ApplicationDbContext context)
        {
            _context    = context;
        }
 
        // GET api/Task
        [HttpGet]
        public object Get()
        {
            var projeto   = (Projeto) HttpContext
                .Session
                .GetObjectFromJson<Projeto>(Projeto.PROJETO_SESSION_ID);
                
            return new
            {
                data = _context.Atividades
                    .ToList()
                    .Where(t => t.ProjetoId == projeto.Id)
                    .Select(t => (AtividadeViewModel)t),
                    
                links = _context.Vinculos
                    .ToList()
                    .Where(t => t.ProjetoId == projeto.Id)
                    .Select(t => (VinculoViewModel)t)
            };
        }
    }
}