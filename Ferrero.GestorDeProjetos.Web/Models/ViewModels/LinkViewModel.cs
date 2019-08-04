namespace Ferrero.GestorDeProjetos.Web.Models.ViewModels
{
    public class LinkViewModel
    {
        public int id { get; set; }
        public string type { get; set; }
        public int source { get; set; }
        public int target { get; set; }
 
        public static explicit operator LinkViewModel(Link link)
        {
            return new LinkViewModel
            {
                id = link.Id,
                type = link.Type,
                source = link.SourceTaskId,
                target = link.TargetTaskId
            };
        }
 
        public static explicit operator Link(LinkViewModel link)
        {
            return new Link
            {
                Id = link.id,
                Type = link.type,
                SourceTaskId = link.source,
                TargetTaskId = link.target
            };
        }
    }
}