using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Ferrero.GestorDeProjetos.Web.Models.Helpers;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class RequisicoesDeCompraController : Controller
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly string _pathToStore;

        public RequisicoesDeCompraController(ApplicationDbContext  context, 
                                             IHostingEnvironment hostingEnvironment)
        {
            _unitOfWork = new UnitOfWork(context);
            _hostingEnvironment = hostingEnvironment;
            _pathToStore = Path.Combine(_hostingEnvironment.WebRootPath, "docs", "requisicoes");
        }

        // GET: OrdensDeCompra
        public async Task<IActionResult> Index()
        {
            try
            {   
                var requisicoes = await _unitOfWork
                    .Requisicoes
                    .FindAsync(includeProperties: "Ativo");
                
                var requisicoesViewModels = new List<RequisicaoDeCompraViewModel>();
                foreach(RequisicaoDeCompra requisicao in  requisicoes){
                    requisicoesViewModels.Add(ConvertToViewModel(requisicao));
                }

                return View(requisicoesViewModels);
            }
            catch (DbException)
            {
                ModelState.AddModelError("", "Não é possível exibit as requisições de compra. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // GET: OrdensDeCompra/Create
        public IActionResult Create()
        {
            PopulateAtivosDropDownList();
            return View();
        }

        // POST: OrdensDeCompra/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(RequisicaoDeCompraViewModel requisicaoViewModel
            , IFormFile Proposta)
        {
            if (RequisicaoDeCompraExists(requisicaoViewModel.Numero))
            {
                ModelState.AddModelError("Numero", "Esta requisição de compra já existe!");
            }

            if (ModelState.IsValid)
            {
                try
                {
                    await Upload(requisicaoViewModel, Proposta, _pathToStore);
                }
                catch(IOException)
                {
                    ModelState.AddModelError("", "Não é possível gravar o documento de proposta. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
                }

                if (ModelState.IsValid) 
                {
                    try
                    {
                        _unitOfWork.Requisicoes.Add(ConvertToModel(requisicaoViewModel));
                        await _unitOfWork.SaveAsync();

                        return RedirectToAction(nameof(Index));
                    }
                    catch (DbUpdateException)
                    {
                        ModelState.AddModelError("", "Não é possível incluir esta requisição de compra. " + 
                            "Tente novamente, e se o problema persistir " + 
                            "entre em contato com o administrador do sistema.");  
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
            catch(DbException)
            {
                ModelState.AddModelError("", "Não é possível editar esta requisição de compra. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: OrdensDeCompra/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, RequisicaoDeCompraViewModel requisicaoViewModel
            , IFormFile Proposta)
        {
            if (id != requisicaoViewModel.Id) return NotFound();

            try
            {
                await Upload(requisicaoViewModel, Proposta, _pathToStore);
            } 
            catch(IOException)
            {
                ModelState.AddModelError("", "Não é possível gravar a proposta da requisição de compra. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var requisicao = ConvertToModel(requisicaoViewModel);

                    _unitOfWork.Requisicoes.Update(requisicao);
                    await _unitOfWork.SaveAsync();
                }
                catch (DbUpdateException)
                {
                    ModelState.AddModelError("", "Não é possível editar esta requisição de compra. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
                }
            }

            if (ModelState.IsValid) return RedirectToAction(nameof(Index));

            PopulateAtivosDropDownList(requisicaoViewModel.AtivoId);  
            return View(requisicaoViewModel);
        }

        // GET: OrdensDeCompra/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
            if (id == null) return NotFound();

            if (saveChangesError.GetValueOrDefault())
            {
                ModelState.AddModelError("", "Não é possível remover esta ordem de compra. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
            }
            try
            {
                var requisicao = await FindRequisicaoBy(id);
                if (requisicao == null) return NotFound();

                var requisicaoDeCompraViewModel = ConvertToViewModel(requisicao);
                PopulateAtivosDropDownList(requisicaoDeCompraViewModel.AtivoId);  
                return View(requisicaoDeCompraViewModel);
            }
            catch(DbException)
            {
                ModelState.AddModelError("", "Não é possível remover esta requisição de compra. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: OrdensDeCompra/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var requisicao = await FindRequisicaoBy(id);
                _unitOfWork.Requisicoes.Remove(requisicao);
                await _unitOfWork.SaveAsync();

                System.IO.File.Delete(Path.Combine(_pathToStore, requisicao.Proposta));
            }
            catch(DbUpdateException)
            {
                return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
            }
            catch(IOException)
            {
                return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });
            }
            return RedirectToAction(nameof(Index));
        }

        /// <summary>
        /// TODO:
        /// </summary>
        private bool RequisicaoDeCompraExists(long numero)
        {
            var requisicoes = _unitOfWork.Requisicoes
                .Find(requisicao => requisicao.Numero == numero, includeProperties:"Ativo");

            return requisicoes.Count() > 0;
        }

        ///<summary>
        /// TODO:
        ///</summary>
        private async Task<RequisicaoDeCompra> FindRequisicaoBy(int? id)
        {
            var requisicoes = await _unitOfWork.Requisicoes
                .FindAsync(
                    requisicao => requisicao.Id == id
                    , includeProperties:"Ativo"
                );

            return requisicoes.FirstOrDefault();
        }

        /// <summary>
        /// TODO:
        /// </summary>
        private void PopulateAtivosDropDownList(object ativoSelcionado = null)
        {
            var ativos =  _unitOfWork.Ativos.Find();
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
                    Ativo = _unitOfWork.Ativos.Find(ativo => ativo.Id == viewModel.AtivoId).FirstOrDefault(),
                    Proposta = viewModel.Proposta
                };
        }
        
        /// <summary>
        /// TODO:
        /// </summary>
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

        /// <summary>
        /// TODO:
        /// </summary>
        private async Task Upload(RequisicaoDeCompraViewModel viewModel
            , IFormFile Proposta
            , string pathToUpload)
        { 
            string fileName = string.Empty;

            if (viewModel.Proposta != null && Proposta == null)
                return;

            if (Proposta == null || Proposta.Length == 0)
            {
                ModelState.AddModelError("", "A proposta da requisicao não foi selecionada!");
                return;
            }
            
            string extensao = Path.GetExtension(Proposta.FileName);
            if (extensao != ".pdf"){
                ModelState.AddModelError("", "Documento da ordem deve ser um  do tipo PDF!");
                return;
            }
            
            FileUploadHelper uploader = new FileUploadHelper();
            fileName = await uploader.SaveFileAsync(
                Proposta
                , pathToUpload
                , "proposta_" + viewModel.Numero + ".pdf"
            );
            viewModel.Proposta = fileName;
        }

        /// <summary>
        /// TODO:
        /// </summary>
        public async Task<IActionResult> Download(string filename)
        {
            var downloader = new FileDownloadHelper();
            var stream = await downloader.Download(_pathToStore, filename);
            return File(stream, downloader.GetContentType(filename), filename);
        }
    }
}
