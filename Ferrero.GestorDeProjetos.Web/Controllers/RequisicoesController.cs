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
  public class RequisicoesController : Controller
  {
    private readonly ProjetosDBContext _context;

    public RequisicoesController(ProjetosDBContext context)
    {
        _context = context;
    }

    // GET: Requisicoes
    public async Task<IActionResult> Index()
    {
        return View(await _context.Requisicoes.ToListAsync());
    }

    // GET: Requisicoes/Create
    public IActionResult Create()
    {
      PopulateAtivosDropDownList();
      return View();
    }

    // POST: Requisicoes/Create
    // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
    // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(
      [Bind("Numero,Data,NumeroDaOrdemDeCompra,Valor,Descricao,AtivoId")] RequisicaoViewModel requisicaoViewModel
    )
    {
        if (ExisteRequisicao(requisicaoViewModel.Numero))
        {
          ModelState.AddModelError("Numero", "Esta requisição já existe!");
        }

        if (ModelState.IsValid)
        {
          try {
            Requisicao requisicao = ConvertToModel(requisicaoViewModel);
            _context.Add(requisicao);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
          }
          catch(DbException)
          {
            ModelState.AddModelError("", "Não é possível incluir esta requisição. " + 
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.");  
          }
        }
        
        PopulateAtivosDropDownList(requisicaoViewModel.AtivoId);
        return View(requisicaoViewModel);
    }

    // GET: Requisicoes/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
      if (id == null)
      {
          return NotFound();
      }

      try
      {
        var requisicao = await _context.Requisicoes
          .Include(m => m.Ativo)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id);
        if (requisicao == null)
        {
            return NotFound();
        }

        RequisicaoViewModel requisicaoViewModel = ConvertToViewModel(requisicao);
        PopulateAtivosDropDownList(requisicaoViewModel.AtivoId);  
        return View(requisicao);
      }
      catch(DbException)
      {
        ModelState.AddModelError("", "Não é possível editar esta requisição. " + 
              "Tente novamente, e se o problema persistir " + 
              "entre em contato com o administrador do sistema.");
      }

      return View();
    }

  

  // POST: Requisicoes/Edit/5
  // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
  // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
  [HttpPost]
      [ValidateAntiForgeryToken]
      public async Task<IActionResult> Edit(int id, [Bind("Id,Numero,Data,NumeroDaOrdemDeCompra,Valor,Descricao,Localizacao")] Requisicao requisicao)
      {
          if (id != requisicao.Id)
          {
              return NotFound();
          }

          if (ModelState.IsValid)
          {
              try
              {
                  _context.Update(requisicao);
                  await _context.SaveChangesAsync();
              }
              catch (DbUpdateConcurrencyException)
              {
                  if (!ExisteRequisicao(requisicao.Numero))
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
          return View(requisicao);
      }

      // GET: Requisicoes/Delete/5
      public async Task<IActionResult> Delete(int? id)
      {
          if (id == null)
          {
              return NotFound();
          }

          var requisicao = await _context.Requisicoes
              .FirstOrDefaultAsync(m => m.Id == id);
          if (requisicao == null)
          {
              return NotFound();
          }

          return View(requisicao);
      }

      // POST: Requisicoes/Delete/5
      [HttpPost, ActionName("Delete")]
      [ValidateAntiForgeryToken]
      public async Task<IActionResult> DeleteConfirmed(int id)
      {
          var requisicao = await _context.Requisicoes.FindAsync(id);
          _context.Requisicoes.Remove(requisicao);
          await _context.SaveChangesAsync();
          return RedirectToAction(nameof(Index));
      }
      private void PopulateAtivosDropDownList(object ativoSelcionado = null)
      {
          var ativos = from aa in _context.Ativos
                                  orderby aa.Id
                                  select aa;
          ViewBag.AtivoId = new SelectList(ativos.AsNoTracking(), "Id", "Descricao", ativoSelcionado);
      }
      private bool ExisteRequisicao(long numero)
      {
          return _context.Requisicoes.Any(e => e.Numero == numero);
      }
    private  Requisicao ConvertToModel(RequisicaoViewModel requisicaoViewModel)
    {
      return new Requisicao {
          Id = requisicaoViewModel.Id,
          Numero = requisicaoViewModel.Numero,
          Data = requisicaoViewModel.Data,
          NumeroDaOrdemDeCompra = requisicaoViewModel.NumeroDaOrdemDeCompra,
          Valor = requisicaoViewModel.Valor,
          Descricao = requisicaoViewModel.Descricao,
          Ativo = _context.Ativos.Find(requisicaoViewModel.AtivoId)
        };
    }
    private RequisicaoViewModel ConvertToViewModel(Requisicao requisicao)
    {
      return new RequisicaoViewModel {
              Id = requisicao.Id,
              Numero = requisicao.Numero,
              Data = requisicao.Data,
              NumeroDaOrdemDeCompra = requisicao.NumeroDaOrdemDeCompra,
              Valor = requisicao.Valor, 
              Descricao = requisicao.Descricao,
              AtivoId = requisicao.Ativo.Id
            };
    }
  }
}
