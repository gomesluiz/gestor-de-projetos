using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class ProjetosController : Controller
    {
        private readonly ProjetosDBContext _context;

        public ProjetosController(ProjetosDBContext context)
        {
            _context = context;
        }

        // GET: Projetos
        public async Task<IActionResult> Index()
        {
            var models = await _context
                .Projetos
                .Include(e => e.OrdemDeInvestimento)
                .ToListAsync();

            var viewModels = new List<ProjetoViewModel>();
            foreach(Projeto model in  models){
                viewModels.Add(ConvertToViewModel(model));
            }
            
            return View(await Task.FromResult(viewModels.ToAsyncEnumerable()));
        }

        // GET: Projetos/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Projetos/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProjetoViewModel viewModel)
        {
          if (ModelState.IsValid)
          {
            try
            {   
              var model = ConvertToModel(viewModel);

              _context.Add(model);
              await _context.SaveChangesAsync();

              return RedirectToAction(nameof(Index));
            }
            catch(DbUpdateException)
            {
              ModelState.AddModelError("", "Não é possível incluir este projeto. " + 
                "Tente novamente, e se o problema persistir " + 
                "entre em contato com o administrador do sistema.");
            }
          }
          return View(viewModel);
        }

        // GET: Projetos/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var model = await FindProjetoBy(id);
                if (model == null)
                {
                    return NotFound();
                }

                var viewModel = ConvertToViewModel(model);
                return View(viewModel);
            }
            catch (DbException)
            {
                ModelState.AddModelError("", "Não é possível editar este projeto. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: Projetos/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ProjetoViewModel viewModel)
        {
            if (id != viewModel.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    Projeto model = ConvertToModel(viewModel);

                    _context.Update(model);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProjetoExists(viewModel.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        ModelState.AddModelError("", "Não é possível editar este projeto. " + 
                        "Tente novamente, e se o problema persistir " + 
                        "entre em contato com o administrador do sistema.");
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(viewModel);
        }

        // GET: Projetos/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError=false)
        {
            if (id == null)
            {
                return NotFound();
            }
            if (saveChangesError.GetValueOrDefault())
            {
                ModelState.AddModelError("", "Não é possível remover este projeto. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            try
            { 
                var model = await FindProjetoBy(id);
                if (model == null)
                {
                    return NotFound();
                }

                var viewModel = ConvertToViewModel(model);
                return View(viewModel);
            }
            catch(DbException)
            {
                ModelState.AddModelError("", "Não é possível remover este projeto. " + 
                    "Tente novamente, e se o problema persistir " + 
                    "entre em contato com o administrador do sistema.");
            }
            return View();
        }

        // POST: Projetos/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var model = await FindProjetoBy(id);

                _context.Projetos.Remove(model);
                await _context.SaveChangesAsync();
            }
            catch(DbUpdateException)
            {
                return RedirectToAction(nameof(Delete), new { id = id, saveChangesError = true });  
            }
            return RedirectToAction(nameof(Index));
        }

        ///<summary>
        /// Returns TRUE if an Projeto class object exists, otherwise
        /// returns FALSE.     
        ///</summary>
        private bool ProjetoExists(int id)
        {
            return _context.Projetos.Any(e => e.Id == id);
        }

        ///<summary>
        /// Finds Project class object by Id.
        ///</summary>
        private async Task<Projeto> FindProjetoBy(int? id)
        {
            return await _context
                .Projetos
                .Include(e => e.OrdemDeInvestimento)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        ///<summary>
        /// Convert an object from ProjectViewModel class to an object from Project 
        /// class.
        ///</summary>
        private  Projeto ConvertToModel(ProjetoViewModel projetoViewModel)
        {
            return new Projeto {
                Id = projetoViewModel.Id,
                Nome = projetoViewModel.Nome,
                Descricao = projetoViewModel.Descricao,
                DataDeInicio = DateTime.ParseExact(projetoViewModel.DataDeInicio, "dd/MM/yyyy", null),
                DataDeTermino = DateTime.ParseExact(projetoViewModel.DataDeTermino, "dd/MM/yyyy", null),
                OrdemDeInvestimento = new OrdemDeInvestimento 
                {
                        Id = projetoViewModel.OrdemDeInvestimento.Id,
                        Numero = projetoViewModel.OrdemDeInvestimento.Numero,
                        Budget = projetoViewModel.OrdemDeInvestimento.Budget
                },
                Concluido = projetoViewModel.Concluido
            };
        }

        ///<summary>
        /// Convert an object from Project class to an object from ProjectViewModel 
        /// class.
        ///</summary>
        private  ProjetoViewModel ConvertToViewModel(Projeto projeto)
        {
          return new ProjetoViewModel {
                Id = projeto.Id,
                Nome = projeto.Nome,
                Descricao = projeto.Descricao,
                DataDeInicio = projeto.DataDeInicio.ToString("dd/MM/yyyy"),
                DataDeTermino = projeto.DataDeTermino.ToString("dd/MM/yyyy"),
                OrdemDeInvestimento = new OrdemDeInvestimentoViewModel 
                {
                    Id = projeto.OrdemDeInvestimento.Id,
                    Numero = projeto.OrdemDeInvestimento.Numero,
                    Budget = projeto.OrdemDeInvestimento.Budget
                },
                Concluido = projeto.Concluido
            };
        }
    }
}
