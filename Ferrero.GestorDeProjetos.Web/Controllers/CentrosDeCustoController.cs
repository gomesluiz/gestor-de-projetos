using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using System;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class CentrosDeCustoController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CentrosDeCustoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CentrosDeCusto
        public async Task<IActionResult> Index(string message)
        {
            try 
            {
              var centros = await _context.CentrosDeCusto.ToListAsync(); 

              ViewBag.StatusMessage = message;
              return View(centros);
            }
            catch (DbException e)
            {
              ViewBag.StatusMessage = 
                  "Erro: Não é possível consultar os dados de centros de custo. "  
                + "Motivo: " + e.Message + " "
                + "Tente novamente, e se o problema persistir " 
                + "entre em contato com o administrador do sistema.";
            }
            return View();
        }

        // GET: CentrosDeCusto/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CentrosDeCusto/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id, Nome")] CentroDeCusto centroDeCusto)
        {
            bool ExisteCentroDeCusto = _context.CentrosDeCusto.Any(cc => cc.Id == centroDeCusto.Id);
            if (ExisteCentroDeCusto == true)
            {
              ModelState.AddModelError("Id", "Este centro de custo já existe!");
            }

            if (ModelState.IsValid)
            {
                try 
                {
                  _context.Add(centroDeCusto);
                  await _context.SaveChangesAsync();
                  return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Centro de Custo [{0}] incluído com sucesso!"
                                , centroDeCusto.Nome)});
                }
                catch (DbUpdateException e)
                {
                  ModelState.AddModelError("", 
                        "Não é possível incluir este centro de custo. " 
                    +   "Motivo: " + e.Message + " "
                    +   "Tente novamente, e se o problema persistir " 
                    +   "entre em contato com o administrador do sistema.");
                }
            }
            return View(centroDeCusto);
        }

        // GET: CentrosDeCusto/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try{
              var centroDeCusto = await _context.CentrosDeCusto.FindAsync(id);
              if (centroDeCusto == null)
              {
                  return NotFound();
              }
              return View(centroDeCusto);
            }
            catch(DbException e)
            {
              ModelState.AddModelError("", 
                      "Não é possível modificar este ativo. " 
                    + "Motivo: " + e.Message + " " 
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: CentrosDeCusto/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Nome")] CentroDeCusto centroDeCusto)
        {
            if (id != centroDeCusto.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(centroDeCusto);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Centro de Custo [{0}] atualizado com sucesso!"
                                , centroDeCusto.Nome)});
                }
                catch (DbUpdateConcurrencyException e)
                {
                    if (!CentroDeCustoExists(centroDeCusto.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        ModelState.AddModelError("", 
                              "Não é possível editar este centro de custo. " 
                            + "Motivo: " + e.Message + " "
                            + "Tente novamente, e se o problema persistir "  
                            + "entre em contato com o administrador do sistema.");
                    }
                }
            }
            return View(centroDeCusto);
        }

        // GET: CentrosDeCusto/Delete/5
        public async Task<IActionResult> Delete(int? id, string message)
        {
            if (id == null)
            {
                return NotFound();
            }
            if (!String.IsNullOrEmpty(message))
            {
              ModelState.AddModelError("", 
                      "Não é possível remover este centro de custo. " 
                    + "Motivo: " + message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }
            try 
            {
              var centroDeCusto = await _context.CentrosDeCusto
                .FirstOrDefaultAsync(m => m.Id == id);
              if (centroDeCusto == null)
              {
                return NotFound();
              }
              return View(centroDeCusto);
            }
            catch(DbException e)
            {
              ModelState.AddModelError("", 
                          "Não é possível consultar consultar dados deste centro de custo. " 
                          + "Motivo: " + e.Message + " "
                          + "Tente novamente, e se o problema persistir " 
                          + "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: CentrosDeCusto/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
          try{
            
            var centroDeCusto = await _context
                .CentrosDeCusto
                .FindAsync(id);

            var ativo = await _context.Ativos
                .Include(a => a.CentroDeCusto)
                .FirstOrDefaultAsync(a => a.CentroDeCusto.Id == centroDeCusto.Id);

            if (ativo == null)
            {
                _context.CentrosDeCusto.Remove(centroDeCusto);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index)
                                    , new { message = string.Format("Centro de Custo [{0}] excluído com sucesso!"
                                    , centroDeCusto.Nome)});
            }
            else
            {
                return RedirectToAction(nameof(Delete)
                        , new { id = id, message = "Este centro de custo possui ativos associados a ele." }
                    );
            }
          } 
          catch(DbUpdateException e)
          {
            return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });
          }
        }

        private bool CentroDeCustoExists(int id)
        {
            return _context.CentrosDeCusto.Any(e => e.Id == id);
        }
    }
}