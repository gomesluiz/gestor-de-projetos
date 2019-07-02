using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class ResumoFinanceiroController : Controller
    {
        private readonly ResumosFinanceiros _resumos;

        public ResumoFinanceiroController(ProjetosDBContext context)
        {
            _resumos = new ResumosFinanceiros(context);
        }

        // GET: Index
        public async Task<IActionResult> Index()
        {
            var resumos = await _resumos.GetAllResumosFinanceiros().ToListAsync();

            return View(model: resumos);
        }
    }
}
