using System;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Models.Domain;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class DocumentosController : Controller
    {
        private readonly UnitOfWork _context;
        public DocumentosController(ApplicationDbContext context)
        {
            _context = new UnitOfWork(context);
        }

        // GET: DocumentoViewModel
        public async Task<IActionResult> Show(int projetoId)
        {
            try
            {   
                var documentos = await _context
                    .Documentos
                    .FindAsync(
                          e => e.ProjetoId == projetoId
                        , includeProperties: "Projeto"
                    );
                
                return View(documentos.ToList().Select(d=> (DocumentoViewModel)d));
            }
            catch (DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível exibir os documentos do projeto. " 
                    + "Motivo: " + e.Message + ". "  
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // GET: Documento/Create
        public IActionResult Create(int projetoId)
        {
            ViewBag.Projeto = _context.Portifolio.Get(projetoId);
            
            return View();
        }

        // POST: Documento/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(DocumentoViewModel documentoViewModel)
        {
            if (ModelState.IsValid)
            {
                try 
                {
                    _context.Documentos.Add((Documento) documentoViewModel);
                    await _context.SaveAsync();

                    return RedirectToAction(nameof(Show), new { projetoId = documentoViewModel.ProjetoId });
                }
                catch(DbException e)
                {
                    ModelState.AddModelError(""
                        , "Não é possível incluir este documento. " 
                        + "Motivo: " + e.Message + ". "
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema.");  
                }
            }

            ViewBag.Projeto = _context.Portifolio.Get(documentoViewModel.ProjetoId);
            return View(documentoViewModel);
        }

        // GET: Documento/Edit/{id}
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var documento = await FindDocumentoBy(id);
                if (documento == null) return NotFound();
            
                return View((DocumentoViewModel) documento);
            }
            catch(DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível editar este documento. " 
                    + "Motivo: " + e.Message + ". "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            
            return View();
        }

        // POST: Documento/Edit/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, DocumentoViewModel documentoViewModel)
        {
            if (id != documentoViewModel.Id) return NotFound();
         
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Documentos.Update((Documento) documentoViewModel);
                    await _context.SaveAsync();

                    return RedirectToAction(nameof(Show), new { projetoId = documentoViewModel.ProjetoId });
                }
                catch (DbUpdateException e)
                {
                    ModelState.AddModelError(""
                    , "Não é possível editar este documento. " 
                    + "Motivo: " + e.Message + ". "
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
                    + "Motivo: " + errorMessage + ". "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }

            try
            {  
                var documento = await FindDocumentoBy(id);
                if (documento == null) return NotFound();

                return View((DocumentoViewModel) documento);
            }
            catch(DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível excluir este documento. " 
                    + "Motivo: " + e.Message + ". "
                    + "Tente novamente, e se o problema persistir "  
                    + "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: Tarefa/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            Documento documento;
            try
            {
                documento = await FindDocumentoBy(id);
                _context.Documentos.Remove(documento);
                await _context.SaveAsync();
            }
            catch(DbUpdateException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, errorMessage = e.Message });  
            }
            return RedirectToAction(nameof(Show), new { projetoId = documento.ProjetoId });
        }

        private async Task<Documento> FindDocumentoBy(int? id)
        {
            var documentos = await _context.Documentos
                .FindAsync(e => e.Id == id, includeProperties: "Projeto");

            return documentos.FirstOrDefault();
        }
    }
}
