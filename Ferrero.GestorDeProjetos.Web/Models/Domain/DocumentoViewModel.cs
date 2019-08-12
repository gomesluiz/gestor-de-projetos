using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.Domain
{
    public class DocumentoViewModel
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Por favor, digite o título do documento.")]
        [StringLength(50
            , MinimumLength = 1
            , ErrorMessage  = "A {0} deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Titulo")]
        public string Titulo { get; set; }

        [StringLength(250
            , ErrorMessage  = "A {0} do documento deve possuir no máximo {1} caracteres.")]
        [Display(Name = "Descrição")]
        public string Descricao { get; set; }
        
        [Required(ErrorMessage = "Por favor, digite a versão do documento.")]
        [StringLength(10
            , MinimumLength = 1
            , ErrorMessage  = "A {0} deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Versão")]
        public string Versao { get; set; } 

        [Display(Name = "Arquivo")]
        public string Arquivo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Por favor, selecione identificador do projeto.")]
        [Display(Name = "Projeto")]
        public int ProjetoId { get; set; }

        public static explicit operator DocumentoViewModel(Documento documento)
        {
            return new DocumentoViewModel
            {
                Id = documento.Id,
                Titulo = documento.Titulo,
                Descricao = documento.Descricao,
                Versao = documento.Versao,
                Arquivo = documento.Arquivo,
                ProjetoId = documento.Projeto.Id,
            };
        }
        public static explicit operator Documento(DocumentoViewModel documento)
        {
            return new Documento
            {
                Id = documento.Id,
                Titulo = documento.Titulo,
                Descricao = documento.Descricao,
                Versao = documento.Versao,
                Arquivo = documento.Arquivo,
                ProjetoId = documento.ProjetoId
            };
        }
    }
}