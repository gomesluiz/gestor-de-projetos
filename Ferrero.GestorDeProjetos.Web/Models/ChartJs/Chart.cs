using System.Collections.Generic;
namespace Ferrero.GestorDeProjetos.Web.Models.ChartJs
{
    public class Chart
    {
        public string[] labels { get; set; }
        public List<Datasets> datasets { get; set; }
    }
}