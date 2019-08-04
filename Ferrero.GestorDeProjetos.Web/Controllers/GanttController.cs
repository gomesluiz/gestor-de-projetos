using Microsoft.AspNetCore.Mvc;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using System.Linq;

namespace Ferrero.GestorDeProjetos.Web.Controllers
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
                data    = db.Tasks.ToList().Select(t => (TaskViewModel)t),
                links   = db.Links.ToList().Select(t => (LinkViewModel)t)
            };
        }
    }
}