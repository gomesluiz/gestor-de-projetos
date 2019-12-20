using System;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using Ferrero.GestorDeProjetos.Web.Models.Domain;
using Ferrero.GestorDeProjetos.Web.Models.Security;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    [Authorize]
    public class AtivosController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IHostingEnvironment _env;
        private readonly UserManager<Usuario> _manager;
        public AtivosController(  ApplicationDbContext context
                                , UserManager<Usuario> manager
                                , IHostingEnvironment env)
        {
            _context    = context;
            _manager    = manager;
            _env = env;
        }

        // GET: Ativos
        public async Task<IActionResult> Index(string message)
        {   
           
            try
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

                ViewBag.StatusMessage = message;
                return View(await Task.FromResult(ativosViewModel.ToAsyncEnumerable()));
            }
            catch(Exception e)
            {
                ViewBag.StatusMessage =
                          "Erro: Não é possível exibir os projetos. "  
                        + "Motivo: " + e.Message + " " 
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema.";
            }

            return View();
        }

        // GET: Ativos/Create
        public async Task<IActionResult> Create()
        {
            try
            {
                var usuario = await _manager.GetUserAsync(User);
                PopulateOrdensDeInvestimentoDropDownList();
                PopulateCentrosDeCustoDropDownList();
                return View(new AtivoViewModel(usuario.FullName));
            }
            catch(Exception e)
            {
                ModelState.AddModelError("", "Não é possível incluir este ativo. " + 
                    "Motivo: " + e.Message + " " +
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Show(int id)
        {
            try
            {
                var ativo =   await _context.Ativos
                    .Include(e => e.CentroDeCusto)
                    .Include(e => e.OrdemDeInvestimento)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Id == id);

                return View(ConvertToViewModel(ativo));
            }
            catch(Exception e)
            {
                ModelState.AddModelError("", "Não é possível imprimir este ativo. " + 
                    "Motivo: " + e.Message + " " +
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: Ativos/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(AtivoViewModel ativoViewModel)
        {
            if (!String.IsNullOrEmpty(ativoViewModel.Numero))
            {
                bool ExisteAtivo = _context.Ativos.Any(e => e.Numero == ativoViewModel.Numero);
                if (ExisteAtivo == true)
                {
                    ModelState.AddModelError("Numero", "Este número da ativo já foi utilizado!");
                }
            }

            if (ModelState.IsValid)
            {
                try {
                    Ativo ativo = ConvertToModel(ativoViewModel);
                    _context.Add(ativo);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Ativo [{0}] incluído com sucesso!"
                                , ativoViewModel.Numero)});
                }
                catch(DbUpdateException e)
                {
                    ModelState.AddModelError("", "Não é possível incluir este ativo. " + 
                        "Motivo: " + e.Message + " " +
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
            catch(DbException e)
            {
              ModelState.AddModelError("", "Não é possível editar este ativo. " + 
                    "Motivo: " + e.Message + " " +
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: Ativos/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, AtivoViewModel ativoViewModel)
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
                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Ativo [{0}] atualizado com sucesso!"
                                , ativoViewModel.Numero)});
                }
                catch (DbUpdateConcurrencyException e)
                {
                    if (!AtivoExists(ativoViewModel.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                      ModelState.AddModelError("", "Não é possível editar este ativo. " +
                        "Motivo: "  + e.Message + " " +
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
                    }
                }
            }
            PopulateOrdensDeInvestimentoDropDownList(ativoViewModel.OrdemDeInvestimentoId);
            PopulateCentrosDeCustoDropDownList(ativoViewModel.CentroDeCustoId);
            return View(ativoViewModel);
        }

        // GET: Ativos/Delete/5
        public async Task<IActionResult> Delete(int? id, string message="")
        {
          if (id == null)
          {
              return NotFound();
          }
          if (message != "")
          {
            ModelState.AddModelError(""
                , "Não é possível remover este ativo. " 
                + "Motivo : " + message + " "
                + "Tente novamente, e se o problema persistir " 
                + "entre em contato com o administrador do sistema.");
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
          catch(DbException e)
          {
            ModelState.AddModelError("", "Não é possível remover este ativo. " + 
                  "Motivo: " + e.Message + " " +
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

                var requisicao = await _context.RequisicoesDeCompra
                        .Include(a => a.Ativo)
                        .FirstOrDefaultAsync(r => r.Ativo.Id == id);

                if (requisicao == null)
                {
                    var ativo = await _context.Ativos.FindAsync(id);
                    _context.Ativos.Remove(ativo);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index)
                                , new { message = string.Format("Ativo [{0}] foi excluído com sucesso!"
                                , ativo.Numero)});
                }
                else 
                {
                    return RedirectToAction(nameof(Delete)
                        , new { id = id, message = "Este ativo possui requisições associadas a ele." }
                    );
                }
                
            } 
            catch(DbUpdateException e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });
            }
        }

        private bool AtivoExists(int id)
        {
          return _context.Ativos.Any(e => e.Id == id);
        }

        private  Ativo ConvertToModel(AtivoViewModel ativoViewModel)
        {
          return new Ativo {
              Id = ativoViewModel.Id,
              Numero = ativoViewModel.Numero,
              Descricao = ativoViewModel.Descricao,
              OrdemDeInvestimento = _context.OrdensDeInvestimento.Find(ativoViewModel.OrdemDeInvestimentoId), 
              CentroDeCusto = _context.CentrosDeCusto.Find(ativoViewModel.CentroDeCustoId),
              Planta = ativoViewModel.Planta,
              Quantidade = ativoViewModel.Quantidade,
              Divisao = ativoViewModel.Divisao,
              Natureza = ativoViewModel.Natureza,
              Propriedade = ativoViewModel.Propriedade,
              UsoNoAdministrativo = ativoViewModel.UsoNoAdministrativo,
              UsoNoProcessoFabril = ativoViewModel.UsoNoProcessoFabril,
              ProntoParaUso = ativoViewModel.ProntoParaUso,
              MaquinaEmMontagemInstalacao = ativoViewModel.MaquinaEmMontagemInstalacao,
              EdificacaoEmAndamento = ativoViewModel.EdificacaoEmAndamento,
              Observacoes = ativoViewModel.Observacoes,
              Requisitante = ativoViewModel.Requisitante,
              SituacaoDoAtivo = ativoViewModel.SituacaoDoAtivo,
            };
        }

        private  AtivoViewModel ConvertToViewModel(Ativo ativo)
        {
          return new AtivoViewModel() {
                Id = ativo.Id,
                Numero = ativo.Numero,
                Descricao = ativo.Descricao,
                OrdemDeInvestimentoId = ativo.OrdemDeInvestimento.Id,
                OrdemDeInvestimentoNumero = ativo.OrdemDeInvestimento.Numero,
                CentroDeCustoId = ativo.CentroDeCusto.Id,
                CentroDeCustoNome = ativo.CentroDeCusto.Nome,
                Planta = ativo.Planta,
                Quantidade = ativo.Quantidade,
                Divisao = ativo.Divisao,
                Natureza = ativo.Natureza,
                Propriedade = ativo.Propriedade,
                UsoNoAdministrativo = ativo.UsoNoAdministrativo,
                UsoNoProcessoFabril = ativo.UsoNoProcessoFabril,
                ProntoParaUso = ativo.ProntoParaUso,
                MaquinaEmMontagemInstalacao = ativo.MaquinaEmMontagemInstalacao,
                EdificacaoEmAndamento = ativo.EdificacaoEmAndamento,
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
                                   select new {Id = cc.Id, Id_Nome = cc.Id + " " + cc.Nome};
            ViewBag.CentroDeCustoId = new SelectList(centros.AsNoTracking(), "Id", "Id_Nome" , centroDeCustoSelecionado);
        }
    }
}
