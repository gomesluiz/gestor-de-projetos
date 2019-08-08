namespace Ferrero.GestorDeProjetos.Web.Models.Gantt
{
    public class VinculoViewModel
    {
        public int id { get; set; }
        public string type { get; set; }
        public int source { get; set; }
        public int target { get; set; }
 
        public static explicit operator VinculoViewModel(Vinculo link)
        {
            return new VinculoViewModel
            {
                id = link.Id,
                type = link.Type,
                source = link.SourceTaskId,
                target = link.TargetTaskId
            };
        }
 
        public static explicit operator Vinculo(VinculoViewModel link)
        {
            return new Vinculo
            {
                Id = link.id,
                Type = link.type,
                SourceTaskId = link.source,
                TargetTaskId = link.target
            };
        }
    }
}