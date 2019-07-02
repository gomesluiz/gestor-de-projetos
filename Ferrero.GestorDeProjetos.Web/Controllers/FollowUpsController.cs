using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Data;
using Ferrero.GestorDeProjetos.Web.Models.ChartJs;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class FollowUpsController : Controller
    {
        private const string Sql =
                @"SELECT  oiv.Id		  AS Id,
                            oiv.Numero 	AS Numero,
                            prj.Id		  AS ProjetoId,
                            prj.Nome		AS NomeDoProjeto,
                            oiv.Valor	  AS Bugdget,
                            (ISNULL(com.Valor, 0.00) + ISNULL(ass.Valor, 0))	AS Actual,
                            ISNULL(com.Valor, 0.00)	 AS Commitment,
                            ISNULL(ass.Valor, 0.00)	 AS Assigned,
                            (oiv.Valor - (ISNULL(com.Valor, 0.00) + ISNULL(ass.Valor, 0.00)))	AS Available
                        FROM OrdensDeInvestimento  AS oiv 
                        INNER JOIN Projetos  AS prj 
                            ON prj.Id = oiv.ProjetoId
                        LEFT JOIN (SELECT atv.OrdemDeInvestimentoId, SUM(oc.VALOR)  AS Valor
                                    FROM OrdensDeCompra AS oc
                                    INNER JOIN Ativos	   AS atv 
                                        ON atv.Id = oc.AtivoId
                                GROUP BY atv.OrdemDeInvestimentoId) AS com 
                            ON com.OrdemDeInvestimentoId = oiv.Id
                        LEFT JOIN (SELECT atv.OrdemDeInvestimentoId, 
                                            SUM(nf.Valor)  	AS Valor 
                                    FROM OrdensDeCompra 	AS oc
                                    INNER JOIN NotasFiscais AS nf 
                                        ON nf.OrdemDeCompraId = oc.Id
                                    INNER JOIN Ativos	AS atv 
                                        ON atv.Id = oc.AtivoId 			  
                                    GROUP BY atv.OrdemDeInvestimentoId) AS ass
                            ON ass.OrdemDeInvestimentoId = oiv.Id";
        private readonly ProjetosDBContext _followUps;

        public FollowUpsController(ProjetosDBContext context)
        {
            _followUps = context;
        }

        // GET: Index
        public async Task<IActionResult> Index()
        {
            var resumos = await _followUps
                .ResumosFinanceiros
                .FromSql(Sql)
                .ToListAsync();

            return View(model: resumos);
        }

        // Get: Dashboard
        public IActionResult Dashboard(int OrdemDeInvestimentoId)
        {
            ViewData["OrdemDeInvestimento"] = OrdemDeInvestimentoId;
            return View();
        }

        // Get: DonutChartData
        public JsonResult DonutChartData()
        {
            Chart chart = new Chart();
            chart.labels = new string[] { "Actual", "Commitment", "Assigned", "Available" };
            chart.datasets = new List<Datasets>();
            List<Datasets> dataSet = new List<Datasets>();
            dataSet.Add(new Datasets()
            {
                label = "Current Year",
                data = new int[] { 28, 48, 40, 19 },
                backgroundColor = new string[] { "#FF0000", "#800000", "#808000", "#008080" },
                borderColor = new string[] { "#FF0000", "#800000", "#808000", "#008080" },
                borderWidth = "1",
                fill = "true"
            });
            chart.datasets = dataSet;

            return Json(chart);
        }

        // Get: LineChartData
        public JsonResult LineChartData()
        {
            Chart chart = new Chart(); 
            chart.labels = new string[] { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December" }; 
            chart.datasets = new List<Datasets>(); 
            List<Datasets> dataSet = new List<Datasets>(); 
            dataSet.Add(new Datasets() 
            { 
                label = "Actual", 
                data = new int[] { 28, 48, 40, 19, 86, 27, 90, 20, 45, 65, 34, 22 }, 
                borderColor = new string[] { "#FF0000" }, 
                backgroundColor = new string[] { "#FF0000" }, 
                borderWidth = "1" ,
                fill = "false"
            }); 
            dataSet.Add(new Datasets() 
            { 
                label = "Commitment", 
                data = new int[] { 60, 50, 75, 80, 50, 45, 35, 50, 60, 70, 80, 30 }, 
                borderColor = new string[] { "#800000" }, 
                backgroundColor = new string[] { "#800000" }, 
                borderWidth = "1", 
                fill = "false"
            }); 
            dataSet.Add(new Datasets() 
            { 
                label = "Assigned", 
                data = new int[] { 30, 50, 45, 25, 90, 30, 95, 25, 50, 70, 40, 30 }, 
                borderColor = new string[] { "#808000" }, 
                backgroundColor = new string[] { "#808000" }, 
                borderWidth = "1",
                fill = "false"
            });
            dataSet.Add(new Datasets() 
            { 
                label = "Available", 
                data = new int[] { 20, 40, 35, 10, 80, 20, 85, 15, 40, 60, 30, 16 }, 
                borderColor = new string[] { "#008080" }, 
                backgroundColor = new string[] { "#008080" }, 
                borderWidth = "1",
                fill = "false"
            });
            chart.datasets = dataSet; 
            return Json(chart);
        }
    }
}
