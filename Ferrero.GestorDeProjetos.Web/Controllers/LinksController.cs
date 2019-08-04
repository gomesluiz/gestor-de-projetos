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
    public class LinksController : Controller
    {
        private readonly ApplicationDbContext db;

        public LinksController(ApplicationDbContext context)
        {
            db    = context;
        }
 
        // GET api/Link
        [HttpGet]
        public IEnumerable<LinkViewModel> Get()
        {
            return db.Links
                .ToList()
                .Select(t => (LinkViewModel)t);
        }
 
        // GET api/Link/5
        [HttpGet("{id}")]
        public LinkViewModel Get(int id)
        {
            return (LinkViewModel)db
                .Links
                .Find(id);
        }
 
        // PUT api/Link/5
        [HttpPut("{id}")]
        public ObjectResult Put(int id, LinkViewModel linkViewModel)
        {
            var clientLink = (Link)linkViewModel;
            clientLink.Id = id;

            db.Entry(clientLink).State = EntityState.Modified;
            db.SaveChanges();
 
            return Ok(new
            {
                action = "updated"
            });
        }
 
        // POST api/Task
        [HttpPost]
        public IActionResult Post(LinkViewModel linkViewModel)
        {
            var newLink = (Link)linkViewModel;
 
            db.Links.Add(newLink);
            db.SaveChanges();
 
            return Ok(new
            {
                tid = newLink.Id,
                action = "inserted"
            });
        }
 
        // DELETE api/Task/5
        [HttpDelete("{id}")]
        public IActionResult DeleteLink(int id)
        {
            var link = db.Links.Find(id);
            if (link != null)
            {
                db.Links.Remove(link);
                db.SaveChanges();
            }
 
            return Ok(new
            {
                action = "deleted"
            });
        }
    }
}