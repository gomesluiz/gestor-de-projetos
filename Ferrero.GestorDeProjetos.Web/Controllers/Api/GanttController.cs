using Microsoft.AspNetCore.Mvc;
using Ferrero.GestorDeProjetos.Web.Models.Gantt;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using System.Linq;

namespace Ferrero.GestorDeProjetos.Web.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/gantt")]
    public class GanttController : ControllerBase
    {
        private ApplicationDbContext db;

        public GanttController(ApplicationDbContext context)
        {
            db    = context;
        }
 
        // GET api/Task
        [HttpGet]
        public object Get()
        {
            return new
            {
                data    = db.Atividades.ToList().Select(t => (AtividadeViewModel)t),
                links   = db.Vinculos.ToList().Select(t => (VinculoViewModel)t)
            };
        }
    }
}