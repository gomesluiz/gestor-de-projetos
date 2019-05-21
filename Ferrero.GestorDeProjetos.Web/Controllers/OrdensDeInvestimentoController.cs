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
    public class OrdensDeInvestimentoController : Controller
    {
        private readonly ProjetosDBContext _context;

        public OrdensDeInvestimentoController(ProjetosDBContext context)
        {
            _context = context;
        }

        // GET: OrdensDeInvestimento
        public async Task<IActionResult> Index()
        {
            return View(await _context.OrdensDeInvestimento.ToListAsync());
        }

        // GET: OrdensDeInvestimento/Create
        public IActionResult Create()
        {
            PopulateProjetosDropDownList();
            return View();
        }

        // POST: OrdensDeInvestimento/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
          [Bind("Id, Numero, Valor, ProjetoId")] OrdemDeInvestimentoViewModel ordemDeInvestimentoViewModel
        )
        {
            bool ExisteOrdemDeInvestimento = _context.OrdensDeInvestimento.Any(
                prj => prj.Numero == ordemDeInvestimentoViewModel.Numero &&
                       prj.Projeto.Id == ordemDeInvestimentoViewModel.ProjetoId
            );
            if (ExisteOrdemDeInvestimento == true)
            {
              ModelState.AddModelError("ProjetoId", "Esta ordem de investimento já existe!");
            }
            if (ModelState.IsValid)
            {
                try {
                  OrdemDeInvestimento ordemDeInvestimento = ConvertToModel(ordemDeInvestimentoViewModel);
                  _context.Add(ordemDeInvestimento);
                  await _context.SaveChangesAsync();
                  return RedirectToAction(nameof(Index));
                } catch(DbUpdateException)
                {
                  ModelState.AddModelError("", "Não é possível incluir esta ordem de investimento. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
                }
            }
            PopulateProjetosDropDownList(ordemDeInvestimentoViewModel.ProjetoId);
            return View(ordemDeInvestimentoViewModel);
        }

    
    // GET: OrdensDeInvestimento/Edit/5
    public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ordemDeInvestimento = await _context.OrdensDeInvestimento.FindAsync(id);
            if (ordemDeInvestimento == null)
            {
                return NotFound();
            }
            return View(ordemDeInvestimento);
        }

        // POST: OrdensDeInvestimento/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Numero,Valor")] OrdemDeInvestimento ordemDeInvestimento)
        {
            if (id != ordemDeInvestimento.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(ordemDeInvestimento);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrdemDeInvestimentoExists(ordemDeInvestimento.Id))
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
            return View(ordemDeInvestimento);
        }

        // GET: OrdensDeInvestimento/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ordemDeInvestimento = await _context.OrdensDeInvestimento
                .FirstOrDefaultAsync(m => m.Id == id);
            if (ordemDeInvestimento == null)
            {
                return NotFound();
            }

            return View(ordemDeInvestimento);
        }

        // POST: OrdensDeInvestimento/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var ordemDeInvestimento = await _context.OrdensDeInvestimento.FindAsync(id);
            _context.OrdensDeInvestimento.Remove(ordemDeInvestimento);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool OrdemDeInvestimentoExists(int id)
        {
            return _context.OrdensDeInvestimento.Any(e => e.Id == id);
        }

        private OrdemDeInvestimento ConvertToModel(OrdemDeInvestimentoViewModel ordemDeInvestimentoViewModel)
        {
          return new OrdemDeInvestimento {
              Id = ordemDeInvestimentoViewModel.Id,
              Numero = ordemDeInvestimentoViewModel.Numero,
              Valor = ordemDeInvestimentoViewModel.Valor,
              Projeto = _context.Projetos.Find(ordemDeInvestimentoViewModel.ProjetoId), 
            };
        }

        private void PopulateProjetosDropDownList(object projetoSelecionado = null)
        {
            var projetos = from prj in _context.Projetos
                                   orderby prj.Id
                                   select prj;
            ViewBag.ProjetoId = new SelectList(projetos.AsNoTracking(), "Id", "Nome", projetoSelecionado);
        }
    }
}
