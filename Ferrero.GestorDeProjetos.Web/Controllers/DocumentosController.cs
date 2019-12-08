using System;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

using Microsoft.EntityFrameworkCore;

using Ferrero.GestorDeProjetos.Web.Models.Domain;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;
using Ferrero.GestorDeProjetos.Web.Models.Helpers;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class DocumentosController : Controller
    {
        private readonly UnitOfWork _context;
        private readonly IHostingEnvironment _environment;
        private readonly string _pathToStore;

        public DocumentosController(ApplicationDbContext context, IHostingEnvironment environment)
        {
            _context = new UnitOfWork(context);
            _environment = environment;
            _pathToStore = Path.Combine(_environment.WebRootPath, "docs", "projetos");
        }

        // GET: DocumentoViewModel
        public async Task<IActionResult> Show(int projetoId, string message)
        {
            try
            {   
                var documentos = await _context
                    .Documentos
                    .FindAsync(
                          e => e.ProjetoId == projetoId
                        , includeProperties: "Projeto"
                    );
                
                ViewBag.StatusMessage = message;
                return View(
                        new PastaViewModel(
                            projetoId
                            , documentos.Select(d=> (DocumentoViewModel)d)
                        )
                );
            }
            catch (DbException e)
            {
                ViewBag.StatusMessage =
                      "Erro: Não é possível exibir os documentos do projeto. " 
                    + "Motivo: " + e.Message + " "  
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.";
            }
            return View();
        }

        // GET: Documento/Create
        public IActionResult Create(int projetoId)
        {
            ViewBag.Projeto = _context.Projetos.Get(p => p.Id == projetoId);            
            return View();
        }

        // POST: Documento/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(DocumentoViewModel documentoViewModel, IFormFile Arquivo)
        {
            if (ModelState.IsValid)
            {
                try 
                {
                    var response = await FileUploadHelper.DoUpload(Arquivo, _pathToStore, documentoViewModel.Arquivo);
                    if (response.IsOk())
                    {
                        documentoViewModel.Arquivo = response.FileName;
                        _context.Documentos.Add((Documento) documentoViewModel);
                        await _context.SaveAsync();

                        return RedirectToAction(nameof(Show)
                            , new { projetoId = documentoViewModel.ProjetoId
                                , message = string.Format("Documento [ {0} ] incluído com sucesso!"
                                    , documentoViewModel.Titulo) });
                    }
                    ModelState.AddModelError(""
                    , "Não é possível incluir este documento. " 
                    + "Motivo: " + response.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
                }
                catch(DbException e)
                {
                    ModelState.AddModelError(""
                        , "Não é possível incluir este documento. " 
                        + "Motivo: " + e.Message + " "
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema.");  
                }
            }

            ViewBag.Projeto = _context.Projetos.Get(p => p.Id == documentoViewModel.ProjetoId);
            return View(documentoViewModel);
        }

        // GET: Documento/Edit/{id}
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var documento = await _context.Documentos.GetAsync(d => d.Id == id
                                , includeProperties: "Projeto");
                if (documento == null) return NotFound();
            
                return View((DocumentoViewModel) documento);
            }
            catch(DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível editar este documento. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            
            return View();
        }

        // POST: Documento/Edit/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, DocumentoViewModel documentoViewModel, IFormFile Arquivo)
        {
            if (id != documentoViewModel.Id) return NotFound();
         
            if (ModelState.IsValid)
            {
                try
                {
                    var response = await FileUploadHelper.DoUpload(Arquivo, _pathToStore, documentoViewModel.Arquivo);
                    if (response.IsOk())
                    {
                        if (!String.IsNullOrEmpty(response.FileName))
                            documentoViewModel.Arquivo = response.FileName;

                        _context.Documentos.Update((Documento) documentoViewModel);
                        await _context.SaveAsync();

                        return RedirectToAction(nameof(Show)
                            , new { projetoId = documentoViewModel.ProjetoId
                                , message = string.Format("Documento [ {0} ] atualizado com sucesso !"
                                    , documentoViewModel.Titulo) });
                    }
                    ModelState.AddModelError(""
                    , "Não é possível editar este documento. " 
                    + "Motivo: " + response.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
                }
                catch (DbUpdateException e)
                {
                    ModelState.AddModelError(""
                    , "Não é possível editar este documento. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
                }
            }

            return View(documentoViewModel);
        }

        // GET: Documento/Delete/5
        public async Task<IActionResult> Delete(int? id, String errorMessage="")
        {
            if (id == null) return NotFound();

            if (errorMessage != "")
            {
                ModelState.AddModelError(""
                    , "Não é possível remover este documento. " 
                    + "Motivo: " + errorMessage + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }

            try
            {  
                var documento = await _context.Documentos.GetAsync(d => d.Id == id
                                , includeProperties: "Projeto");
                if (documento == null) return NotFound();

                return View((DocumentoViewModel) documento);
            }
            catch(DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível excluir este documento. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir "  
                    + "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: Documento/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            Documento documento;
            try
            {
                documento = await _context.Documentos.GetAsync(d => d.Id == id);
                _context.Documentos.Remove(documento);
                await _context.SaveAsync();
            }
            catch(DbUpdateException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });  
            }
            return RedirectToAction(nameof(Show)
                        , new { projetoId = documento.ProjetoId
                                , message = string.Format("Documento [ {0} ] excluído com sucesso !"
                                    , documento.Titulo) });
        }

        public async Task<IActionResult> Download(string filename)
        {
            var stream = await FileDownloadHelper.Download(_pathToStore, filename);
            return File(stream, FileDownloadHelper.GetContentType(filename), filename);
        }
        
    }
}