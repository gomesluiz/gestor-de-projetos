using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Data;
using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class ProjetosController : Controller
    {
        private readonly ProjetosDBContext _context;

        public ProjetosController(ProjetosDBContext context)
        {
            _context = context;
        }

        // GET: Projetos
        public async Task<IActionResult> Index()
        {
            return View(await _context.Projetos.ToListAsync());
        }

        // GET: Projetos/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Projetos/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
          [Bind("ID,Nome,Descricao,DataDeInicio,DataDeTermino,Concluido")] ProjetoViewModel projetoViewModel
        )
        {
          if (ModelState.IsValid)
          {
            try
            {   
              Projeto projeto = ConvertToModel(projetoViewModel);
              _context.Add(projeto);
              await _context.SaveChangesAsync();
              return RedirectToAction(nameof(Index));
            }
            catch(DbUpdateException)
            {
              ModelState.AddModelError("", "Não é possível incluir este projeto. " + 
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.");
            }
          }
          return View(projetoViewModel);
        }

        // GET: Projetos/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
          if (id == null)
          {
              return NotFound();
          }

          try
          {
            var projeto = await _context.Projetos.FindAsync(id);
            if (projeto == null)
            {
                return NotFound();
            }

            ProjetoViewModel projetoViewModel = ConvertToViewModel(projeto);
            return View(projetoViewModel);
          }
          catch(DbException)
          {
            ModelState.AddModelError("", "Não é possível editar este projeto. " + 
                  "Tente novamente, e se o problema persistir " + 
                  "entre em contato com o administrador do sistema.");
          }
          return View();
        }

        // POST: Projetos/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, 
          [Bind("Id, Nome, Descricao, DataDeInicio, DataDeTermino, Concluido")] ProjetoViewModel projetoViewModel)
        {
            if (id != projetoViewModel.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    Projeto projeto = ConvertToModel(projetoViewModel);
                    _context.Update(projeto);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProjetoExists(projetoViewModel.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        ModelState.AddModelError("", "Não é possível editar este projeto. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(projetoViewModel);
        }

        // GET: Projetos/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
            if (id == null)
            {
                return NotFound();
            }
            if (saveChangesError.GetValueOrDefault())
            {
              ModelState.AddModelError("", "Não é possível remover este projeto. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            try
            { 
              var projeto = await _context.Projetos
                  .FirstOrDefaultAsync(m => m.Id == id);
              if (projeto == null)
              {
                  return NotFound();
              }
              ProjetoViewModel projetoViewModel = ConvertToViewModel(projeto);
              return View(projetoViewModel);
            }
            catch(DbException)
            {
              ModelState.AddModelError("", "Não é possível remover este projeto. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: Projetos/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
          try
          {
            var projeto = await _context.Projetos.FindAsync(id);
            _context.Projetos.Remove(projeto);
            await _context.SaveChangesAsync();
          }
          catch(DbUpdateException)
          {
            return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
          }
          return RedirectToAction(nameof(Index));
        }

        private bool ProjetoExists(int id)
        {
            return _context.Projetos.Any(e => e.Id == id);
        }

        ///<summary>
        /// Convert an object from ProjectViewModel class to an object from Project 
        /// class.
        ///</summary>
        private  Projeto ConvertToModel(ProjetoViewModel projetoViewModel)
        {
          return new Projeto {
              Id = projetoViewModel.Id,
              Nome = projetoViewModel.Nome,
              Descricao = projetoViewModel.Descricao,
              DataDeInicio = DateTime.ParseExact(projetoViewModel.DataDeInicio, "dd/MM/yyyy", null),
              DataDeTermino = DateTime.ParseExact(projetoViewModel.DataDeTermino, "dd/MM/yyyy", null),
              Concluido = projetoViewModel.Concluido
            };
        }

        ///<summary>
        /// Convert an object from Project class to an object from ProjectViewModel 
        /// class.
        ///</summary>
        private  ProjetoViewModel ConvertToViewModel(Projeto projeto)
        {
          return new ProjetoViewModel {
              Id = projeto.Id,
              Nome = projeto.Nome,
              Descricao = projeto.Descricao,
              DataDeInicio = projeto.DataDeInicio.ToString("dd/MM/yyyy"),
              DataDeTermino = projeto.DataDeTermino.ToString("dd/MM/yyyy"),
              Concluido = projeto.Concluido
            };
        }
    }
}
