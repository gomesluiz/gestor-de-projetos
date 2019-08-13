using System;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Models.Kanban;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class KanbanController : Controller
    {
        private readonly UnitOfWork _db;
        public KanbanController(ApplicationDbContext context)
        {
            _db = new UnitOfWork(context);
        }

        // GET: QuadroViewModel
        public async Task<IActionResult> Show(int projetoId)
        {
            try
            {   
                var tarefas = await _db
                    .Tarefas
                    .FindAsync(
                          e => e.ProjetoId == projetoId
                        , includeProperties: "Projeto"
                    );
                
                return View(new QuadroViewModel
                    (   projetoId
                        , tarefas.ToList().Select(t => (TarefaViewModel)t)
                    )
                );
            }

            catch (DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível exibir as tarefas. " 
                    + "Motivo: " + e.Message + ". "  
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // GET: Kanban/Create
        public IActionResult Create(int projetoId)
        {
            ViewBag.ProjetoId = projetoId;    
            return View();
        }

        // POST: Tarefa/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(TarefaViewModel tarefaViewModel)
        {
            if (ModelState.IsValid)
            {
                try 
                {
                    var tarefa = (Tarefa) tarefaViewModel;
                    _db.Tarefas.Add(tarefa);
                    await _db.SaveAsync();

                    return RedirectToAction(nameof(Show), new { projetoId = tarefa.ProjetoId });
                }
                catch(DbException e)
                {
                    ModelState.AddModelError(""
                        , "Não é possível incluir esta nota fiscal. " 
                        + "Motivo: " + e.Message + ". "
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema.");  
                }
            }

            ViewBag["ProjetotId"] = tarefaViewModel.ProjetoId;
            return View(tarefaViewModel);
        }

        // GET: Kanban/Edit/{id}
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var tarefa = await FindTarefaBy(id);
                if (tarefa == null) return NotFound();
            
                var tarefaViewModel = (TarefaViewModel) tarefa;

                return View(tarefaViewModel);
            }
            catch(DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível editar esta nota fiscal. " 
                    + "Motivo: " + e.Message + ". "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            
            return View();
        }

        // POST: Kanban/Edit/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, TarefaViewModel tarefaViewModel)
        {
            if (id != tarefaViewModel.Id) return NotFound();
         
            if (ModelState.IsValid)
            {
                try
                {
                    var tarefa = (Tarefa) tarefaViewModel;
                   
                    _db.Tarefas.Update(tarefa);
                    await _db.SaveAsync();

                    return RedirectToAction(nameof(Show), new { projetoId = tarefa.ProjetoId });
                }
                catch (DbUpdateException e)
                {
                    ModelState.AddModelError(""
                    , "Não é possível editar esta nota fiscal. " 
                    + "Motivo: " + e.Message + ". "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
                }
            }

            return View(tarefaViewModel);
        }

        // GET: Kanban/Delete/5
        public async Task<IActionResult> Delete(int? id, String errorMessage="")
        {
            if (id == null) return NotFound();

            if (errorMessage != "")
            {
                ModelState.AddModelError(""
                    , "Não é possível remover esta nota fiscal. " 
                    + "Motivo: " + errorMessage + ". "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }

            try
            {  
                var tarefa = await FindTarefaBy(id);
                if (tarefa == null) return NotFound();

                var tarefaViewModel = (TarefaViewModel) tarefa;
                return View(tarefaViewModel);
            }
            catch(DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível excluir esta nota fiscal. " 
                    + "Motivo: " + e.Message + ". "
                    + "Tente novamente, e se o problema persistir "  
                    + "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: Tarefa/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            Tarefa tarefa;
            try
            {
                tarefa = await FindTarefaBy(id);
                _db.Tarefas.Remove(tarefa);
                await _db.SaveAsync();
            }
            catch(DbUpdateException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, errorMessage = e.Message });  
            }
            return RedirectToAction(nameof(Show), new { projetoId = tarefa.ProjetoId });
        }

        private async Task<Tarefa> FindTarefaBy(int? id)
        {
            var tarefas = await _db.Tarefas
                .FindAsync(e => e.Id == id, includeProperties: "Projeto");

            return tarefas.FirstOrDefault();
        }
    }
}
