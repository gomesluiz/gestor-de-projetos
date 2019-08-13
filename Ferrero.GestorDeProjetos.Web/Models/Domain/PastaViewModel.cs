using System.Collections.Generic;

namespace Ferrero.GestorDeProjetos.Web.Models.Domain
{
  public class PastaViewModel
    {
        public int ProjetoId { get; set; }
        public IEnumerable<DocumentoViewModel> Documentos { get; set; }

        public PastaViewModel(int projetoId, IEnumerable<DocumentoViewModel> documentos)
        {
            ProjetoId  = projetoId;
            Documentos = documentos;
        }
    }
}