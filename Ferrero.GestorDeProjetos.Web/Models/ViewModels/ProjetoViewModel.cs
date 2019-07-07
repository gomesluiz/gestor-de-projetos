using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de uma view de projeto.
    /// </summary>
    public class ProjetoViewModel 
    {
        public int Id { get; set; }

        [StringLength(50, ErrorMessage = "O nome do projeto deve possuir no máximo 50 caracteres.")]
        [Required(ErrorMessage = "Por favor, digite o nome do projeto.")]
        public string Nome { get; set; }

        [StringLength(250, ErrorMessage = "A descrição do projeto deve possuir no máximo 250 caracteres.")]
        public string Descricao { get; set; }
        
        [Display(Name = "Data de Início")]
        [Required(ErrorMessage = "Por favor, entre com a data de início do projeto.")]
        public string DataDeInicio { get; set; }
        
        [Display(Name = "Data de Término")]
        [Required(ErrorMessage = "Por favor, entre com a data estimada de término do projeto.")]
        public string DataDeTermino { get; set; }
        
        public OrdemDeInvestimentoViewModel OrdemDeInvestimento { get; set; }

        [Display(Name = "Concluído?")]
        public bool Concluido { get; set; }
    }
}