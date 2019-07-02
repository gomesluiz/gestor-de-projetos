using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class FornecedoresController : Controller
    {
        private readonly ProjetosDBContext _context;

        public FornecedoresController(ProjetosDBContext context)
        {
            _context = context;
        }

        // GET: Fornecedores
        public async Task<IActionResult> Index()
        {
            try 
            {
              var fornecedores = await _context.Fornecedores.ToListAsync();
              return View(fornecedores);
            } 
            catch (DbException)
            {
              ModelState.AddModelError("", "Não é possível consultar os dados de fornecedores. " + 
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.");
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
                return RedirectToAction(nameof(Index));
              }
              catch (DbUpdateException)
              {
                ModelState.AddModelError("", "Não é possível incluir este fornecedor. " + 
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
            catch (DbException)
            {
              ModelState.AddModelError("", "Não é possível encontrar este fornecedor. " + 
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
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!FornecedorExists(fornecedor.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        ModelState.AddModelError("", "Não é possível editar este fornecedor. " + 
                          "Tente novamente, e se o problema persistir " + 
                          "entre em contato com o administrador do sistema.");
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(fornecedor);
        }

        // GET: Fornecedores/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
            if (id == null)
            {
                return NotFound();
            }
            if (saveChangesError.GetValueOrDefault())
            {
              ModelState.AddModelError("", "Não é possível remover este fornecedor. " + 
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
            catch(DbException)
            {
              ModelState.AddModelError("", "Não é possível remover este fornecedor. " + 
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
            _context.Fornecedores.Remove(fornecedor);
            await _context.SaveChangesAsync();
          }
          catch(DbUpdateException)
          {
            return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
          }
          return RedirectToAction(nameof(Index));
        }

        private bool FornecedorExists(int id)
        {
            return _context.Fornecedores.Any(e => e.Id == id);
        }
    }
}
