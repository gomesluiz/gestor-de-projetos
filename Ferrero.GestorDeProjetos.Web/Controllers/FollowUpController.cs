using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Data;

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
    }
}
