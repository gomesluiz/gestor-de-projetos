using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/link")]
    public class VinculosController : Controller
    {
        private readonly ApplicationDbContext _context;

        public VinculosController(ApplicationDbContext context)
        {
            _context    = context;
        }
 
        // GET api/Link
        [HttpGet]
        public IEnumerable<VinculoViewModel> Get()
        {
            return _context.Vinculos
                .ToList()
                .Select(t => (VinculoViewModel)t);
        }
 
        // GET api/Link/5
        [HttpGet("{id}")]
        public VinculoViewModel Get(int id)
        {
            return (VinculoViewModel)_context
                .Vinculos
                .Find(id);
        }
 
        // PUT api/Link/5
        [HttpPut("{id}")]
        public ObjectResult Put(int id, VinculoViewModel vinculoViewModel)
        {
            var vinculo = (Vinculo)vinculoViewModel;
            vinculo.Id = id;

            _context.Entry(vinculo).State = EntityState.Modified;
            _context.SaveChanges();
 
            return Ok(new
            {
                action = "updated"
            });
        }
 
        // POST api/Task
        [HttpPost]
        public IActionResult Post(VinculoViewModel vinculoViewModel)
        {
            var vinculo = (Vinculo)vinculoViewModel;
 
            _context.Vinculos.Add(vinculo);
            _context.SaveChanges();
 
            return Ok(new
            {
                tid = vinculo.Id,
                action = "inserted"
            });
        }
 
        // DELETE api/Task/5
        [HttpDelete("{id}")]
        public IActionResult DeleteLink(int id)
        {
            var vinculo = _context.Vinculos.Find(id);
            if (vinculo != null)
            {
                _context.Vinculos.Remove(vinculo);
                _context.SaveChanges();
            }
 
            return Ok(new
            {
                action = "deleted"
            });
        }
    }
}