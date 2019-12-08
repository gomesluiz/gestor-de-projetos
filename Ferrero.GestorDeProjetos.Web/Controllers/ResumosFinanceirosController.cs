using System;
using System.Linq;
using System.Data.Common;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;
using Ferrero.GestorDeProjetos.Web.Models.Helpers;
using System.IO;
using OfficeOpenXml;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
  [Authorize]
  public class ResumosFinanceirosController : Controller
    {
        private readonly UnitOfWork _unitOfWork;

        public ResumosFinanceirosController(ApplicationDbContext context)
        {
            _unitOfWork = new UnitOfWork(context);
        }

        // GET: ResumosFinanceiros
        public async Task<IActionResult> Index(string message)
        {
            try
            {   
                var resumos = await _unitOfWork
                    .Resumos
                    .FindAsync(includeProperties: typeof(OrdemDeInvestimento).Name);
                
                var resumosViewModels = new List<ResumoFinanceiroViewModel>();
                foreach(ResumoFinanceiro resumo in  resumos){
                    resumosViewModels.Add(ConvertToViewModel(resumo));
                }

                ViewBag.StatusMessage = message;
                return View(resumosViewModels);
            }
            catch (DbException e)
            {
                ModelState.AddModelError("", 
                        "Não é possível exibit os resumos financeiros. " 
                        + "Motivo: " + e.Message + " "
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // GET: ResumosFinanceiros/Create
        public IActionResult Create()
        {
            PopulateOrdensDeInvestimentoDropDownList();
            return View();
        }

        // POST: ResumosFinanceiros/Create
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
                return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Resumo Financeiro [{0}] incluído com sucesso!"
                                , viewModel.Id)});
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                      "Não é possível incluir este resumo financeiro. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
          }
          PopulateOrdensDeInvestimentoDropDownList(viewModel.OrdemDeInvestimentoId);
          return View(viewModel);
        }

        // GET: ResumosFinanceiros/Edit/5
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
            catch (DbException e)
            {
                ModelState.AddModelError("", 
                      "Não é possível editar este resumo financeiro. " 
                    + "Motivo: " + e.Message + " " 
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: ResumosFinanceiros/Edit/5
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

                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Resumo Financeiro [{0}] atualizado com sucesso!"
                                , viewModel.Id)});
                }
                catch (DbException e)
                {
                    ModelState.AddModelError("", 
                      "Não é possível editar este resumo financeiro. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");   
                }
            }
            PopulateOrdensDeInvestimentoDropDownList(viewModel.OrdemDeInvestimentoId);
            return View(viewModel);
        }

        // GET: ResumosFinanceiros/Delete/5
        public async Task<IActionResult> Delete(int? id, string message)
        {
            if (id == null) return NotFound();

            if (!String.IsNullOrEmpty(message))
            {
                ModelState.AddModelError("", 
                      "Não é possível remover este resumo financeiro. " 
                    + "Motivo: " + message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            try
            { 
                var resumo = await FindResumoFinanceiroBy(id);
                if (resumo == null) return NotFound();
                
                PopulateOrdensDeInvestimentoDropDownList(resumo.OrdemDeInvestimento.Id);
                return View(ConvertToViewModel(resumo));
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                      "Não é possível remover este resumo. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: ResumosFinanceiros/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var resumo = await FindResumoFinanceiroBy(id);
                _unitOfWork.Resumos.Remove(resumo);
                await _unitOfWork.SaveAsync();

                return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Resumo Financeiro [{0}] excluído com sucesso!"
                                , resumo.Id)});
            }
            catch(DbException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });  
            }
        }

        // GET: ResumosFinanceiros/Import
        public IActionResult Import()
        {
            return View();
        }

        // POST: ResumosFinanceiros/Import
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Import(PlanilhaResumoFinanceiroViewModel viewModel, IFormFile Arquivo)
        {
          if (Arquivo == null || Arquivo.Length <= 0)
          {
            ModelState.AddModelError("",  "O nome do arquivo Excel deverá ser fornecido");
          } else {
            if (!Path.GetExtension(Arquivo.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))  
            {  
              ModelState.AddModelError("",  "A extensão do arquivo Excel deverá ser .xlsx");  
            }  
          }

          if (ModelState.IsValid)
          {
            try
            {   
              using (var stream = new MemoryStream())
              {
                await Arquivo.CopyToAsync(stream);
                using(var package = new ExcelPackage(stream))
                {
                  ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                  var rowCount = worksheet.Dimension.Rows - 1;
                  for (int row = 2; row <= rowCount; row++)
                  {
                    var resumoViewModel = new ResumoFinanceiroViewModel();

                    var numero = worksheet.Cells[row, 1].Value.ToString().Trim();
                    var actual = worksheet.Cells[row, 3].Value.ToString().Trim();
                    var commitment = worksheet.Cells[row, 4].Value.ToString().Trim();
                    var assigned   = worksheet.Cells[row, 5].Value.ToString().Trim();
                    var available  = worksheet.Cells[row, 6].Value.ToString().Trim();;

                    resumoViewModel.OrdemDeInvestimentoNumero = numero.Substring(0, 7);
                    resumoViewModel.Data        = viewModel.Data;
                    resumoViewModel.Actual      = decimal.Parse(actual ?? "0.0");
                    resumoViewModel.Commitment  = decimal.Parse(commitment ?? "0.0");
                    resumoViewModel.Assigned    = decimal.Parse(assigned ?? "0.0");
                    resumoViewModel.Available   = decimal.Parse(available?? "0.0");

                    var ordemDeInvestimento = _unitOfWork
                      .Investimentos
                      .Find(e => e.Numero == resumoViewModel.OrdemDeInvestimentoNumero);
                    if (ordemDeInvestimento.Count() == 0)
                    {
                      ModelState.AddModelError("",  string.Format("A ordem de investimento [{0}] não ainda não foi cadastrada!",
                        resumoViewModel.OrdemDeInvestimentoNumero));
                      break;
                    } 
                    else 
                    {
                      var ordemArmazenada     = ordemDeInvestimento.FirstOrDefault();
                      var resumosArmazenados  = _unitOfWork
                        .Resumos.Find(
                          r => r.OrdemDeInvestimento.Numero  == ordemArmazenada.Numero 
                            && r.Data.ToString("dd/MM/yyyy") == viewModel.Data
                        , includeProperties: typeof(OrdemDeInvestimento).Name
                      );

                      if (resumosArmazenados.Count() > 0)
                        _unitOfWork.Resumos.Remove(resumosArmazenados.FirstOrDefault());

                      resumoViewModel.OrdemDeInvestimentoId = ordemArmazenada.Id;
                      _unitOfWork.Resumos.Add(ConvertToModel(resumoViewModel));
                    }
                  }
                  if (ModelState.IsValid)
                  {
                    await _unitOfWork.SaveAsync();
                    return RedirectToAction(nameof(Index)
                      , new { message = string.Format("Importação da planilha [{0}] concluída com sucesso!"
                      , Arquivo.FileName)});
                  }
                }
              }
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                      "Não é possível importar planilha de resumos financeiro. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
          }
          return View(viewModel);
        }

        private async Task<ResumoFinanceiro> FindResumoFinanceiroBy(int? id)
        {
            var resumos = await _unitOfWork
                .Resumos.FindAsync(
                    projeto => projeto.Id == id
                    , includeProperties: typeof(OrdemDeInvestimento).Name
                );

            return resumos.FirstOrDefault();
        }

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
