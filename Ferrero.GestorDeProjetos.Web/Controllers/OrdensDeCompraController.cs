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
  public class OrdensDeCompraController : Controller
  {
    private readonly ProjetosDBContext _context;

    public OrdensDeCompraController(ProjetosDBContext context)
    {
        _context = context;
    }

    // GET: OrdensDeCompra
    public async Task<IActionResult> Index()
    {
        return View(await _context.OrdensDeCompra.ToListAsync());
    }

    // GET: OrdensDeCompra/Create
    public IActionResult Create()
    {
      PopulateAtivosDropDownList();
      return View();
    }

    // POST: OrdensDeCompra/Create
    // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
    // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(
      [Bind("Numero, Data, NumeroDaRequisicao, Valor, Descricao, AtivoId")] OrdemDeCompraViewModel ordemDeCompraViewModel
    )
    {
        if (ExisteOrdemDeCompra(ordemDeCompraViewModel.Numero))
        {
          ModelState.AddModelError("Numero", "Esta ordem de compra já existe!");
        }

        if (ModelState.IsValid)
        {
          try {
            OrdemDeCompra oc = ConvertToModel(ordemDeCompraViewModel);
            _context.Add(oc);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
          }
          catch(DbException)
          {
            ModelState.AddModelError("", "Não é possível incluir esta ordem de compra. " + 
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.");  
          }
        }
        
        PopulateAtivosDropDownList(ordemDeCompraViewModel.AtivoId);
        return View(ordemDeCompraViewModel);
    }

    // GET: OrdensDeCompra/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
      if (id == null)
      {
          return NotFound();
      }

      try
      {
        var oc = await _context.OrdensDeCompra
            .Include(m => m.Ativo)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id);
        if (oc == null)
        {
            return NotFound();
        }

        OrdemDeCompraViewModel ordemDeCompraViewModel = ConvertToViewModel(oc);
        PopulateAtivosDropDownList(ordemDeCompraViewModel.AtivoId);  
        return View(ordemDeCompraViewModel);
      }
      catch(DbException)
      {
        ModelState.AddModelError("", "Não é possível editar esta ordem de compra. " + 
              "Tente novamente, e se o problema persistir " + 
              "entre em contato com o administrador do sistema.");
      }

      return View();
    }

    // POST: OrdensDeCompra/Edit/5
    // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
    // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, 
      [Bind("Id, Numero, Data, NumeroDaRequisicao, Valor, Descricao, AtivoId")] OrdemDeCompraViewModel ordemDeCompraViewModel)
    {
        if (id != ordemDeCompraViewModel.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
          try
          {
              OrdemDeCompra oc = ConvertToModel(ordemDeCompraViewModel);
              _context.Update(oc);
              await _context.SaveChangesAsync();
          }
          catch (DbUpdateConcurrencyException)
          {
              if (!ExisteOrdemDeCompra(ordemDeCompraViewModel.Numero))
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

        PopulateAtivosDropDownList(ordemDeCompraViewModel.AtivoId);  
        return View(ordemDeCompraViewModel);
    }

    // GET: OrdensDeCompra/Delete/5
    public async Task<IActionResult> Delete(int? id)
    {
      if (id == null)
      {
          return NotFound();
      }

      try
      {
        var oc = await _context.OrdensDeCompra
          .Include(m => m.Ativo)
          .AsNoTracking()
          .FirstOrDefaultAsync(m => m.Id == id);
        if (oc == null)
        {
            return NotFound();
        }

        OrdemDeCompraViewModel ordemDeCompraViewModel = ConvertToViewModel(oc);
        PopulateAtivosDropDownList(ordemDeCompraViewModel.AtivoId);  
        return View(ordemDeCompraViewModel);
      }
      catch(DbException)
      {
        ModelState.AddModelError("", "Não é possível remover esta ordem de compra. " + 
              "Tente novamente, e se o problema persistir " + 
              "entre em contato com o administrador do sistema.");
      }

      return View();
    }

    // POST: OrdensDeCompra/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var oc = await _context.OrdensDeCompra.FindAsync(id);
        _context.OrdensDeCompra.Remove(oc);
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
    private bool ExisteOrdemDeCompra(long numero)
    {
        return _context.OrdensDeCompra.Any(e => e.Numero == numero);
    }

    private  OrdemDeCompra ConvertToModel(OrdemDeCompraViewModel ordemDeCompraViewModel)
    {
      return new OrdemDeCompra {
          Id = ordemDeCompraViewModel.Id,
          Numero = ordemDeCompraViewModel.Numero,
          Data = ordemDeCompraViewModel.Data,
          NumeroDaRequisicao = ordemDeCompraViewModel.NumeroDaRequisicao,
          Valor = ordemDeCompraViewModel.Valor,
          Descricao = ordemDeCompraViewModel.Descricao,
          Ativo = _context.Ativos.Find(ordemDeCompraViewModel.AtivoId)
        };
    }
    
    private OrdemDeCompraViewModel ConvertToViewModel(OrdemDeCompra oc)
    {
      return new OrdemDeCompraViewModel {
              Id = oc.Id,
              Numero = oc.Numero,
              Data = oc.Data,
              NumeroDaRequisicao = oc.NumeroDaRequisicao,
              Valor = oc.Valor, 
              Descricao = oc.Descricao,
              AtivoId = oc.Ativo.Id
            };
    }
  }
}
