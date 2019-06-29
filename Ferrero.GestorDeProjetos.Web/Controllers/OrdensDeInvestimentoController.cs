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
    public class OrdensDeInvestimentoController : Controller
    {
    private const string Sql = 
              @"SELECT  oiv.Id		  AS Id,
                        oiv.Numero 	AS Numero,
                        prj.Id		  AS ProjetoId,
                        prj.Nome		AS NomeDoProjeto,
                        oiv.Valor	  AS Bugdget,
                        (ISNULL(com.Valor, 0.00) + ISNULL(ass.Valor, 0))	AS Actual,
                          ISNULL(com.Valor, 0.00)	 AS Commitment,
                          ISNULL(ass.Valor, 0.00)	 AS Assigned,
                        (oiv.Valor - (ISNULL(com.Valor, 0.00) + ISNULL(ass.Valor, 0.00)))	AS Available
                      FROM OrdensDeInvestimento  AS oiv 
                     INNER JOIN Projetos  AS prj 
                        ON prj.Id = oiv.ProjetoId
                      LEFT JOIN (SELECT atv.OrdemDeInvestimentoId, SUM(oc.VALOR)  AS Valor
                                   FROM OrdensDeCompra AS oc
                                  INNER JOIN Ativos	   AS atv 
                                     ON atv.Id = oc.AtivoId
                               GROUP BY atv.OrdemDeInvestimentoId) AS com 
                        ON com.OrdemDeInvestimentoId = oiv.Id
                      LEFT JOIN (SELECT atv.OrdemDeInvestimentoId, 
                                        SUM(nf.Valor)  	AS Valor 
                                   FROM OrdensDeCompra 	AS oc
                                  INNER JOIN NotasFiscais AS nf 
                                     ON nf.OrdemDeCompraId = oc.Id
                                  INNER JOIN Ativos	AS atv 
                                    ON atv.Id = oc.AtivoId 			  
                                  GROUP BY atv.OrdemDeInvestimentoId) AS ass
                        ON ass.OrdemDeInvestimentoId = oiv.Id";
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
          [Bind("Id, Numero, ProjetoId, Valor")] OrdemDeInvestimentoViewModel ordemDeInvestimentoViewModel
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

          try
          {
              
            var ordemDeInvestimento = await _context.OrdensDeInvestimento
              .Include(m => m.Projeto)
              .AsNoTracking()
              .FirstOrDefaultAsync(m => m.Id == id);
            if (ordemDeInvestimento == null)
            {
              return NotFound();
            }

            OrdemDeInvestimentoViewModel ordemDeInvestimentoViewModel = ConvertToViewModel(ordemDeInvestimento);
            PopulateProjetosDropDownList(ordemDeInvestimentoViewModel.ProjetoId);
            return View(ordemDeInvestimentoViewModel);
          }
          catch(DbException)
          {
            ModelState.AddModelError("", "Não é possível editar esta ordem de serviço. " + 
              "Tente novamente, e se o problema persistir " + 
              "entre em contato com o administrador do sistema.");
          }
          return View();
        }

        // POST: OrdensDeInvestimento/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, 
          [Bind("Id, Numero, ProjetoId, Valor")] OrdemDeInvestimentoViewModel ordemDeInvestimentoViewModel
        )
        {
            if (id != ordemDeInvestimentoViewModel.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    OrdemDeInvestimento ordemDeInvestimento = ConvertToModel(ordemDeInvestimentoViewModel);
                    _context.Update(ordemDeInvestimento);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrdemDeInvestimentoExists(ordemDeInvestimentoViewModel.Id))
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
            return View(ordemDeInvestimentoViewModel);
        }

        // GET: OrdensDeInvestimento/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
          if (id == null)
          {
              return NotFound();
          }
          if (saveChangesError.GetValueOrDefault())
          {
            ModelState.AddModelError("", "Não é possível remover esta ordem de investimento. " + 
                  "Tente novamente, e se o problema persistir " + 
                  "entre em contato com o administrador do sistema.");
          }
          try
          {
            var ordemDeInvestimento = await _context.OrdensDeInvestimento
                .Include(m => m.Projeto)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id);
            if (ordemDeInvestimento == null)
            {
                return NotFound();
            }

            OrdemDeInvestimentoViewModel ordemDeInvestimentoViewModel = ConvertToViewModel(ordemDeInvestimento);
            PopulateProjetosDropDownList(ordemDeInvestimentoViewModel.ProjetoId);
            return View(ordemDeInvestimentoViewModel);
          }
          catch(DbException)
          {
            ModelState.AddModelError("", "Não é possível remover esta ordem de investimento. " + 
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.");
          }
          return View();
        }

        // POST: OrdensDeInvestimento/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
          try
          {
            var ordemDeInvestimento = await _context.OrdensDeInvestimento.FindAsync(id);
            _context.OrdensDeInvestimento.Remove(ordemDeInvestimento);
            await _context.SaveChangesAsync();
          }
          catch(DbUpdateException)
          {
            return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
          }
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
        private  OrdemDeInvestimentoViewModel ConvertToViewModel(OrdemDeInvestimento ordemDeInvestimento)
        {
          return new OrdemDeInvestimentoViewModel {
              Id = ordemDeInvestimento.Id,
              Numero = ordemDeInvestimento.Numero,
              ProjetoId = ordemDeInvestimento.Projeto.Id,
              Valor = ordemDeInvestimento.Valor,
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
