using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models.ChartJs;
using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    [Route("dashboard")]
    public class DashboardFinanceiroController : Controller
    {
        private readonly UnitOfWork _unitOfWork;

        public DashboardFinanceiroController(ApplicationDbContext context)
        {
            _unitOfWork = new UnitOfWork(context);
        }

        // Get: Dashboard
        [Route("show/{id}")]
        public async Task<IActionResult> Show(int id)
        {
            var projetos = await _unitOfWork
                .Portifolio
                .FindAsync(e => e.Id == id, includeProperties: "OrdemDeInvestimento");
                
            var projeto  = projetos.FirstOrDefault();

            ViewBag.NomeDoProjeto = projeto.Nome;   
            ViewBag.NumeroDaOrdemDeInvestimento = projeto.OrdemDeInvestimento.Numero;
            return View();
        }

        // Get: DonutChartData
        [Route("donut/{numero}")]
        public async Task<JsonResult> DonutChartData(string numero)
        {
            var resumos = await _unitOfWork.Resumos.FindAsync(
                filter:e => e.OrdemDeInvestimento.Numero == numero
                , orderBy: e => e.OrderBy(s => s.OrdemDeInvestimento.Numero)
                , includeProperties:"OrdemDeInvestimento"
            );

            var resumo = resumos.LastOrDefault();

            Chart chart = new Chart();

            if (resumo != null){
                chart.labels = new string[] { "Actual", "Commitment", "Assigned", "Available" };

                List<Datasets> dataSet = new List<Datasets>();
                dataSet.Add(new Datasets()
                {
                    label = $"Ordem de Investimento: {numero}",
                    data = new decimal[] { resumo.Actual, resumo.Commitment, resumo.Assigned, resumo.Available },
                    backgroundColor = new string[] { "#FF0000", "#800000", "#808000", "#008080" },
                    borderColor = new string[] { "#FF0000", "#800000", "#808000", "#008080" },
                    borderWidth = "1",
                    fill = "true"
                });

                chart.datasets = new List<Datasets>();
                chart.datasets = dataSet;
            }

            return Json(chart);
        }

        // Get: LineChartData
        [Route("line/{numero}")]
        public async Task<JsonResult> LineChartData(string numero)
        {
            Chart chart = new Chart(); 
            
            chart.datasets = new List<Datasets>(); 
            List<Datasets> dataSet = new List<Datasets>(); 
            
            var resumos = await _unitOfWork.Resumos.FindAsync(
                filter:e => e.OrdemDeInvestimento.Numero == numero
                , orderBy: e => e.OrderBy(s => s.OrdemDeInvestimento.Numero)
                , includeProperties:"OrdemDeInvestimento"
            );
            
        
            
            int n = ((IList<ResumoFinanceiro>)resumos).Count;  
            decimal[] budgets     = new decimal[n];
            decimal[] actuals     = new decimal[n];
            decimal[] commitments = new decimal[n];
            decimal[] assigneds   = new decimal[n];
            decimal[] availables  = new decimal[n];
            
            chart.labels = new string[n]; 

            var i = 0;
            foreach (var resumo in resumos)
            {
                budgets[i]      = resumo.OrdemDeInvestimento.Budget;
                actuals[i]      = resumo.Actual;
                commitments[i]  = resumo.Commitment;
                assigneds[i]    = resumo.Assigned;
                availables[i]   = resumo.Available;
                chart.labels[i] = resumo.Data.ToString("dd-MM-yyyy");
                i += 1;
            } 

            dataSet.Add(new Datasets() 
            { 
                label = "Budget", 
                data = budgets, 
                borderColor = new string[] { "#2980B9" }, 
                backgroundColor = new string[] { "#2980B9" }, 
                borderWidth = "2" ,
                fill = "false"
            });

            dataSet.Add(new Datasets() 
            { 
                label = "Actual", 
                data = actuals, 
                borderColor = new string[] { "#8E44AD" }, 
                backgroundColor = new string[] { "#8E44AD" }, 
                borderWidth = "2" ,
                fill = "false"
            }); 

            dataSet.Add(new Datasets() 
            { 
                label = "Commitment", 
                data =commitments, 
                borderColor = new string[] { "#800000" }, 
                backgroundColor = new string[] { "#800000" }, 
                borderWidth = "2", 
                fill = "false"
            }); 
            dataSet.Add(new Datasets() 
            { 
                label = "Assigned", 
                data = assigneds, 
                borderColor = new string[] { "#808000" }, 
                backgroundColor = new string[] { "#808000" }, 
                borderWidth = "2",
                fill = "false"
            });
            dataSet.Add(new Datasets() 
            { 
                label = "Available", 
                data = availables, 
                borderColor = new string[] { "#008080" }, 
                backgroundColor = new string[] { "#008080" }, 
                borderWidth = "2",
                fill = "false"
            });
            
            chart.datasets = dataSet; 
            return Json(chart);
        }
    }
}