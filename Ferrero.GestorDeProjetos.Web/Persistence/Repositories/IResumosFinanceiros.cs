using System.Linq;
using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Repositories
{
    public interface IResumosFinanceiros
    {
        IQueryable<ResumoFinanceiro> GetAllResumosFinanceiros();
        ResumoFinanceiro GetResumoFinanceiroBy(int id);

        
    }
}
