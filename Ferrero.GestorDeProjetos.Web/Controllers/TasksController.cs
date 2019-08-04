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
    [Route("api/task")]
    public class TasksController : Controller
    {
        private readonly ApplicationDbContext db;

        public TasksController(ApplicationDbContext context)
        {
            db    = context;
        }
 
        // GET api/Task
        [HttpGet]
        public IEnumerable<TaskViewModel> Get()
        {
            return db.Tasks
                .ToList()
                .Select(t => (TaskViewModel)t);
        }
 
        // GET api/Task/5
        [HttpGet("{id}")]
        public TaskViewModel Get(int id)
        {
            return (TaskViewModel)db
                .Tasks
                .Find(id);
        }
 
        // PUT api/Task/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, TaskViewModel taskViewModel)
        {
            var updatedTask = (Task)taskViewModel;

            var dbTask = db.Tasks.Find(id);
            dbTask.Text = updatedTask.Text;
            dbTask.StartDate = updatedTask.StartDate;
            dbTask.Duration = updatedTask.Duration;
            dbTask.ParentId = updatedTask.ParentId;
            dbTask.Progress = updatedTask.Progress;
            dbTask.Type = updatedTask.Type;
 
            db.SaveChanges();
 
            return Ok(new
            {
                action = "updated"
            });
        }
 
        // POST api/Task
        [HttpPost]
        public ObjectResult Post(TaskViewModel taskViewModel)
        {
            var newTask = (Task)taskViewModel;
 
            db.Tasks.Add(newTask);
            db.SaveChanges();
 
            return Ok(new
            {
                tid = newTask.Id,
                action = "inserted"
            });
        }
 
        // DELETE api/Task/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = db.Tasks.Find(id);
            if (task != null)
            {
                db.Tasks.Remove(task);
                db.SaveChanges();
            }
 
            return Ok(new
            {
                action = "deleted"
            });
        }
    }
}