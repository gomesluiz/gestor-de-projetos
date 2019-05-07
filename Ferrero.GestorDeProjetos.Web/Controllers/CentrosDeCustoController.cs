using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Data;
using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class CentrosDeCustoController : Controller
    {
        private readonly ProjetosDBContext _context;

        public CentrosDeCustoController(ProjetosDBContext context)
        {
            _context = context;
        }

        // GET: CentrosDeCusto
        public async Task<IActionResult> Index()
        {
            return View(await _context.CentrosDeCusto.ToListAsync());
        }

        // GET: CentrosDeCusto/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var centroDeCusto = await _context.CentrosDeCusto
                .FirstOrDefaultAsync(m => m.Id == id);
            if (centroDeCusto == null)
            {
                return NotFound();
            }

            return View(centroDeCusto);
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
        public async Task<IActionResult> Create([Bind("Id,Nome")] CentroDeCusto centroDeCusto)
        {
            if (ModelState.IsValid)
            {
                _context.Add(centroDeCusto);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
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

            var centroDeCusto = await _context.CentrosDeCusto.FindAsync(id);
            if (centroDeCusto == null)
            {
                return NotFound();
            }
            return View(centroDeCusto);
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
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CentroDeCustoExists(centroDeCusto.Id))
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
            return View(centroDeCusto);
        }

        // GET: CentrosDeCusto/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var centroDeCusto = await _context.CentrosDeCusto
                .FirstOrDefaultAsync(m => m.Id == id);
            if (centroDeCusto == null)
            {
                return NotFound();
            }

            return View(centroDeCusto);
        }

        // POST: CentrosDeCusto/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var centroDeCusto = await _context.CentrosDeCusto.FindAsync(id);
            _context.CentrosDeCusto.Remove(centroDeCusto);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CentroDeCustoExists(int id)
        {
            return _context.CentrosDeCusto.Any(e => e.Id == id);
        }
    }
}
