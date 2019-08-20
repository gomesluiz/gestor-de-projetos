using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

using Ferrero.GestorDeProjetos.Web.Extensions;
using Ferrero.GestorDeProjetos.Web.Models.Gantt;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/task")]
    public class AtividadesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AtividadesController(ApplicationDbContext context)
        {
            _context    = context;
        }
 
        // GET api/Task
        [HttpGet]
        public IEnumerable<AtividadeViewModel> Get()
        {
            var projeto   = (Projeto) HttpContext.Session.GetObjectFromJson<Projeto>(Projeto.PROJETO_SESSION_ID);

            return _context.Atividades
                .ToList()
                .Where(t => t.ProjetoId == projeto.Id)
                .Select(t => (AtividadeViewModel)t);
        }
 
        // GET api/Task/5
        [HttpGet("{id}")]
        public AtividadeViewModel Get(int id)
        {
            return (AtividadeViewModel)_context
                .Atividades
                .Find(id);
        }
 
        // PUT api/Task/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, AtividadeViewModel atividadeViewModel)
        {

            var updatedAtividade = (Atividade)atividadeViewModel;

            var dbAtividade = _context.Atividades.Find(id);
            dbAtividade.Text = updatedAtividade.Text;
            dbAtividade.StartDate = updatedAtividade.StartDate;
            dbAtividade.Duration = updatedAtividade.Duration;
            dbAtividade.ParentId = updatedAtividade.ParentId;
            dbAtividade.Progress = updatedAtividade.Progress;
            dbAtividade.Type = updatedAtividade.Type;
 
            _context.SaveChanges();
 
            return Ok(new
            {
                action = "updated"
            });
        }
 
        // POST api/Task
        [HttpPost]
        public ObjectResult Post(AtividadeViewModel atividadeViewModel)
        {
            var atividade = (Atividade)atividadeViewModel;
            
            var projeto   = (Projeto) HttpContext
                .Session
                .GetObjectFromJson<Projeto>(Projeto.PROJETO_SESSION_ID);

            atividade.ProjetoId = projeto.Id;
            _context.Atividades.Add(atividade);
            _context.SaveChanges();
 
            return Ok(new
            {
                tid = atividade.Id,
                action = "inserted"
            });
        }
 
        // DELETE api/Task/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var atividade = _context.Atividades.Find(id);
            if (atividade != null)
            {
                _context.Atividades.Remove(atividade);
                _context.SaveChanges();
            }
 
            return Ok(new
            {
                action = "deleted"
            });
        }
    }
}