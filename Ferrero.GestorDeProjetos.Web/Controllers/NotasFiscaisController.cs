using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Data;
using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class NotasFiscaisController : Controller
    {
        private readonly ProjetosDBContext _context;

        public NotasFiscaisController(ProjetosDBContext context)
        {
            _context = context;
        }

        // GET: NotasFiscais
        public async Task<IActionResult> Index()
        {
            return View(await _context.NotasFiscais.ToListAsync());
        }

        // GET: NotasFiscais/Create
        public IActionResult Create()
        {
            PopulateFornecedoresDropDownList();
            PopulateOrdensDeCompraDropDownList();
            return View();
        }

        // POST: NotasFiscais/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
          [Bind("Id, Numero, DataDeLancamento, FornecedorId, OrdemDeCompraId, Migo, Valor")] NotaFiscalViewModel notaFiscalViewModel)
        {
            if (ExisteNotaFiscal(notaFiscalViewModel.Numero, notaFiscalViewModel.FornecedorId))
            {
              ModelState.AddModelError("Numero", "Esta nota fiscal já existe!");
            }

            if (ModelState.IsValid)
            {
              try {
                NotaFiscal notaFiscal = ConvertToModel(notaFiscalViewModel);
                _context.Add(notaFiscal);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
              }
              catch(DbException)
              {
                ModelState.AddModelError("", "Não é possível incluir esta nota fiscal. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");  
              }
            }

            PopulateFornecedoresDropDownList(notaFiscalViewModel.FornecedorId);
            PopulateOrdensDeCompraDropDownList(notaFiscalViewModel.OrdemDeCompraId);
            return View(notaFiscalViewModel);
        }

        // GET: NotasFiscais/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
          if (id == null)
          {
              return NotFound();
          }

          try
          {
            var notaFiscal = await _context.NotasFiscais
                .Include(e => e.Fornecedor)
                .Include(e => e.OrdemDeCompra)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
            if (notaFiscal == null)
            {
                return NotFound();
            }
            NotaFiscalViewModel notaFiscalViewModel = ConvertToViewModel(notaFiscal);
            PopulateFornecedoresDropDownList(notaFiscalViewModel.FornecedorId);
            PopulateOrdensDeCompraDropDownList(notaFiscalViewModel.OrdemDeCompraId);
            return View(notaFiscalViewModel);
          }
          catch(DbException)
          {
            ModelState.AddModelError("", "Não é possível editar esta nota fiscal. " + 
                  "Tente novamente, e se o problema persistir " + 
                  "entre em contato com o administrador do sistema.");
          }
          
          return View();
        }

        // POST: NotasFiscais/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Numero,DataDeLancamento,Migo,Valor")] NotaFiscal notaFiscal)
        {
            if (id != notaFiscal.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(notaFiscal);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ExisteNotaFiscal(notaFiscal.Id, 0))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(notaFiscal);
        }

        // GET: NotasFiscais/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var notaFiscal = await _context.NotasFiscais
                .FirstOrDefaultAsync(m => m.Id == id);
            if (notaFiscal == null)
            {
                return NotFound();
            }

            return View(notaFiscal);
        }

        // POST: NotasFiscais/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var notaFiscal = await _context.NotasFiscais.FindAsync(id);
            _context.NotasFiscais.Remove(notaFiscal);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private void PopulateFornecedoresDropDownList(object fornecedorSelecionado = null)
        {
          var fornecedores = from e in _context.Fornecedores
                                  orderby e.Nome
                                  select e;
          ViewBag.FornecedorId = new SelectList(fornecedores.AsNoTracking(), "Id", "Nome", fornecedorSelecionado);
        }

        private void PopulateOrdensDeCompraDropDownList(object ordemDeCompraSelecionada = null)
        {
          var ocs = from e in _context.OrdensDeCompra
                                  orderby e.Numero
                                  select e;
          ViewBag.OrdemDeCompraId = new SelectList(ocs.AsNoTracking(), "Id", "Numero", ordemDeCompraSelecionada);
        }

        private bool ExisteNotaFiscal(long Numero, int FornecedorId)
        {
            return _context.NotasFiscais.Any(e => e.Numero == Numero & e.Fornecedor.Id == FornecedorId);
        }

        private  NotaFiscal ConvertToModel(NotaFiscalViewModel notaFiscalViewModel)
        {
          return new NotaFiscal {
              Id = notaFiscalViewModel.Id,
              Numero = notaFiscalViewModel.Numero,
              DataDeLancamento = notaFiscalViewModel.DataDeLancamento,
              Fornecedor = _context.Fornecedores.Find(notaFiscalViewModel.FornecedorId),
              OrdemDeCompra = _context.OrdensDeCompra.Find(notaFiscalViewModel.OrdemDeCompraId),
              Migo = notaFiscalViewModel.Migo,
              Valor = notaFiscalViewModel.Valor
            };
        }

        private NotaFiscalViewModel ConvertToViewModel(NotaFiscal notaFiscal)
        {
          return new NotaFiscalViewModel {
              Id = notaFiscal.Id,
              Numero = notaFiscal.Numero,
              DataDeLancamento = notaFiscal.DataDeLancamento,
              FornecedorId = notaFiscal.Fornecedor.Id,
              OrdemDeCompraId = notaFiscal.OrdemDeCompra.Id,
              Migo = notaFiscal.Migo,
              Valor = notaFiscal.Valor
            };
        }
    }
}
