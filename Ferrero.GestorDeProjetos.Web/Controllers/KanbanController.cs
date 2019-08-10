using System;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.Kanban;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;


namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class KanbanController : Controller
    {
        private readonly UnitOfWork _unitOfWork;
        public KanbanController(ApplicationDbContext context)
        {
            _unitOfWork = new UnitOfWork(context);
        }

        // GET: QuadroViewModel
        public async Task<IActionResult> Index()
        {
            try
            {   
                var  tarefas = await _unitOfWork
                    .Tarefas
                    .FindAsync(includeProperties: "Projeto");
                
                return View(new QuadroViewModel
                    (
                        tarefas
                        .ToList()
                        .Select(t => (TarefaViewModel)t)
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

        // GET: Tarefa/Create
        public IActionResult Create()
        {
            PopulaListaDeProjetos();
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
                    
                        var tarefa = (Tarefa)tarefaViewModel;
                        _unitOfWork.Tarefas.Add(tarefa);
                        await _unitOfWork.SaveAsync();

                        return RedirectToAction(nameof(Index));
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

            PopulaListaDeProjetos(tarefaViewModel.ProjetoId);
            return View(tarefaViewModel);
        }

        // GET: Tarefa/Edit/{id}
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var tarefa = await FindTarefaBy(id);
                if (tarefa == null) return NotFound();
            
                var tarefaViewModel = (TarefaViewModel) tarefa;

                PopulaListaDeProjetos(tarefaViewModel.ProjetoId);
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

        // POST: Tarefas/Edit/{id}
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
                   
                    _unitOfWork.Tarefas.Update(tarefa);
                    await _unitOfWork.SaveAsync();

                    return RedirectToAction(nameof(Index));
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

            PopulaListaDeProjetos(tarefaViewModel.ProjetoId);
            return View(tarefaViewModel);
        }

        // GET: NotasFiscais/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
            if (id == null) return NotFound();

            if (saveChangesError.GetValueOrDefault())
            {
                ModelState.AddModelError("", "Não é possível remover esta nota fiscal. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }

            try
            {  
                var notaFiscal = await FindTarefaBy(id);
                if (notaFiscal == null) return NotFound();

                var notaFiscalViewModel = ConvertToViewModel(notaFiscal);
                PopulaListaDeProjetos(notaFiscalViewModel.RequisicaoDeCompraId);
                return View(notaFiscalViewModel);
            }
            catch(DbException)
            {
                ModelState.AddModelError("", "Não é possível excluir esta nota fiscal. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
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
                var notaFiscal = await FindTarefaBy(id);
                _unitOfWork.NotasFiscais.Remove(notaFiscal);
                await _unitOfWork.SaveAsync();
            }
            catch(DbUpdateException)
            {
                return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
            }
            return RedirectToAction(nameof(Index));
        }

        private void PopulaListaDeProjetos(
            object requisicaoDeCompraSelecionada = null)
        {
            var requisicoes = _unitOfWork
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
            var notas = _unitOfWork.NotasFiscais
                .Find(requisicao => requisicao.Numero == numero 
                   && requisicao.Fornecedor.Id == FornecedorId,
                   includeProperties: "Fornecedor");

            return notas.Count() > 0;
        }

        ///<summary>
        /// Encontra uma tarefa pelo seu id.
        ///</summary>
        private async Task<Tarefa> FindTarefaBy(int? id)
        {
            var projetos = await _unitOfWork
                .Tarefas
                .FindAsync(e => e.Id == id
                        , includeProperties: "Projeto");

            return projetos.FirstOrDefault();
        }
    }
}
