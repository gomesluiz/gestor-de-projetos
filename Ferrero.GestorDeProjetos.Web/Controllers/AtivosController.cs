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
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class AtivosController : Controller
    {
        private readonly ProjetosDBContext _context;

        public AtivosController(ProjetosDBContext context)
        {
            _context = context;
        }

        // GET: Ativos
        public async Task<IActionResult> Index()
        {
            return View(await _context.Ativos.ToListAsync());
        }

        // GET: Ativos/Create
        public IActionResult Create()
        {
            PopulateOrdensDeInvestimentoDropDownList();
            PopulateCentrosDeCustoDropDownList();
            return View();
        }

        // POST: Ativos/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
          [Bind("Id, Descricao, Localizacao, OrdemDeInvestimentoId, CentroDeCustoId, Situacao")] AtivoViewModel ativoViewModel
        )
        {
            bool ExisteAtivo = _context.Ativos.Any(e => e.Id == ativoViewModel.Id);
            if (ExisteAtivo == true)
            {
              ModelState.AddModelError("Id", "Este ativo já existe!");
            }

            if (ModelState.IsValid)
            {
                try {
                Ativo ativo = ConvertToModel(ativoViewModel);
                _context.Add(ativo);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
                }
                catch(DbUpdateException)
                {
                  ModelState.AddModelError("", "Não é possível incluir este ativo. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
                }
            }

            PopulateOrdensDeInvestimentoDropDownList(ativoViewModel.OrdemDeInvestimentoId);
            PopulateCentrosDeCustoDropDownList(ativoViewModel.CentroDeCustoId);
            return View(ativoViewModel);
        }

        // GET: Ativos/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
              var ativo = await _context.Ativos
                .Include(e => e.CentroDeCusto)
                .Include(e => e.OrdemDeInvestimento)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id)
                ;
              if (ativo == null)
              {
                return NotFound();
              }

              AtivoViewModel ativoViewModel = ConvertToViewModel(ativo);
              PopulateOrdensDeInvestimentoDropDownList(ativoViewModel.OrdemDeInvestimentoId);
              PopulateCentrosDeCustoDropDownList(ativoViewModel.CentroDeCustoId);
              return View(ativoViewModel);
            }
            catch(DbException)
            {
              ModelState.AddModelError("", "Não é possível editar este ativo. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: Ativos/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, 
          [Bind("Id,Descricao,Localizacao,OrdemDeInvestimento,CentroDeCustoId,Situacao")] AtivoViewModel ativoViewModel)
        {
            
            if (id != ativoViewModel.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    Ativo ativo = ConvertToModel(ativoViewModel);
                    _context.Update(ativo);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AtivoExists(ativoViewModel.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                      ModelState.AddModelError("", "Não é possível editar este ativo. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            PopulateOrdensDeInvestimentoDropDownList(ativoViewModel.OrdemDeInvestimentoId);
            PopulateCentrosDeCustoDropDownList(ativoViewModel.CentroDeCustoId);
            return View(ativoViewModel);
        }

        // GET: Ativos/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
          if (id == null)
          {
              return NotFound();
          }

          try
          {
            var ativo = await _context.Ativos
                .Include(e => e.CentroDeCusto)
                .Include(e => e.OrdemDeInvestimento)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
            if (ativo == null)
            {
              return NotFound();
            }
            AtivoViewModel ativoViewModel = ConvertToViewModel(ativo);
            PopulateOrdensDeInvestimentoDropDownList(ativoViewModel.OrdemDeInvestimentoId);
            PopulateCentrosDeCustoDropDownList(ativoViewModel.CentroDeCustoId);
            return View(ativoViewModel);
          }
          catch(DbException)
          {
            ModelState.AddModelError("", "Não é possível remover este ativo. " + 
                  "Tente novamente, e se o problema persistir " + 
                  "entre em contato com o administrador do sistema.");
          }
          return View();
        }

        // POST: Ativos/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
          var ativo = await _context.Ativos.FindAsync(id);
          _context.Ativos.Remove(ativo);
          await _context.SaveChangesAsync();
          return RedirectToAction(nameof(Index));
        }

        private bool AtivoExists(int id)
        {
          return _context.Ativos.Any(e => e.Id == id);
        }

        private  Ativo ConvertToModel(AtivoViewModel ativoViewModel)
        {
          return new Ativo {
              Id = ativoViewModel.Id,
              Descricao = ativoViewModel.Descricao,
              Localizacao = ativoViewModel.Localizacao,
              OrdemDeInvestimento = _context.OrdensDeInvestimento.Find(ativoViewModel.OrdemDeInvestimentoId), 
              Situacao = ativoViewModel.Situacao,
              CentroDeCusto = _context.CentrosDeCusto.Find(ativoViewModel.CentroDeCustoId)
            };
        }

        private  AtivoViewModel ConvertToViewModel(Ativo ativo)
        {
          return new AtivoViewModel {
              Id = ativo.Id,
              Descricao = ativo.Descricao,
              Localizacao = ativo.Localizacao,
              OrdemDeInvestimentoId = ativo.OrdemDeInvestimento.Id, 
              Situacao = ativo.Situacao,
              CentroDeCustoId = ativo.CentroDeCusto.Id
            };
        }
        
        private void PopulateOrdensDeInvestimentoDropDownList(object ordemDeInvestimentoSelecionado = null)
        {
            var ordensDeInvestimento = from e in _context.OrdensDeInvestimento
                                   orderby e.Numero
                                   select e;
            ViewBag.OrdemDeInvestimentoId = new SelectList(ordensDeInvestimento.AsNoTracking()
              , "Id", "Numero", ordemDeInvestimentoSelecionado);
        }

        private void PopulateCentrosDeCustoDropDownList(object centroDeCustoSelecionado = null)
        {
            var centros = from cc in _context.CentrosDeCusto
                                   orderby cc.Id
                                   select cc;
            ViewBag.CentroDeCustoId = new SelectList(centros.AsNoTracking(), "Id", "Nome"
              , centroDeCustoSelecionado);
        }
    }
}
