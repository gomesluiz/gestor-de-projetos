using System.Collections.Generic;

namespace Ferrero.GestorDeProjetos.Web.Models.Gantt
{
    public class GanttViewModel
    {
        public IEnumerable<AtividadeViewModel> data { get; set; }
        public IEnumerable<VinculoViewModel> links { get; set; }
    }
}