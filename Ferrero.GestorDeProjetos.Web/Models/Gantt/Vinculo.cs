using Ferrero.GestorDeProjetos.Web.Models.Domain;

namespace Ferrero.GestorDeProjetos.Web.Models.Gantt
{
    public class Vinculo
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int SourceTaskId { get; set; }
        public int TargetTaskId { get; set; }
        public int ProjetoId { get; set; }
        public Projeto Projeto { get; set; }
    }
}