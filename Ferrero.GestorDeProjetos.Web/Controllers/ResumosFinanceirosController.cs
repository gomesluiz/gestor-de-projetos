using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;
using System.Data.Common;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
  public class ResumosFinanceirosController : Controller
    {
        private readonly UnitOfWork _unitOfWork;

        public ResumosFinanceirosController(ApplicationDbContext context)
        {
            _unitOfWork = new UnitOfWork(context);
        }

        // GET: ResumosFinanceiros
        public async Task<IActionResult> Index()
        {
            try
            {   
                var resumos = await _unitOfWork
                    .Resumos
                    .FindAsync(includeProperties:"OrdemDeInvestimento");
                
                var resumosViewModels = new List<ResumoFinanceiroViewModel>();
                foreach(ResumoFinanceiro resumo in  resumos){
                    resumosViewModels.Add(ConvertToViewModel(resumo));
                }

                return View(resumosViewModels);
            }
            catch (DbException)
            {
                ModelState.AddModelError("", "Não é possível exibit os resumos financeiros. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
            }
            return View();
        }
        // GET: Projetos/Create
        public IActionResult Create()
        {
            PopulateOrdensDeInvestimentoDropDownList();
            return View();
        }
        // POST: Projetos/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ResumoFinanceiroViewModel viewModel)
        {
          if (ModelState.IsValid)
          {
            try
            {   
              _unitOfWork.Resumos.Add(ConvertToModel(viewModel));
              await _unitOfWork.SaveAsync();
              return RedirectToAction(nameof(Index));
            }
            catch(DbException)
            {
                ModelState.AddModelError("", "Não é possível incluir este resumo financeiro. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
          }
          PopulateOrdensDeInvestimentoDropDownList(viewModel.OrdemDeInvestimentoId);
          return View(viewModel);
        }

        // GET: Projetos/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var resumo = await FindResumoFinanceiroBy(id);
                if (resumo == null) return NotFound();

                PopulateOrdensDeInvestimentoDropDownList(resumo.OrdemDeInvestimento.Id);
                return View(ConvertToViewModel(resumo));
            }
            catch (DbException)
            {
                ModelState.AddModelError("", "Não é possível editar este resumo financeiro. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: Projetos/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ResumoFinanceiroViewModel viewModel)
        {
            if (id != viewModel.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var resumo = ConvertToModel(viewModel);
                    _unitOfWork.Resumos.Update(resumo);
                    await _unitOfWork.SaveAsync();
                }
                catch (DbException)
                {
                    ModelState.AddModelError("", "Não é possível editar este resumo financeiro. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");   
                }
                return RedirectToAction(nameof(Index));
            }
            PopulateOrdensDeInvestimentoDropDownList(viewModel.OrdemDeInvestimentoId);
            return View(viewModel);
        }

        // GET: Projetos/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
            if (id == null) return NotFound();
            if (saveChangesError.GetValueOrDefault())
            {
                ModelState.AddModelError("", "Não é possível remover este resumo financeiro. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            try
            { 
                var resumo = await FindResumoFinanceiroBy(id);
                if (resumo == null) return NotFound();
                
                PopulateOrdensDeInvestimentoDropDownList(resumo.OrdemDeInvestimento.Id);
                return View(ConvertToViewModel(resumo));
            }
            catch(DbException)
            {
                ModelState.AddModelError("", "Não é possível remover este resumo. " + 
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
                var resumo = await FindResumoFinanceiroBy(id);

                _unitOfWork.Resumos.Remove(resumo);
        
                await _unitOfWork.SaveAsync();
            }
            catch(DbException)
            {
                return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
            }
            return RedirectToAction(nameof(Index));
        }

        ///<summary>
        /// Finds Projeto class object by Id.
        ///</summary>
        private async Task<ResumoFinanceiro> FindResumoFinanceiroBy(int? id)
        {
            var resumos = await _unitOfWork
                .Resumos.FindAsync(
                    projeto => projeto.Id == id
                    , includeProperties:"OrdemDeInvestimento"
                );

            return resumos.FirstOrDefault();
        }

        ///<summary>
        /// Convert an object from ResumoFinanceiroViewModel class to an object from 
        /// ResumoFinanceiro class 
        ///</summary>
        private  ResumoFinanceiro ConvertToModel(ResumoFinanceiroViewModel viewModel)
        {
            var ordemDeInvestimento = _unitOfWork
                .Investimentos
                .Find(e => e.Id == viewModel.OrdemDeInvestimentoId);

            return new ResumoFinanceiro {
                Id   = viewModel.Id,
                OrdemDeInvestimento = ordemDeInvestimento.FirstOrDefault(),
                Data = DateTime.ParseExact(viewModel.Data, "dd/MM/yyyy", null),
                Commitment = viewModel.Commitment,
                Assigned = viewModel.Assigned,
                Actual = viewModel.Actual,
                Available = viewModel.Available,
            };
        }

        ///<summary>
        /// Convert an object from Project class to an object from ProjectViewModel 
        /// class.
        ///</summary>
        private  ResumoFinanceiroViewModel ConvertToViewModel(ResumoFinanceiro resumo)
        {
          return new ResumoFinanceiroViewModel {
                Id = resumo.Id,
                OrdemDeInvestimentoId = resumo.OrdemDeInvestimento.Id,
                OrdemDeInvestimentoNumero = resumo.OrdemDeInvestimento.Numero,
                OrdemDeInvestimentoBudget = resumo.OrdemDeInvestimento.Budget,
                Data = resumo.Data.ToString("dd/MM/yyyy"),
                Commitment = resumo.Commitment,
                Assigned = resumo.Assigned,
                Actual = resumo.Actual,
                Available = resumo.Available,
            };
        }
        private void PopulateOrdensDeInvestimentoDropDownList(object ordemDeInvestimentoSelecionado = null)
        {
            var ordens = _unitOfWork
                .Investimentos
                .Find(orderBy: e => e.OrderBy(s => s.Numero));

            ViewBag.OrdemDeInvestimentoId = new SelectList(ordens
              , "Id", "Numero", ordemDeInvestimentoSelecionado);
        }
    }
}
