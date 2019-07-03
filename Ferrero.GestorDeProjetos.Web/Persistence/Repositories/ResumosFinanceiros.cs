using System.Linq;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Ferrero.GestorDeProjetos.Web.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Repositories
{
    public class ResumosFinanceiros : IResumosFinanceiros
    {
        private const string ResumoFinanceiroQuery =
                @"SELECT    oiv.Id		  AS Id,
                            oiv.Numero 	AS Numero,
                            prj.Id		  AS ProjetoId,
                            prj.Nome		AS NomeDoProjeto,
                            oiv.Valor	  AS Bugdget,
                            (ISNULL(com.Valor, 0.00) + ISNULL(ass.Valor, 0))	AS Actual,
                            ISNULL(com.Valor, 0.00)	 AS Commitment,
                            ISNULL(ass.Valor, 0.00)	 AS Assigned,
                            (oiv.Valor - (ISNULL(com.Valor, 0.00) + ISNULL(ass.Valor, 0.00)))	AS Available,
                            GETDATE() As DateOfWeek
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
        private const string ResumoFinanceiroPorSemanaQuery =
                @"SELECT  oiv.Id		  AS Id,
                            oiv.Numero 	AS Numero,
                            prj.Id		  AS ProjetoId,
                            prj.Nome		AS NomeDoProjeto,
                            oiv.Valor	  AS Bugdget,
                            (ISNULL(com.Valor, 0.00) + ISNULL(ass.Valor, 0))	AS Actual,
                            ISNULL(com.Valor, 0.00)	 AS Commitment,
                            ISNULL(ass.Valor, 0.00)	 AS Assigned,
                            (oiv.Valor - (ISNULL(com.Valor, 0.00) + ISNULL(ass.Valor, 0.00)))	AS Available,
                            GETDATE() As DateOfWeek
                        FROM OrdensDeInvestimento  AS oiv 
                        INNER JOIN Projetos  AS prj 
                            ON prj.Id = oiv.ProjetoId
                        LEFT JOIN (SELECT atv.OrdemDeInvestimentoId, SUM(oc.VALOR)  AS Valor
                                    FROM OrdensDeCompra AS oc
                                    INNER JOIN Ativos	   AS atv 
                                        ON atv.Id = oc.AtivoId
                                    WHERE oc.Data <= {1}
                                GROUP BY atv.OrdemDeInvestimentoId) AS com 
                            ON com.OrdemDeInvestimentoId = oiv.Id
                        LEFT JOIN (SELECT atv.OrdemDeInvestimentoId, 
                                            SUM(nf.Valor)  	AS Valor 
                                    FROM OrdensDeCompra 	AS oc
                                    INNER JOIN NotasFiscais AS nf 
                                        ON nf.OrdemDeCompraId = oc.Id
                                    INNER JOIN Ativos	AS atv 
                                        ON atv.Id = oc.AtivoId 
                                    WHERE nf.DataDeLancamento <= {1}			  
                                    GROUP BY atv.OrdemDeInvestimentoId) AS ass
                            ON ass.OrdemDeInvestimentoId = oiv.Id";
        private const string IntervaloQuery =
            @"SELECT MIN(oc.[Data]) AS DataDeInicio,    
                     CASE 
                        WHEN MAX(oc.Data) >= ISNULL(MAX(nf.DataDeLancamento), MAX(oc.Data)) THEN MAX(oc.Data)
                        ELSE MAX(nf.DataDeLancamento)
                     END AS DataDeTermino
                FROM  OrdensDeCompra AS oc
                INNER JOIN Ativos     AS av
                    ON av.Id = oc.AtivoId
                LEFT JOIN NotasFiscais AS nf 
                    ON nf.OrdemDeCompraId = oc.Id
                WHERE av.OrdemDeInvestimentoId = {0}";

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

        public List<ResumoFinanceiro> GetResumoFinanceiroByWeek(int id)
        {
            var intervalo = _context
                .IntervaloDeData
                .FromSql(IntervaloQuery, id)
                .FirstOrDefault();

            var query = ResumoFinanceiroPorSemanaQuery + " WHERE oiv.Id = {0} ";
            
            List<ResumoFinanceiro> resultado = new List<ResumoFinanceiro>();
            
            for (var dt = intervalo.DataDeInicio; dt <= intervalo.DataDeTermino; dt = dt.AddDays(7)){     
                var resumo = _context
                    .ResumosFinanceiros
                    .FromSql(query, id, dt)
                    .FirstOrDefault();
                resumo.DateOfWeek = dt;
            }

            return resultado;
        }
    }
}
