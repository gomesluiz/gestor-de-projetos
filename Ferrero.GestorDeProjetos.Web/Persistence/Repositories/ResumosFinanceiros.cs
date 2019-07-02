using System.Linq;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Repositories
{
    public class ResumosFinanceiros : IResumosFinanceiros
    {
        private const string ResumoFinanceiroQuery =
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

        private readonly ProjetosDBContext _context;

        public ResumosFinanceiros(ProjetosDBContext context) => _context = context;
        public IQueryable<ResumoFinanceiro> GetAllResumosFinanceiros()
        {
            var resumos = _context
                .ResumosFinanceiros
                .FromSql(ResumoFinanceiroQuery);
                
            return resumos;
        }

        public ResumoFinanceiro GetResumoFinanceiroBy(int id)
        {
            var query = ResumoFinanceiroQuery + " WHERE oiv.Id = {0} "; 
            var resumo = _context
                .ResumosFinanceiros
                .FromSql(query, id)
                .FirstOrDefault();

            return resumo;
        }
    }
}
