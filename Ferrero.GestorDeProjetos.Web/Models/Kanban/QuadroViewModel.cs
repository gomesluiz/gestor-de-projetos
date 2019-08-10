using System.Collections.Generic;
using System.Linq;

namespace Ferrero.GestorDeProjetos.Web.Models.Kanban
{
    public class QuadroViewModel
    {
        public List<ListaViewModel> Listas { get; set; }

        public QuadroViewModel(IEnumerable<TarefaViewModel> tarefas)
        {
            Listas = new List<ListaViewModel>();
            
            var aFazer  = new ListaViewModel("A Fazer"  , tarefas.Where(t => t.ListaId == 1).ToList(), "border-danger", true, false);
            var fazendo = new ListaViewModel("Fazendo"  , tarefas.Where(t => t.ListaId == 2).ToList(), "border-warning", false, false);
            var feito   = new ListaViewModel("Feito"    , tarefas.Where(t => t.ListaId == 3).ToList(), "border-success", false, true);
            
            Listas.Add(aFazer);
            Listas.Add(fazendo);
            Listas.Add(feito);
        }
    }
}