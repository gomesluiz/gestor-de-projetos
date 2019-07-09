using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;
using System.Data;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class ProjetosController : Controller
    {
        private readonly AppDatabaseContext _context;
        private readonly UnitOfWork _unitOfWork;

        public ProjetosController(AppDatabaseContext context)
        {
            _context    = context;
            _unitOfWork = new UnitOfWork(context);
        }

        // GET: Projetos
        public async Task<IActionResult> Index()
        {
            var projetos = await _unitOfWork.Portifolio.FindAsync(includeProperties:"OrdemDeInvestimento");
            
            var projetosViewModels = new List<ProjetoViewModel>();
            foreach(Projeto projeto in  projetos){
                projetosViewModels.Add(ConvertToViewModel(projeto));
            }

            return View(projetosViewModels);
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
        public async Task<IActionResult> Create(ProjetoViewModel viewModel)
        {
          if (ModelState.IsValid)
          {
            try
            {   
              _unitOfWork.Portifolio.Add(ConvertToModel(viewModel));
              await _unitOfWork.SaveAsync();
              return RedirectToAction(nameof(Index));
            }
            catch(DataException)
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
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
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
                    _unitOfWork.Portifolio.Update(projeto);
                    _unitOfWork.Investimentos.Update(projeto.OrdemDeInvestimento);
                    await _unitOfWork.SaveAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProjetoExists(viewModel.Id))
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

                _unitOfWork.Portifolio.Remove(projeto);
                _unitOfWork.Investimentos.Remove(projeto.OrdemDeInvestimento);
                await _context.SaveChangesAsync();
            }
            catch(DbUpdateException)
            {
                return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
            }
            return RedirectToAction(nameof(Index));
        }

        ///<summary>
        /// Returns TRUE if an Projeto class object exists, otherwise
        /// returns FALSE.     
        ///</summary>
        private bool ProjetoExists(int id)
        {
            return _context.Projetos.Any(e => e.Id == id);
        }

        ///<summary>
        /// Finds Project class object by Id.
        ///</summary>
        private async Task<Projeto> FindProjetoBy(int? id)
        {
            var projetos = await _unitOfWork.Portifolio.FindAsync(
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
