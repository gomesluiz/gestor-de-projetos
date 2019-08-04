using System.Collections.Generic;

namespace Ferrero.GestorDeProjetos.Web.Models.ViewModels
{
    public class GanttViewModel
    {
        public IEnumerable<TaskViewModel> data { get; set; }
        public IEnumerable<LinkViewModel> links { get; set; }
    }
}