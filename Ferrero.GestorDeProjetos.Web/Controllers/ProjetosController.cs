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
using Ferrero.GestorDeProjetos.Web.Models.Domain;

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
        public async Task<IActionResult> Index(string message)
        {
            try
            {   
                var projetos = await _context
                    .Projetos
                    .FindAsync(includeProperties: typeof(OrdemDeInvestimento).Name);
                
                var projetosViewModels = new List<ProjetoViewModel>();
               
                foreach(Projeto projeto in  projetos){
                    projetosViewModels.Add(ConvertToViewModel(projeto));
                }
            
                HttpContext.Session.Remove(Projeto.PROJETO_SESSION_ID);
                
                ViewBag.StatusMessage = message;
                return View(projetosViewModels);
            }
            catch (DbException e)
            {
                ViewBag.StatusMessage =
                          "Erro: Não é possível exibir os projetos. "  
                        + "Motivo: " + e.Message + " " 
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema.";
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
              _context.Projetos.Add(ConvertToModel(viewModel));
              await _context.SaveAsync();
              return RedirectToAction(nameof(Index)
                            , new { message = string.Format("Projeto [{0}] incluído com sucesso!"
                            , viewModel.Nome)});
              
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                      "Não é possível incluir este projeto. "  
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema."
                );
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
            catch (DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível editar este projeto. "  
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema."
                );
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
                    _context.Projetos.Update(projeto);
                    _context.Investimentos.Update(projeto.OrdemDeInvestimento);
                    await _context.SaveAsync();

                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Projeto [{0}] atualizado com sucesso!"
                                , viewModel.Nome)});
                }
                catch (DbException e)
                {
                    ModelState.AddModelError(""
                        , "Não é possível editar este projeto. " 
                        + "Motivo: " + e.Message + " "
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema."
                    );   
                }
                
            }
            return View(viewModel);
        }

        // GET: Projetos/Delete/5
        public async Task<IActionResult> Delete(int? id, string message="")
        {
            if (id == null) return NotFound();
            if (message != "")
            {
                ModelState.AddModelError(""
                    , "Não é possível remover este projeto. " 
                    + "Motivo: " + message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema."
                );
            }
            try
            { 
                var projeto = await FindProjetoBy(id);
                if (projeto == null) return NotFound();
                
                return View(ConvertToViewModel(projeto));
            }
            catch(DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível remover este projeto. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema."
                );
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

                var ativo = await _context.Ativos.GetAsync(
                    a => a.OrdemDeInvestimento.Id == projeto.OrdemDeInvestimento.Id,
                    includeProperties: typeof(OrdemDeInvestimento).Name);

                if (ativo == null)
                {
                    _context.Investimentos.Remove(projeto.OrdemDeInvestimento);
                    _context.Projetos.Remove(projeto);    
                    await _context.SaveAsync();
                }
                else 
                {
                    return RedirectToAction(nameof(Delete)
                        , new { id = id, message = "Este projeto possui ativos associados a ele." }
                    );
                }
                return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Projeto [{0}] removido com sucesso!"
                                , projeto.Nome)});
            }
            catch(DbException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });  
            }
        }

        public async Task<IActionResult> Gantt(int projetoId)
        {
            var projeto = await _context
                  .Projetos
                  .GetAsync(p => p.Id == projetoId, includeProperties: typeof(OrdemDeInvestimento).Name);
        
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
            var projetos = await _context.Projetos.FindAsync(
                projeto => projeto.Id == id
                , includeProperties: typeof(OrdemDeInvestimento).Name);

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
