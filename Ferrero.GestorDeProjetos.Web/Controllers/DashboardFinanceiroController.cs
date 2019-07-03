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
        public async Task<JsonResult> LineChartData(int id)
        {
            Chart chart = new Chart(); 
            chart.labels = new string[]{}; 
            chart.datasets = new List<Datasets>(); 
            List<Datasets> dataSet = new List<Datasets>(); 
            double[] actualData = new double[]{};
            double[] commitmentData = new double[]{};
            double[] assignedData = new double[]{};
            double[] availableData = new double[]{};
            
            List<ResumoFinanceiro> resumos = await Task.FromResult(_resumos.GetResumoFinanceiroByWeek(id));
            
            for (int i = 0; i < resumos.Count; i++)
            {
                ResumoFinanceiro resumo = resumos[i];
                actualData[i] = resumo.Actual;
                commitmentData[i] = resumo.Commitment;
                assignedData[i]   = resumo.Assigned;
                availableData[i]  = resumo.Available;
                chart.labels[i] = resumo.DateOfWeek.ToString("dd-MM-yyyy");
            } 

            dataSet.Add(new Datasets() 
            { 
                label = "Actual", 
                data = actualData, 
                borderColor = new string[] { "#FF0000" }, 
                backgroundColor = new string[] { "#FF0000" }, 
                borderWidth = "2" ,
                fill = "false"
            }); 
            dataSet.Add(new Datasets() 
            { 
                label = "Commitment", 
                data =commitmentData, 
                borderColor = new string[] { "#800000" }, 
                backgroundColor = new string[] { "#800000" }, 
                borderWidth = "2", 
                fill = "false"
            }); 
            dataSet.Add(new Datasets() 
            { 
                label = "Assigned", 
                data = assignedData, 
                borderColor = new string[] { "#808000" }, 
                backgroundColor = new string[] { "#808000" }, 
                borderWidth = "2",
                fill = "false"
            });
            dataSet.Add(new Datasets() 
            { 
                label = "Available", 
                data = availableData, 
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
