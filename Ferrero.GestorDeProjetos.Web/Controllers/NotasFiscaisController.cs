using System;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;
using System.Collections.Generic;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class NotasFiscaisController : Controller
    {
        private readonly UnitOfWork _context;
        public NotasFiscaisController(ApplicationDbContext context)
        {
            _context = new UnitOfWork(context);
        }

        // GET: NotasFiscais
        public async Task<IActionResult> Index(string message)
        {
            try
            {   
                var  notas = await _context
                    .NotasFiscais
                    .FindAsync(includeProperties: typeof(Fornecedor).Name 
                        + "," + typeof(RequisicaoDeCompra).Name);
                
                var notasViewModels = new List<NotaFiscalViewModel>();
                foreach(NotaFiscal nota in  notas){
                    notasViewModels.Add(ConvertToViewModel(nota));
                }

                ViewBag.StatusMessage = message;
                return View(notasViewModels);
            }
            catch (DbException e)
            {
                ModelState.AddModelError("", 
                    "Não é possível exibir as notas fiscais. " 
                    + "Motivo: " + e.Message + " " 
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // GET: NotasFiscais/Create
        public IActionResult Create()
        {
            PopulateRequisicoesDeCompraDropDownList();
            return View();
        }

        // POST: NotasFiscais/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(NotaFiscalViewModel notaFiscalViewModel)
        {
            try {

                // Insere um novo fornecedor se o usuário não escolher um que já exista.
                notaFiscalViewModel.FornecedorId = await InsereFornecedor(notaFiscalViewModel);
                
                if (NotaFiscalExists(notaFiscalViewModel.Numero, notaFiscalViewModel.FornecedorId))
                {
                    ModelState.AddModelError("Numero", "Esta nota fiscal já existe!");
                }

                if (ModelState.IsValid)
                {   
                    var notaFiscal = ConvertToModel(notaFiscalViewModel);
                    _context.NotasFiscais.Add(notaFiscal);
                    await _context.SaveAsync();

                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Nota Fiscal [{0}] incluída com sucesso!"
                                , notaFiscal.Numero)});
                }
                
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                      "Não é possível incluir esta nota fiscal. " 
                    + "Motivo: " + e.Message + " "  
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");  
            }

            PopulateRequisicoesDeCompraDropDownList(notaFiscalViewModel.RequisicaoDeCompraId);
            return View(notaFiscalViewModel);
        }

        // GET: NotasFiscais/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var notaFiscal = await FindNotaFiscalBy(id);
                if (notaFiscal == null) return NotFound();
            
                var notaFiscalViewModel = ConvertToViewModel(notaFiscal);

                PopulateRequisicoesDeCompraDropDownList(notaFiscalViewModel.RequisicaoDeCompraId);

                return View(notaFiscalViewModel);
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                        "Não é possível editar esta nota fiscal. "  
                        + "Motivo: " + e.Message + " " 
                        + "Tente novamente, e se o problema persistir "  
                        + "entre em contato com o administrador do sistema.");
            }
            
            return View();
        }

        // POST: NotasFiscais/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, NotaFiscalViewModel notaFiscalViewModel)
        {
            if (id != notaFiscalViewModel.Id) return NotFound();
         
            if (ModelState.IsValid)
            {
                try
                {
                    notaFiscalViewModel.FornecedorId = await InsereFornecedor(notaFiscalViewModel);
                    NotaFiscal notaFiscal = ConvertToModel(notaFiscalViewModel);
                   
                    _context.NotasFiscais.Update(notaFiscal);
                    await _context.SaveAsync();

                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Nota Fiscal [{0}] atualizada com sucesso!"
                                , notaFiscal.Numero)});
                }
                catch (DbUpdateException e)
                {
                    ModelState.AddModelError("", 
                      "Não é possível editar esta nota fiscal. "  
                    + "Motivo: " + e.Message + " " 
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
                }
            }
            PopulateRequisicoesDeCompraDropDownList(notaFiscalViewModel.RequisicaoDeCompraId);
            return View(notaFiscalViewModel);
        }

        // GET: NotasFiscais/Delete/5
        public async Task<IActionResult> Delete(int? id, string message="")
        {
            if (id == null) return NotFound();

            if (!String.IsNullOrEmpty(message))
            {
                ModelState.AddModelError("", 
                      "Não é possível remover esta nota fiscal. " 
                    + "Motivo: " + message + " "
                    + "Tente novamente, e se o problema persistir "  
                    + "entre em contato com o administrador do sistema.");
            }

            try
            {  
                var notaFiscal = await FindNotaFiscalBy(id);
                if (notaFiscal == null) return NotFound();

                var notaFiscalViewModel = ConvertToViewModel(notaFiscal);
                PopulateRequisicoesDeCompraDropDownList(notaFiscalViewModel.RequisicaoDeCompraId);
                return View(notaFiscalViewModel);
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                      "Não é possível excluir esta nota fiscal. " 
                    + "Motivo: " + e.Message + " " 
                    + "Tente novamente, e se o problema persistir "  
                    + "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: NotasFiscais/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var notaFiscal = await FindNotaFiscalBy(id);
                _context.NotasFiscais.Remove(notaFiscal);
                await _context.SaveAsync();

                return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Nota Fiscal [{0}] removida com sucesso!"
                                , notaFiscal.Numero)});
            }
            catch(DbUpdateException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });  
            }
        }

        private void PopulateRequisicoesDeCompraDropDownList(
            object requisicaoDeCompraSelecionada = null)
        {
            var requisicoes = _context
                .Requisicoes
                .Find(filter: e => e.NumeroDaOrdemDeCompra != null
                , orderBy:e => e.OrderBy(s => s.NumeroDaOrdemDeCompra));

            ViewBag.RequisicaoDeCompraId = new SelectList(requisicoes
                , "Id"
                , "NumeroDaOrdemDeCompra"
                , requisicaoDeCompraSelecionada);
        }

        private bool NotaFiscalExists(long numero, int FornecedorId)
        {
            var notas = _context.NotasFiscais
                .Find(requisicao => requisicao.Numero == numero 
                   && requisicao.Fornecedor.Id == FornecedorId,
                   includeProperties: typeof(Fornecedor).Name);

            return notas.Count() > 0;
        }

        private async Task<int> InsereFornecedor(NotaFiscalViewModel notaFiscalViewModel){
            var fornecedor = new Fornecedor{
                Id = notaFiscalViewModel.FornecedorId,
                Nome = notaFiscalViewModel.NomeDoFornecedor,
            };

            if (fornecedor.Id == 0) 
            {
                var fornecedores =  await _context
                    .Fornecedores
                    .FindAsync(e => e.Nome.ToLower() == fornecedor.Nome.ToLower());
                if ( fornecedores.Count() == 0 )
                {
                    _context.Fornecedores.Add(fornecedor);
                    await _context.SaveAsync();
                }
            }
            return fornecedor.Id;
        }

        private async Task<NotaFiscal> FindNotaFiscalBy(int? id)
        {
            var notas = await _context
                .NotasFiscais
                .FindAsync(filter:e => e.Id == id,
                    includeProperties: typeof(Fornecedor).Name + "," + typeof(RequisicaoDeCompra).Name);

            return notas.FirstOrDefault();
        }
        private  NotaFiscal ConvertToModel(NotaFiscalViewModel notaFiscalViewModel)
        {
          return new NotaFiscal {
                Id = notaFiscalViewModel.Id,
                Numero = notaFiscalViewModel.Numero,
                DataDeLancamento = DateTime.ParseExact(notaFiscalViewModel.DataDeLancamento, "dd/MM/yyyy", null),
                Fornecedor = _context
                    .Fornecedores
                    .Find(e => e.Id == notaFiscalViewModel.FornecedorId)
                    .FirstOrDefault(),
                RequisicaoDeCompra = _context
                    .Requisicoes
                    .Find(e => e.Id == notaFiscalViewModel.RequisicaoDeCompraId)
                    .FirstOrDefault(),
                Migo = notaFiscalViewModel.Migo,
                Valor = notaFiscalViewModel.Valor
            };
        }

        private NotaFiscalViewModel ConvertToViewModel(NotaFiscal notaFiscal)
        {
          return new NotaFiscalViewModel {
                Id = notaFiscal.Id,
                Numero = notaFiscal.Numero,
                DataDeLancamento = notaFiscal.DataDeLancamento.ToString("dd/MM/yyyy"),
                FornecedorId = notaFiscal.Fornecedor.Id,
                NomeDoFornecedor = notaFiscal.Fornecedor.Nome,
                RequisicaoDeCompraId = notaFiscal.RequisicaoDeCompra.Id,
                Migo = notaFiscal.Migo,
                Valor = notaFiscal.Valor
            };
        }
    }
}
