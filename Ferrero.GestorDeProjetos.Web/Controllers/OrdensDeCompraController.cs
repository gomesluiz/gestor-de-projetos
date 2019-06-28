using System;
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
using Ferrero.GestorDeProjetos.Web.Models.Helpers;
using System.Collections.Generic;

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
    public async Task<IActionResult> Create(OrdemDeCompraViewModel vm, IFormFile Arquivo)
    {
        if (ExisteOrdemDeCompra(vm.Numero))
        {
          ModelState.AddModelError("Numero", "Esta ordem de compra já existe!");
        }
        
        try
        {
            await Upload(vm, Arquivo);
        } 
        catch(IOException)
        {
            ModelState.AddModelError("", "Não é possível gravar o documento da ordem de compra. " + 
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.");
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Add(ConvertToModel(vm));
                await _context.SaveChangesAsync();

                return RedirectToAction(nameof(Index));
            }
            catch (DbException)
            {
                ModelState.AddModelError("", "Não é possível incluir esta ordem de compra. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");  
            }
            
        }
        
        PopulateAtivosDropDownList(vm.AtivoId);
        return View(vm);
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
        var model = await _context.OrdensDeCompra
            .Include(m => m.Ativo)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id);
        if (model == null)
        {
            return NotFound();
        }

        OrdemDeCompraViewModel vm = ConvertToViewModel(model);
        PopulateAtivosDropDownList(vm.AtivoId);  
        return View(vm);
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
    public async Task<IActionResult> Edit(int id, OrdemDeCompraViewModel vm, IFormFile Arquivo)
    {
        if (id != vm.Id)
        {
            return NotFound();
        }

        try
        {
            await Upload(vm, Arquivo);
        } 
        catch(IOException)
        {
            ModelState.AddModelError("", "Não é possível gravar o documento da ordem de compra. " + 
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.");
        }

        if (ModelState.IsValid)
        {
          try
          {
              OrdemDeCompra model = ConvertToModel(vm);
              _context.Update(model);
              await _context.SaveChangesAsync();
          }
          catch (DbUpdateConcurrencyException)
          {
              if (!ExisteOrdemDeCompra(vm.Numero))
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

        PopulateAtivosDropDownList(vm.AtivoId);  
        return View(vm);
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

    public async Task<IActionResult> Download(string filename)
    {
        var downloader = new FileDownloadHelper();
        var pathToDownload = Path.Combine(_hostingEnvironment.WebRootPath, "docs", "ocs");
        var stream = await downloader.Download(pathToDownload, filename);
        return File(stream, downloader.GetContentType(filename), filename);
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

    private async Task Upload(OrdemDeCompraViewModel vm, IFormFile Arquivo)
    { 
        string fileName = string.Empty;

        if (vm.Documento != null && Arquivo == null)
            return;

        if (Arquivo == null || Arquivo.Length == 0)
        {
            ModelState.AddModelError("", "Documento da ordem de compra não foi selecionado!");
            return;
        }
        
        string extensao = Path.GetExtension(Arquivo.FileName);
        if (extensao != ".pdf"){
            ModelState.AddModelError("", "Documento da ordem deve ser um  do tipo PDF!");
            return;
        }
        
        var pathToUpload = Path.Combine(_hostingEnvironment.WebRootPath, "docs", "ocs");
        FileUploadHelper uploader = new FileUploadHelper();
        fileName = await uploader.SaveFileAsync(
            Arquivo
            , pathToUpload
            , "oc_" + vm.Numero + ".pdf"
        );
        vm.Documento = fileName;
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
          Documento = viewModel.Documento
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
              Documento = model.Documento
            };
    }

   
    }
}
