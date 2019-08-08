using System;

namespace Ferrero.GestorDeProjetos.Web.Models.Gantt
{
    public class Vinculo
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int SourceTaskId { get; set; }
        public int TargetTaskId { get; set; }
    }
}