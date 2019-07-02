using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models.ChartJs;
using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    [Route("dashboard")]
    public class DashboardFinanceiroController : Controller
    {
        private readonly ResumosFinanceiros _resumos;

        public DashboardFinanceiroController(ProjetosDBContext context)
        {
            _resumos = new ResumosFinanceiros(context);
        }

        // Get: Dashboard
        [Route("show/{id}")]
        public IActionResult Show(int ordemDeInvestimentoId)
        {
            ViewData["OrdemDeInvestimento"] = ordemDeInvestimentoId;
            return View();
        }

        // Get: DonutChartData
        [Route("donut/{id}")]
        public async Task<JsonResult> DonutChartData(int id)
        {
            ResumoFinanceiro resumo = await Task.FromResult(_resumos.GetResumoFinanceiroBy(id));

            Chart chart = new Chart();
            chart.labels = new string[] { "Actual", "Commitment", "Assigned", "Available" };

            List<Datasets> dataSet = new List<Datasets>();
            dataSet.Add(new Datasets()
            {
                label = $"Ordem de Investimento: {id}",
                data = new double[] { resumo.Actual, resumo.Commitment, resumo.Assigned, resumo.Available },
                backgroundColor = new string[] { "#FF0000", "#800000", "#808000", "#008080" },
                borderColor = new string[] { "#FF0000", "#800000", "#808000", "#008080" },
                borderWidth = "1",
                fill = "true"
            });

            chart.datasets = new List<Datasets>();
            chart.datasets = dataSet;

            return Json(chart);
        }

        // Get: LineChartData
        [Route("line/{id}")]
        public JsonResult LineChartData(int id)
        {
            Chart chart = new Chart(); 
            chart.labels = new string[] { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December" }; 
            chart.datasets = new List<Datasets>(); 
            List<Datasets> dataSet = new List<Datasets>(); 
            dataSet.Add(new Datasets() 
            { 
                label = "Actual", 
                data = new double[] { 28, 48, 40, 19, 86, 27, 90, 20, 45, 65, 34, 22 }, 
                borderColor = new string[] { "#FF0000" }, 
                backgroundColor = new string[] { "#FF0000" }, 
                borderWidth = "2" ,
                fill = "false"
            }); 
            dataSet.Add(new Datasets() 
            { 
                label = "Commitment", 
                data = new double[] { 60, 50, 75, 80, 50, 45, 35, 50, 60, 70, 80, 30 }, 
                borderColor = new string[] { "#800000" }, 
                backgroundColor = new string[] { "#800000" }, 
                borderWidth = "2", 
                fill = "false"
            }); 
            dataSet.Add(new Datasets() 
            { 
                label = "Assigned", 
                data = new double[] { 30, 50, 45, 25, 90, 30, 95, 25, 50, 70, 40, 30 }, 
                borderColor = new string[] { "#808000" }, 
                backgroundColor = new string[] { "#808000" }, 
                borderWidth = "2",
                fill = "false"
            });
            dataSet.Add(new Datasets() 
            { 
                label = "Available", 
                data = new double[] { 20, 40, 35, 10, 80, 20, 85, 15, 40, 60, 30, 16 }, 
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
