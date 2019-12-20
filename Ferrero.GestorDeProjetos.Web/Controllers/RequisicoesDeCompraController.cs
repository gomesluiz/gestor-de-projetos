using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using Ferrero.GestorDeProjetos.Web.Models.Helpers;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;
using Ferrero.GestorDeProjetos.Web.Models.Domain;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
  public class RequisicoesDeCompraController : Controller
    {
        private readonly UnitOfWork _context;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly string _pathToStore;

        public RequisicoesDeCompraController(ApplicationDbContext  context, 
                                             IHostingEnvironment hostingEnvironment)
        {
            _context = new UnitOfWork(context);
            _hostingEnvironment = hostingEnvironment;
            _pathToStore = Path.Combine(_hostingEnvironment.WebRootPath, "docs", "arquivos");
        }

        // GET: RequisicoesDeCompra
        public async Task<IActionResult> Index(string message)
        {
            try
            {   
                var requisicoes = await _context
                    .Requisicoes
                    .FindAsync(includeProperties: "Ativo");
                
                var requisicoesViewModels = new List<RequisicaoDeCompraViewModel>();
                foreach(RequisicaoDeCompra requisicao in  requisicoes){
                    requisicoesViewModels.Add(ConvertToViewModel(requisicao));
                }

                ViewBag.StatusMessage = message;
                return View(requisicoesViewModels);
            }
            catch (DbException e)
            {
                ViewBag.StatusMessage = 
                      "Não é possível exibir as requisições de compra. " 
                    + "Tente novamente, e se o problema persistir " 
                    + "Motivo: " + e.Message + " "
                    + "entre em contato com o administrador do sistema.";
            }
            return View();
        }

        // GET: RequisicoesDeCompra/Create
        public IActionResult Create()
        {
            PopulateAtivosDropDownList();
            return View();
        }

        // POST: RequisicoesDeCompra/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
              RequisicaoDeCompraViewModel requisicaoViewModel
            , IFormFile Proposta)
        {
            if (RequisicaoDeCompraExists(requisicaoViewModel.Numero))
            {
                ModelState.AddModelError("Numero", "Esta requisição de compra já existe!");
            }

            if (ModelState.IsValid)
            {
                if (Proposta != null) {
                    try
                    {
                        await Upload(requisicaoViewModel, Proposta, _pathToStore);
                    }
                    catch(IOException e)
                    {
                        ModelState.AddModelError("", 
                            "Não é possível a proposta desta requisição de compra. " 
                            + "Motivo: " + e.Message + " "
                            + "Tente novamente, e se o problema persistir " 
                            + "entre em contato com o administrador do sistema.");
                    }
                }

                if (ModelState.IsValid) 
                {
                    try
                    {
                        _context.Requisicoes.Add(ConvertToModel(requisicaoViewModel));
                        await _context.SaveAsync();

                        return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Requisição [{0}] incluída com sucesso!"
                                , requisicaoViewModel.Numero)});
                    }
                    catch (DbUpdateException e)
                    {
                        ModelState.AddModelError("", 
                            "Não é possível incluir esta requisição de compra. " 
                          + "Motivo: " + e.Message + " "
                          + "Tente novamente, e se o problema persistir " 
                          + "entre em contato com o administrador do sistema.");  
                    }
                }
            }
        
            PopulateAtivosDropDownList(requisicaoViewModel.AtivoId);
            return View(requisicaoViewModel);
        }

        // GET: OrdensDeCompra/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var requisicao = await FindRequisicaoBy(id);
                if (requisicao == null) return NotFound();
            
                var requisicaoViewModel = ConvertToViewModel(requisicao);
                PopulateAtivosDropDownList(requisicaoViewModel.AtivoId); 

                return View(requisicaoViewModel);
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                    "Não é possível editar esta requisição de compra. "
                    + "Motivo: " + e.Message + " " 
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: RequisicoesDeCompra/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, RequisicaoDeCompraViewModel requisicaoViewModel
            , IFormFile Proposta)
        {
            if (id != requisicaoViewModel.Id) return NotFound();

            if (Proposta != null)
            {
                try
                {
                    await Upload(requisicaoViewModel, Proposta, _pathToStore);
                } 
                catch(IOException e)
                {
                    ModelState.AddModelError("", 
                        "Não é possível gravar a proposta desta requisição de compra. " 
                        + "Motivo: " + e.Message + " "
                        + "Tente novamente, e se o problema persistir "  
                        + "entre em contato com o administrador do sistema.");
                }
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var requisicao = ConvertToModel(requisicaoViewModel);

                    _context.Requisicoes.Update(requisicao);
                    await _context.SaveAsync();
                }
                catch (DbUpdateException e)
                {
                    ModelState.AddModelError("", 
                        "Não é possível editar esta requisição de compra. "
                        + "Motivo: " + e.Message + " "
                        + "Tente novamente, e se o problema persistir "  
                        + "entre em contato com o administrador do sistema.");
                }

                return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Requisição [{0}] atualizada com sucesso!"
                                , requisicaoViewModel.Numero)});

            }

            PopulateAtivosDropDownList(requisicaoViewModel.AtivoId);  
            return View(requisicaoViewModel);
        }

        // GET: RequisicoesDeCompra/Delete/5
        public async Task<IActionResult> Delete(int? id, string message="")
        {
            if (id == null) return NotFound();

            if (!String.IsNullOrEmpty(message))
            {
                ModelState.AddModelError("", 
                        "Não é possível remover esta ordem de compra. " 
                        + "Motivo: " + message + " "
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema.");
            }
            try
            {
                var requisicao = await FindRequisicaoBy(id);
                if (requisicao == null) return NotFound();

                var requisicaoDeCompraViewModel = ConvertToViewModel(requisicao);
                PopulateAtivosDropDownList(requisicaoDeCompraViewModel.AtivoId);  
                return View(requisicaoDeCompraViewModel);
            }
            catch(DbException e)
            {
                ModelState.AddModelError("", 
                        "Não é possível remover esta requisição de compra. " 
                        + "Motivo: " + e.Message + " "
                        + "Tente novamente, e se o problema persistir "  
                        + "entre em contato com o administrador do sistema."
                );
            }

            return View();
        }

        // POST: RequisicoesDeCompra/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var nota = await _context.NotasFiscais
                        .GetAsync(n => n.RequisicaoDeCompra.Id == id,
                        includeProperties: typeof(RequisicaoDeCompra).Name);

                if (nota == null)
                {
                    var requisicao = await FindRequisicaoBy(id);
                    _context.Requisicoes.Remove(requisicao);
                    await _context.SaveAsync();

                    if (requisicao.Proposta != null)
                        System.IO.File.Delete(Path.Combine(_pathToStore, requisicao.Proposta));
                
                    return RedirectToAction(nameof(Index)
                        , new { message = string.Format("Requisição [{0}] removida com sucesso!"
                        , requisicao.Numero)});
                }
                else 
                {
                    return RedirectToAction(nameof(Delete)
                        , new { id = id, message = "Esta requisição possui notas fiscais associadas a ela." }
                    );
                }

            }
            catch(DbUpdateException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });  
            }
            catch(IOException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });
            }
            
        }

        private bool RequisicaoDeCompraExists(long numero)
        {
           var requisicoes = _context.Requisicoes
                .Find(requisicao => requisicao.Numero == numero
                    , includeProperties: typeof(Ativo).Name);

            return requisicoes.Count() > 0;
        }

        private async Task<RequisicaoDeCompra> FindRequisicaoBy(int? id)
        {
            var requisicoes = await _context.Requisicoes
                .FindAsync(
                    requisicao => requisicao.Id == id
                    , includeProperties: typeof(Ativo).Name
                );

            return requisicoes.FirstOrDefault();
        }

        private void PopulateAtivosDropDownList(object ativoSelcionado = null)
        {
            var ativos =  _context.Ativos.Find();
            ViewBag.AtivoId = new SelectList(ativos, "Id", "Descricao", ativoSelcionado);
        }

        /// <summary>
        /// TODO:
        /// </summary>
        private  RequisicaoDeCompra ConvertToModel(RequisicaoDeCompraViewModel viewModel)
        {
            return new RequisicaoDeCompra {
                    Id = viewModel.Id,
                    Numero = viewModel.Numero,
                    Data = DateTime.ParseExact(viewModel.Data, "dd/MM/yyyy", null),
                    NumeroDaOrdemDeCompra = viewModel.NumeroDaOrdemDeCompra,
                    Descricao = viewModel.Descricao,
                    Ativo = _context.Ativos.Find(ativo => ativo.Id == viewModel.AtivoId).FirstOrDefault(),
                    Proposta = viewModel.Proposta
                };
        }
        
        private RequisicaoDeCompraViewModel ConvertToViewModel(RequisicaoDeCompra model)
        {
        return new RequisicaoDeCompraViewModel {
                    Id = model.Id,
                    Numero = model.Numero,
                    Data = model.Data.ToString("dd/MM/yyyy"),
                    NumeroDaOrdemDeCompra = model.NumeroDaOrdemDeCompra,
                    Descricao = model.Descricao,
                    AtivoId = model.Ativo.Id,
                    Proposta = model.Proposta
                };
        }

        private async Task Upload(RequisicaoDeCompraViewModel viewModel
            , IFormFile Proposta
            , string pathToUpload)
        { 
            string fileName = string.Empty;

            if (viewModel.Proposta != null && Proposta == null)
                return;
/*
            if (Proposta == null || Proposta.Length == 0)
            {
                ModelState.AddModelError("", "A proposta da requisicao não foi selecionada!");
                return;
            }
*/
            
            string extensao = Path.GetExtension(Proposta.FileName);
            if (extensao != ".pdf"){
                ModelState.AddModelError("", "O documento da proposta deve ser um  do tipo .pdf");
                return;
            }
            
            fileName = await FileUploadHelper.SaveFileAsync(Proposta, pathToUpload);
            viewModel.Proposta = fileName;
        }

        public async Task<IActionResult> Download(string filename)
        {
            var stream = await FileDownloadHelper.Download(_pathToStore, filename);
            return File(stream, FileDownloadHelper.GetContentType(filename), filename);
        }
    }
}
