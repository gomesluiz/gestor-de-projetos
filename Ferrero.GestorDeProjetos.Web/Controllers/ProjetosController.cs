using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;
using Ferrero.GestorDeProjetos.Web.Extensions;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
  [Authorize]
  public class ProjetosController : Controller
    {
        private readonly UnitOfWork _context;

        public ProjetosController(ApplicationDbContext context)
        {
            _context = new UnitOfWork(context);
        }

        // GET: Projetos
        public async Task<IActionResult> Index()
        {
            try
            {   
                var projetos = await _context
                    .Portifolio
                    .FindAsync(includeProperties:"OrdemDeInvestimento");
                
                var projetosViewModels = new List<ProjetoViewModel>();
               
                foreach(Projeto projeto in  projetos){
                    projetosViewModels.Add(ConvertToViewModel(projeto));
                }
            
                HttpContext.Session.Remove(Projeto.PROJETO_SESSION_ID);
                return View(projetosViewModels);
            }
            catch (DbException)
            {
                ModelState.AddModelError("", "Não é possível exibit os projetos. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
            }
            return View();
        }
        // GET: Projetos/Create
        public IActionResult Create()
        {
            return View();
        }
        // POST: Projetos/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProjetoViewModel viewModel)
        {
          if (ModelState.IsValid)
          {
            try
            {   
              _context.Portifolio.Add(ConvertToModel(viewModel));
              await _context.SaveAsync();
              return RedirectToAction(nameof(Index));
            }
            catch(DbException)
            {
                ModelState.AddModelError("", "Não é possível incluir este projeto. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
          }
          return View(viewModel);
        }

        // GET: Projetos/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var projeto = await FindProjetoBy(id);
                if (projeto == null) return NotFound();

                return View(ConvertToViewModel(projeto));
            }
            catch (DbException)
            {
                ModelState.AddModelError("", "Não é possível editar este projeto. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: Projetos/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ProjetoViewModel viewModel)
        {
            if (id != viewModel.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var projeto = ConvertToModel(viewModel);
                    _context.Portifolio.Update(projeto);
                    _context.Investimentos.Update(projeto.OrdemDeInvestimento);
                    await _context.SaveAsync();
                }
                catch (DbException)
                {
                    ModelState.AddModelError("", "Não é possível editar este projeto. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");   
                }
                return RedirectToAction(nameof(Index));
            }
            return View(viewModel);
        }

        // GET: Projetos/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
            if (id == null) return NotFound();
            if (saveChangesError.GetValueOrDefault())
            {
                ModelState.AddModelError("", "Não é possível remover este projeto. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            try
            { 
                var projeto = await FindProjetoBy(id);
                if (projeto == null) return NotFound();
                
                return View(ConvertToViewModel(projeto));
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
                var projeto = await FindProjetoBy(id);

                _context.Portifolio.Remove(projeto);
                _context.Investimentos.Remove(projeto.OrdemDeInvestimento);
                await _context.SaveAsync();
            }
            catch(DbException)
            {
                return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
            }
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Gantt(int id)
        {
            var projeto = await _context
                  .Portifolio
                  .GetAsync(p => p.Id == id, includeProperties: "OrdemDeInvestimento");
        
            HttpContext.Session.SetObjectAsJson(Projeto.PROJETO_SESSION_ID, projeto);
            return View();
        }

        public IActionResult Kanban()
        {
            return View();
        }

        ///<summary>
        /// Finds Projeto class object by Id.
        ///</summary>
        private async Task<Projeto> FindProjetoBy(int? id)
        {
            var projetos = await _context.Portifolio.FindAsync(
                projeto => projeto.Id == id
                , includeProperties:"OrdemDeInvestimento");

            return projetos.FirstOrDefault();
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
                OrdemDeInvestimento = new OrdemDeInvestimento 
                {
                        Id = projetoViewModel.OrdemDeInvestimento.Id,
                        Numero = projetoViewModel.OrdemDeInvestimento.Numero,
                        Budget = projetoViewModel.OrdemDeInvestimento.Budget
                },
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
                OrdemDeInvestimento = new OrdemDeInvestimentoViewModel 
                {
                    Id = projeto.OrdemDeInvestimento.Id,
                    Numero = projeto.OrdemDeInvestimento.Numero,
                    Budget = projeto.OrdemDeInvestimento.Budget
                },
                Concluido = projeto.Concluido
            };
        }
    }
}
