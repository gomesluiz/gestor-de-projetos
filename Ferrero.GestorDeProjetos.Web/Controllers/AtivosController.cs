using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.ViewModels;
using System.Collections.Generic;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class AtivosController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AtivosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Ativos
        public async Task<IActionResult> Index()
        {   
            
            var ativos = await _context.Ativos
                .Include(e => e.CentroDeCusto)
                .Include(e => e.OrdemDeInvestimento)
                .AsNoTracking()
                .ToListAsync();

            var ativosViewModel = new List<AtivoViewModel>();
            foreach(Ativo ativo in  ativos){
                ativosViewModel.Add(ConvertToViewModel(ativo));
            }
            
            return View(await Task.FromResult(ativosViewModel.ToAsyncEnumerable()));
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
          [Bind("Id, Descricao, OrdemDeInvestimentoId," + 
                "CentroDeCustoId, Planta, Quantidade,"  + 
                "Divisao, Natureza, Propriedade," + 
                "DestinoDeUso, SituacaoParaUso, Observacoes," +
                "Requisitante, SituacaoDoAtivo")] AtivoViewModel ativoViewModel
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
          [Bind("Id, Descricao, OrdemDeInvestimentoId," + 
                "CentroDeCustoId, Planta, Quantidade,"  + 
                "Divisao, Natureza, Propriedade," + 
                "DestinoDeUso, SituacaoParaUso, Observacoes," +
                "Requisitante, SituacaoDoAtivo")] AtivoViewModel ativoViewModel
        )
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
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
          if (id == null)
          {
              return NotFound();
          }
          if (saveChangesError.GetValueOrDefault())
          {
            ModelState.AddModelError("", "Não é possível remover este ativo. " + 
                  "Tente novamente, e se o problema persistir " + 
                  "entre em contato com o administrador do sistema.");
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
          try{
            var ativo = await _context.Ativos.FindAsync(id);
            _context.Ativos.Remove(ativo);
            await _context.SaveChangesAsync();
          } 
          catch(DbUpdateException)
          {
            return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });
          }
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
              OrdemDeInvestimento = _context.OrdensDeInvestimento.Find(ativoViewModel.OrdemDeInvestimentoId), 
              CentroDeCusto = _context.CentrosDeCusto.Find(ativoViewModel.CentroDeCustoId),
              Planta = ativoViewModel.Planta,
              Quantidade = ativoViewModel.Quantidade,
              Divisao = ativoViewModel.Divisao,
              Natureza = ativoViewModel.Natureza,
              Propriedade = ativoViewModel.Propriedade,
              DestinoDeUso = ativoViewModel.DestinoDeUso,
              SituacaoParaUso = ativoViewModel.SituacaoParaUso,
              Observacoes = ativoViewModel.Observacoes,
              Requisitante = ativoViewModel.Requisitante,
              SituacaoDoAtivo = ativoViewModel.SituacaoDoAtivo,
            };
        }

        private  AtivoViewModel ConvertToViewModel(Ativo ativo)
        {
          return new AtivoViewModel {
              Id = ativo.Id,
              Descricao = ativo.Descricao,
              OrdemDeInvestimentoId = ativo.OrdemDeInvestimento.Id,
              CentroDeCustoId = ativo.CentroDeCusto.Id ,
              Planta = ativo.Planta,
              Quantidade = ativo.Quantidade,
              Divisao = ativo.Divisao,
              Natureza = ativo.Natureza,
              Propriedade = ativo.Propriedade,
              DestinoDeUso = ativo.DestinoDeUso,
              SituacaoParaUso = ativo.SituacaoParaUso,
              Observacoes = ativo.Observacoes,
              Requisitante = ativo.Requisitante,
              SituacaoDoAtivo = ativo.SituacaoDoAtivo
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
