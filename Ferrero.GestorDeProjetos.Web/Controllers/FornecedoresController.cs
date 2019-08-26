using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;
using System;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class FornecedoresController : Controller
    {
        private readonly ApplicationDbContext _context;

        public FornecedoresController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Fornecedores
        public async Task<IActionResult> Index(string message)
        {
            try 
            {
              var fornecedores = await _context.Fornecedores.ToListAsync();
              ViewBag.StatusMessage = message;
              return View(fornecedores);
            } 
            catch (DbException e)
            {
              ViewBag.StatusMessage =  
                "Erro: Não é possível consultar os dados de fornecedores. " + 
                "Motivo: " + e.Message + " " +
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.";
            }
            return View();
        }

        // GET: Fornecedores/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Fornecedores/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Nome")] Fornecedor fornecedor)
        {
            if (ModelState.IsValid)
            {
              try{
                _context.Add(fornecedor);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Fornecedor [{0}] incluído com sucesso!"
                                , fornecedor.Nome)});
              }
              catch (DbUpdateException e)
              {
                ModelState.AddModelError("", 
                  "Não é possível incluir este fornecedor. " + 
                  "Motivo: " + e.Message + " " +
                  "Tente novamente, e se o problema persistir " + 
                  "entre em contato com o administrador do sistema.");
              }
            }
            return View(fornecedor);
        }

        // GET: Fornecedores/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
              return NotFound();
            }

            try {
              var fornecedor = await _context.Fornecedores.FindAsync(id);
              if (fornecedor == null)
              {
                return NotFound();
              }
              return View(fornecedor);
            }
            catch (DbException e)
            {
              ModelState.AddModelError("", 
                  "Não é possível encontrar este fornecedor. " + 
                  "Motivo: " + e.Message + " " +
                  "Tente novamente, e se o problema persistir " + 
                  "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: Fornecedores/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Nome")] Fornecedor fornecedor)
        {
            if (id != fornecedor.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(fornecedor);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Fornecedor [{0}] atualizado com sucesso!"
                                , fornecedor.Nome)});
                }
                catch (DbUpdateConcurrencyException e)
                {
                    if (!FornecedorExists(fornecedor.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        ModelState.AddModelError("", 
                          "Não é possível editar este fornecedor. " + 
                          "Motivo: " + e.Message + " " +
                          "Tente novamente, e se o problema persistir " + 
                          "entre em contato com o administrador do sistema.");
                    }
                }
            }
            return View(fornecedor);
        }

        // GET: Fornecedores/Delete/5
        public async Task<IActionResult> Delete(int? id, string message)
        {
            if (id == null)
            {
                return NotFound();
            }
            if (!String.IsNullOrEmpty(message))
            {
              ModelState.AddModelError("", 
                    "Não é possível remover este fornecedor. " + 
                    "Motivo: " + message + " " +
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            try
            {
              var fornecedor = await _context.Fornecedores
                  .FirstOrDefaultAsync(m => m.Id == id);
              if (fornecedor == null)
              {
                  return NotFound();
              }
              return View(fornecedor);
            }
            catch(DbException e)
            {
              ModelState.AddModelError("", 
                    "Não é possível remover este fornecedor. " +
                    "Motivo: " + e.Message + " " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: Fornecedores/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var fornecedor = await _context.Fornecedores.FindAsync(id);

                var nota = await _context.NotasFiscais
                    .Include(f => f.Fornecedor)
                    .FirstOrDefaultAsync(n => n.Fornecedor.Id == fornecedor.Id);

                if (nota == null)
                {
                    _context.Fornecedores.Remove(fornecedor);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index)
                                        , new { message = string.Format("Fornecedor [{0}] incluído com sucesso!"
                                        , fornecedor.Nome)});
                }
                else 
                {
                    return RedirectToAction(nameof(Delete)
                        , new { id = id, message = "Este fornecedor possui notas fiscais associadas a ele." }
                    );
                }
            }
            catch(DbUpdateException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });  
            }
        }
        public ActionResult GetFornecedoresPorNome(string term)
        {
            var fornecedores = _context
                .Fornecedores
                .Where(c => c.Nome.StartsWith(term))
                .Select(m => new {label = m.Nome, id = m.Id});
            
            return Json(fornecedores);
        }
        private bool FornecedorExists(int id)
        {
            return _context.Fornecedores.Any(e => e.Id == id);
        }
    }
}
