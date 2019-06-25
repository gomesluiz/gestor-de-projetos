using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Data;
using Ferrero.GestorDeProjetos.Web.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
  public class OrdensDeCompraController : Controller
  {
    private readonly ProjetosDBContext _context;
    private readonly IHostingEnvironment _hostingEnvironment;

    public OrdensDeCompraController(ProjetosDBContext context, 
                                    IHostingEnvironment hostingEnvironment)
    {
        _context = context;
        _hostingEnvironment = hostingEnvironment;
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
        [Bind("Id, Numero, Data, NumeroDaRequisicao, Valor, Descricao, AtivoId", "Documento")] OrdemDeCompraViewModel viewModel
        , IFormFile Arquivo)
    {
        if (ExisteOrdemDeCompra(viewModel.Numero))
        {
          ModelState.AddModelError("Numero", "Esta ordem de compra já existe!");
        }
        if (Arquivo == null || Arquivo.Length == 0)
        {
            ModelState.AddModelError("", "Documento da ordem de compra não foi selecionado!");
        }
        if (ModelState.IsValid)
        {
          try {
            viewModel.Documento = Arquivo;
            string nomeUnicoDocumento = null;
            string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "docs/oc");
            nomeUnicoDocumento = "oc_" + viewModel.Numero.ToString();
            string filePath = Path.Combine(uploadsFolder, nomeUnicoDocumento); 
            await viewModel.Documento.CopyToAsync(new FileStream(filePath, FileMode.Create));
            viewModel.DocumentoPath = filePath;
            
            OrdemDeCompra oc = ConvertToModel(viewModel);
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
        
        PopulateAtivosDropDownList(viewModel.AtivoId);
        return View(viewModel);
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
    public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
    {
      if (id == null)
      {
          return NotFound();
      }
      if (saveChangesError.GetValueOrDefault())
      {
        ModelState.AddModelError("", "Não é possível remover esta ordem de compra. " + 
              "Tente novamente, e se o problema persistir " + 
              "entre em contato com o administrador do sistema.");
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
      try
      {
        var oc = await _context.OrdensDeCompra.FindAsync(id);
        _context.OrdensDeCompra.Remove(oc);
        await _context.SaveChangesAsync();
      }
      catch(DbUpdateException)
      {
        return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
      }
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

    private  OrdemDeCompra ConvertToModel(OrdemDeCompraViewModel viewModel)
    {
      return new OrdemDeCompra {
          Id = viewModel.Id,
          Numero = viewModel.Numero,
          Data = DateTime.ParseExact(viewModel.Data, "dd/MM/yyyy", null),
          NumeroDaRequisicao = viewModel.NumeroDaRequisicao,
          Valor = viewModel.Valor,
          Descricao = viewModel.Descricao,
          Ativo = _context.Ativos.Find(viewModel.AtivoId),
          DocumentoPath = viewModel.DocumentoPath
        };
    }
    
    private OrdemDeCompraViewModel ConvertToViewModel(OrdemDeCompra model)
    {
      return new OrdemDeCompraViewModel {
              Id = model.Id,
              Numero = model.Numero,
              Data = model.Data.ToString("dd/MM/yyyy"),
              NumeroDaRequisicao = model.NumeroDaRequisicao,
              Valor = model.Valor, 
              Descricao = model.Descricao,
              AtivoId = model.Ativo.Id,
              DocumentoPath = model.DocumentoPath
            };
    }
  }
}
